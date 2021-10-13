# TODO: How to store GoogleNews vectors?
import dataclasses
import logging
import os
from dataclasses import dataclass
from pathlib import Path

import eland
import eland as ed
import nltk
import numpy
import numpy as np
import pandas
import pandas as pd
from gensim.models import Word2Vec
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from recommendation_engine.gw_elasticsearch import ElasticClient

_logger = logging.getLogger('recommendation_engine_logger')
_logger.setLevel(logging.INFO)
_console_handler = logging.StreamHandler()
_log_formatter = logging.Formatter('%(levelname)s - %(message)s')
_console_handler.setFormatter(_log_formatter)
_logger.addHandler(_console_handler)


@dataclass
class AppConfig:
    _current_working_dir: Path = Path.cwd()
    pretrained_model: Path = _current_working_dir / 'GoogleNews-vectors-negative300.bin'
    elasticsearch_url: str = os.environ.get('ELASTICSEARCH_URL')
    docs_index_name: str = os.environ.get('DOCS_INDEX_NAME')
    recommendations_index_name: str = os.environ.get('RECOMMENDATIONS_INDEX_NAME')
    product: str = os.environ.get('PRODUCT')
    platform: str = os.environ.get('PLATFORM')
    version: str = os.environ.get('VERSION')

    def get_app_config(self):
        missing_parameters = [
            field.name.upper().lstrip('_') for field in dataclasses.fields(self)
            if not getattr(self, field.name)
        ]
        if missing_parameters:
            raise SystemError(f'Missing environment variables:'
                              f'\n{", ".join(missing_parameters)}')
        return self


@dataclass
class TopicWithRecommendations:
    doc_id: str
    title: str
    id: str
    recommendations: list


@dataclass
class RecommendedTopic:
    doc_id: str
    title: str
    id: str


def remove_non_ascii(text: str) -> str:
    return "".join(i for i in text if ord(i) < 128)


def make_lower_case(text: str) -> str:
    return text.lower()


def remove_stop_words(text: str) -> str:
    text = text.split()
    stops = set(stopwords.words("english"))
    text = [w for w in text if w not in stops]
    text = " ".join(text)
    return text


def remove_punctuation(text: str) -> str:
    tokenizer = RegexpTokenizer(r'\w+')
    text = tokenizer.tokenize(text)
    text = " ".join(text)
    return text


def get_elasticsearch_df(es_url: str, es_index_name: str, product: str, platform: str, version: str) -> eland.DataFrame:
    ed_df = ed.DataFrame(es_url, es_index_name)
    return ed_df[(ed_df.product == product) & (ed_df.platform == platform) & (ed_df.version == version)]


def convert_elasticsearch_df_to_pandas_df(elasticsearch_df: eland.DataFrame) -> pandas.DataFrame:
    pandas_df = ed.eland_to_pandas(elasticsearch_df)
    # Reset the index, as currently it uses random values
    pandas_df_fresh_index = pandas_df.reset_index(inplace=False)

    pandas_df_body = pandas_df_fresh_index['body']
    pandas_df_body_no_ascii = pandas_df_body.apply(func=remove_non_ascii)
    pandas_df_body_lowercase = pandas_df_body_no_ascii.apply(func=make_lower_case)
    pandas_df_body_no_stop_words = pandas_df_body_lowercase.apply(func=remove_stop_words)
    pandas_df_body_no_punctuation = pandas_df_body_no_stop_words.apply(func=remove_punctuation)
    pandas_df_fresh_index['cleaned_body'] = pandas_df_body_no_punctuation

    pandas_df_subset = pandas_df_fresh_index[['doc_id', 'title', 'id', 'cleaned_body']]
    pandas_df_no_duplicates = pandas_df_subset.drop_duplicates(subset='title', keep='first', inplace=False)
    pandas_df_no_missing_values = pandas_df_no_duplicates.dropna(axis='index', how='any', subset=['title'], inplace=False)
    pandas_df_no_empty_rows = pandas_df_no_missing_values.drop(
        pandas_df_no_missing_values[pandas_df_no_missing_values['title'].str.isspace()].index)
    # Reset the index after dropping invalid rows
    return pandas_df_no_empty_rows.reset_index(inplace=False)


def create_corpus(dataframe: pandas.DataFrame) -> list[str]:
    return [words.split() for words in dataframe['cleaned_body']]


def train_model(corpus: list, pretrained_model_path: Path) -> Word2Vec:
    google_model = Word2Vec(size=300, window=5, min_count=2, workers=-1)
    google_model.build_vocab(corpus)

    google_model.intersect_word2vec_format(str(pretrained_model_path), binary=True, lockf=1.0,
                                           encoding="ISO-8859-1")

    google_model.train(corpus, total_examples=google_model.corpus_count, epochs=5)
    return google_model


def build_tfidf_model_and_calc_score(dataframe: pandas.DataFrame) -> tuple[list, dict]:
    tfidf = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=5, stop_words='english')
    tfidf.fit(dataframe['cleaned_body'])

    words = tfidf.get_feature_names_out()
    words_col_names = dict(zip(tfidf.get_feature_names_out(), list(tfidf.idf_)))
    return words, words_col_names


def build_tfidf_vectors(corpus: list, model: Word2Vec, tfidf_model_words: list,
                        tfidf_model_words_col_names: dict) -> list:
    vectors = []
    for desc in corpus:
        # Word vectors are of zero length (Used 300 dimensions)
        sent_vec = np.zeros(300)
        # num of words with a valid vector in the book description
        weight_sum = 0
        for word in desc:
            if word in model.wv.vocab and word in tfidf_model_words:
                vec = model.wv[word]
                tf_idf = tfidf_model_words_col_names[word] * (desc.count(word) / len(desc))
                sent_vec += (vec * tf_idf)
                weight_sum += tf_idf
        if weight_sum != 0:
            sent_vec /= weight_sum
        vectors.append(sent_vec)
    return vectors


def get_recommendations(title: str, dataframe: pandas.DataFrame,
                        vectors: list[numpy.ndarray]) -> list[RecommendedTopic]:
    cosine_similarities = cosine_similarity(vectors, vectors)
    topics_indices = pd.Series(dataframe.index, index=dataframe['title'])
    idx = topics_indices[title]
    sim_scores = list(enumerate(cosine_similarities[idx]))
    sorted_sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # Why don't we take scores from 0 to 5?
    top_five_sim_scores = sorted_sim_scores[1:6]
    book_indices = [i[0] for i in top_five_sim_scores]
    recommend = dataframe.iloc[book_indices]

    return [
        RecommendedTopic(doc_id=row['doc_id'], title=row['title'], id=row['id'])
        for index, row in recommend.iterrows()
    ]


def main():
    recommendation_engine_config = AppConfig().get_app_config()
    elasticsearch_dataframe = get_elasticsearch_df(recommendation_engine_config.elasticsearch_url,
                                                   recommendation_engine_config.docs_index_name,
                                                   recommendation_engine_config.product,
                                                   recommendation_engine_config.platform,
                                                   recommendation_engine_config.version)
    pandas_dataframe = convert_elasticsearch_df_to_pandas_df(elasticsearch_dataframe)

    def train_model_and_create_vectors():
        nltk.download('stopwords')
        clean_corpus = create_corpus(pandas_dataframe)
        trained_corpus = train_model(clean_corpus, recommendation_engine_config.pretrained_model)
        tfidf_words, tfidf_words_col_names = build_tfidf_model_and_calc_score(pandas_dataframe)
        tfidf_vectors = build_tfidf_vectors(clean_corpus, trained_corpus, tfidf_words, tfidf_words_col_names)

        return tfidf_vectors

    def build_and_upload_recommendations(vectors):
        elastic_client = ElasticClient([recommendation_engine_config.elasticsearch_url], use_ssl=False,
                                       verify_certs=False,
                                       ssl_show_warn=False)
        elastic_client.create_index(
            recommendation_engine_config.recommendations_index_name, elastic_client.main_index_settings)
        number_of_created_entries = 0
        failed_entries = []
        dataframe_rows = [row for index, row in pandas_dataframe.iterrows()]

        for df_row in dataframe_rows:
            topic_title = df_row['title']
            topic_id = df_row['id']
            topic_doc_id = df_row['doc_id']
            elastic_client.delete_entry_by_query(recommendation_engine_config.recommendations_index_name,
                                                 id_to_delete=topic_id)
            topic_recommendations = get_recommendations(topic_title, pandas_dataframe, vectors)

            if topic_recommendations:
                index_entry = dataclasses.asdict(TopicWithRecommendations(
                    doc_id=topic_doc_id,
                    title=topic_title,
                    id=topic_id,
                    recommendations=topic_recommendations
                ))
                create_operation_result = elastic_client.create_entry(
                    index_name=recommendation_engine_config.recommendations_index_name,
                    index_entry=index_entry)
                if create_operation_result:
                    number_of_created_entries += 1
                else:
                    failed_entries.append(index_entry)

        return number_of_created_entries, failed_entries

    _logger.info(
        f'Preparing recommendations for '
        f'{recommendation_engine_config.product}, '
        f'{recommendation_engine_config.platform}, '
        f'{recommendation_engine_config.version}')
    _logger.info(f'Training the model and building vectors')
    doc_vectors = train_model_and_create_vectors()
    _logger.info('Building and uploading recommendations')
    number_of_successful_uploads, failed_uploads = build_and_upload_recommendations(doc_vectors)
    _logger.info(
        f'Created entries/Failures: {number_of_successful_uploads}/{len(failed_uploads)}')
    if failed_uploads:
        _logger.error('Failed to load the following entries:')
        _logger.error('\t\t'.join(upload['id'] for upload in failed_uploads))
    _logger.info('DONE')


if __name__ == '__main__':
    main()
