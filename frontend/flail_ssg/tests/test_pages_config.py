import json
import json
import os
import shutil
from collections import namedtuple
from pathlib import Path

import pytest

import flail_ssg.validator
from flail_ssg.generator import generate_search_filters
from flail_ssg.preprocessor import clean_pages, filter_by_env, remove_refs_to_empty_and_non_existent_pages, process_pages, \
    remove_empty_dirs, remove_items_with_empty_child_items, remove_page_dirs
from flail_ssg.validator import DocIdNotFoundError, PageNotFoundError, run_validator, validate_env_settings, \
    validate_page


class TestConfig:
    _current_dir = Path(__file__).parent
    _frontend_dir = _current_dir.parent.parent
    send_bouncer_home = False
    docs_config_file = Path(os.environ['DOCS_CONFIG_FILE'])
    page_schema_file = _frontend_dir / 'page-schema.json'
    pages_dir = _frontend_dir / 'pages'
    resources_input_dir = _current_dir / 'resources' / 'input'
    resources_expected_dir = _current_dir / 'resources' / 'expected'
    expected_incorrect_pages_dir = resources_expected_dir / 'incorrect-pages'
    incorrect_pages_dir = resources_input_dir / 'incorrect-pages'
    incorrect_pages_items_dir = incorrect_pages_dir / 'incorrect-items'
    incorrect_pages_env_settings_dir = incorrect_pages_dir / 'incorrect-env-settings'
    incorrect_pages_empty_items = incorrect_pages_dir / 'empty-items'
    expected_incorrect_pages_empty_items = expected_incorrect_pages_dir / 'empty-items'
    incorrect_pages_empty_child_items = incorrect_pages_dir / 'empty-child-items'
    expected_incorrect_pages_empty_child_items = expected_incorrect_pages_dir / 'empty-child-items'
    incorrect_pages_clean_pages = incorrect_pages_dir / 'clean-pages'
    expected_incorrect_pages_clean_pages = expected_incorrect_pages_dir / 'clean-pages'
    incorrect_pages_docs_config_file = incorrect_pages_dir / 'config.json'


def load_json_file(file_path: Path):
    file_path_absolute = file_path.resolve()
    return json.load(file_path_absolute.open())


def prepare_paths_for_comparison(root_dir: Path, paths: list[Path]):
    return [str(p).replace(f'{root_dir}/', '') for p in paths]


@pytest.fixture(scope='module')
def load_docs_from_main_config():
    return load_json_file(TestConfig.resources_input_dir / 'config' / 'docs' / 'docs.json')['docs']


@pytest.fixture(scope='module')
def load_docs_from_incorrect_pages_config():
    return load_json_file(TestConfig.incorrect_pages_docs_config_file)['docs']


def test_filtering_by_env(load_docs_from_main_config):
    def test_filtering_items(filtered_items: list, filtered_pages_to_remove: list, expected_items: list,
                             expected_filtered_pages_to_remove: list, test_dir: Path):
        assert filtered_items == expected_items
        filtered_pages_to_remove_str = prepare_paths_for_comparison(test_dir, filtered_pages_to_remove)
        assert len(filtered_pages_to_remove_str) == len(expected_filtered_pages_to_remove)
        assert sorted(filtered_pages_to_remove_str) == sorted(expected_filtered_pages_to_remove)

    def test_removing_filtered_out_pages(actually_removed_dirs: list, actual_removal_failures: list,
                                         filtered_pages_to_remove: list, expected_removal_failures: list,
                                         test_dir: Path):
        def test_filtered_pages_not_in_output():
            page_dirs_in_test_dir = [i for i in test_dir.rglob('*') if i.is_dir()]
            assert all(page_to_remove not in page_dirs_in_test_dir for page_to_remove in filtered_pages_to_remove)

        def test_failed_removals_are_expected():
            actual_removal_failures_str = [str(f['path']).replace(f'{test_dir}/', '') for f in actual_removal_failures]
            assert len(actual_removal_failures) == len(expected_removal_failures)
            assert sorted(actual_removal_failures_str) == sorted(expected_removal_failures)

        def test_removed_dirs_are_correct():
            filtered_pages_to_remove_str = prepare_paths_for_comparison(test_dir, filtered_pages_to_remove)
            actually_removed_dirs_str = prepare_paths_for_comparison(test_dir, actually_removed_dirs)
            expected_removed_dirs = [d for d in filtered_pages_to_remove_str if d not in expected_removal_failures]
            assert len(actually_removed_dirs) == len(expected_removed_dirs)
            assert sorted(actually_removed_dirs_str) == sorted(expected_removed_dirs)

        test_filtered_pages_not_in_output()
        test_failed_removals_are_expected()
        test_removed_dirs_are_correct()

    def test_filtering_by_env_self_managed():
        input_items = \
            load_json_file(
                TestConfig.resources_input_dir / 'pages' / 'filter-by-env' / 'selfManagedProducts' / 'index.json')[
                'items']
        tmp_test_dir = TestConfig.resources_input_dir / 'tmp-test-dir-filter-env-self-managed'
        shutil.copytree(TestConfig.resources_input_dir / 'pages' / 'filter-by-env' / 'selfManagedProducts',
                        tmp_test_dir, dirs_exist_ok=True)

        items_after_filtering, pages_to_remove_after_filtering = filter_by_env(deploy_env='staging',
                                                                               current_page_dir=tmp_test_dir,
                                                                               items=input_items,
                                                                               docs=load_docs_from_main_config)
        removed_dirs, removal_failures = remove_page_dirs(pages_to_remove_after_filtering)
        expected_file = (
                TestConfig.resources_expected_dir / 'pages' / 'filter-by-env' / 'selfManagedProducts' / 'index.json')
        expected_items = load_json_file(expected_file)['items']
        expected_filtered_pages_to_remove = [
            'dataHub/10.x',
            'infoCenter/10.x',
            'customerEngageAccountManagement/latest',
            'customerEngageAccountManagementCc/latest',
            'customerEngageQuoteAndBuy/latest',
            'producerEngage/latest',
            'producerEngageCc/latest',
            'serviceRepEngage/latest',
            'vendorEngage/latest'
        ]
        test_filtering_items(items_after_filtering, pages_to_remove_after_filtering,
                             expected_items, expected_filtered_pages_to_remove, tmp_test_dir)
        # There are no dirs to remove so failures are expected
        assert len(removed_dirs) == 0
        assert len(removal_failures) == len(pages_to_remove_after_filtering)
        shutil.rmtree(tmp_test_dir)

    def test_filtering_by_env_dobson():
        input_items = \
            load_json_file(
                TestConfig.resources_input_dir / 'pages' / 'filter-by-env' / 'cloudProducts' / 'dobson' / 'index.json')[
                'items']
        tmp_test_dir = TestConfig.resources_input_dir / 'tmp-test-dir-filter-env-dobson'
        shutil.copytree(TestConfig.resources_input_dir / 'pages' / 'filter-by-env' / 'cloudProducts' / 'dobson',
                        tmp_test_dir, dirs_exist_ok=True)

        items_after_filtering, pages_to_remove_after_filtering = filter_by_env(deploy_env='int',
                                                                               current_page_dir=tmp_test_dir,
                                                                               items=input_items,
                                                                               docs=load_docs_from_main_config)
        removed_dirs, failed_removals = remove_page_dirs(pages_to_remove_after_filtering)
        expected_file = (
                TestConfig.resources_expected_dir / 'pages' / 'filter-by-env' / 'cloudProducts' / 'dobson' / 'index.json')
        expected_items = load_json_file(expected_file)['items']
        expected_filtered_pages_to_remove = [
            'pcGwCloud/2021.11',
            'ccGwCloud/2021.11',
            'bcGwCloud/2021.11',
            'dhGwCloud/2021.11',
            'icGwCloud/2021.11',
            'ceAccountMgmt/2021.11',
            'ceAccountMgmtCc/2021.11',
            'ceQuoteAndBuy/2021.11',
            'producerEngage/2021.11',
            'producerEngageCc/2021.11',
            'serviceRepEngage/2021.11',
            'vendorEngage/2021.11'
        ]
        expected_failed_removals = []

        test_filtering_items(items_after_filtering, pages_to_remove_after_filtering,
                             expected_items, expected_filtered_pages_to_remove, tmp_test_dir)
        test_removing_filtered_out_pages(removed_dirs, failed_removals, pages_to_remove_after_filtering,
                                         expected_failed_removals, tmp_test_dir)
        shutil.rmtree(tmp_test_dir)

    def test_filtering_by_env_elysian():
        input_items = \
            load_json_file(
                TestConfig.resources_input_dir / 'pages' / 'filter-by-env' / 'cloudProducts' / 'elysian' / 'index.json')[
                'items']
        tmp_test_dir = TestConfig.resources_input_dir / 'tmp-test-dir-filter-env-elysian'
        shutil.copytree(TestConfig.resources_input_dir / 'pages' / 'filter-by-env' / 'cloudProducts' / 'elysian',
                        tmp_test_dir, dirs_exist_ok=True)

        items_after_filtering, pages_to_remove_after_filtering = filter_by_env(deploy_env='prod',
                                                                               current_page_dir=tmp_test_dir,
                                                                               items=input_items,
                                                                               docs=load_docs_from_main_config)
        removed_dirs, failed_removals = remove_page_dirs(pages_to_remove_after_filtering)
        expected_file = (
                TestConfig.resources_expected_dir / 'pages' / 'filter-by-env' / 'cloudProducts' / 'elysian' / 'index.json')
        expected_items = load_json_file(expected_file)['items']
        expected_filtered_pages_to_remove = [
            '../cloudDataAccess/latest',
            'dhGwCloud/latest',
            'icGwCloud/latest',
            'assess',
            '../explore/latest',
            'ceAccountMgmt/latest',
            'ceAccountMgmtCc/latest',
            'ceQuoteAndBuy/latest',
            'producerEngage/latest',
            'producerEngageCc/latest',
            'serviceRepEngage/latest',
            'vendorEngage/latest',
            '../../jutroDesignSystem/6.5.1'
        ]
        expected_failed_removals = [
            '../cloudDataAccess/latest',
            '../explore/latest',
            '../../jutroDesignSystem/6.5.1'
        ]

        test_filtering_items(items_after_filtering, pages_to_remove_after_filtering,
                             expected_items, expected_filtered_pages_to_remove, tmp_test_dir)
        test_removing_filtered_out_pages(removed_dirs, failed_removals, pages_to_remove_after_filtering,
                                         expected_failed_removals, tmp_test_dir)
        shutil.rmtree(tmp_test_dir)

    test_filtering_by_env_self_managed()
    test_filtering_by_env_dobson()
    test_filtering_by_env_elysian()


def test_creating_search_filters():
    docs = load_json_file(TestConfig.resources_input_dir / 'config' / 'docs' / 'docs.json')['docs']
    input_dir = TestConfig.resources_input_dir / 'pages' / 'create-search-filters' / 'cloudProducts' / 'cortina' / 'policyCenterCloud'
    expected_dir = TestConfig.resources_expected_dir / 'pages' / 'create-search-filters' / 'cloudProducts' / 'cortina' / 'policyCenterCloud'
    for index_json_file in input_dir.rglob('*.json'):
        index_file_json = load_json_file(index_json_file)
        tmp_test_dir = TestConfig.resources_input_dir / 'tmp-test-dir-search-filters'
        shutil.copytree(input_dir, tmp_test_dir, dirs_exist_ok=True)

        search_filters = generate_search_filters(
            page_config_json=index_file_json,
            docs=docs)

        expected_index_json_file = Path(str(index_json_file).replace(str(input_dir), str(expected_dir)))
        expected_search_filters = load_json_file(expected_index_json_file).get('search_filters', {})
        assert search_filters == expected_search_filters
        shutil.rmtree(tmp_test_dir)


def test_all_pages_are_valid():
    run_validator(TestConfig.send_bouncer_home,
                  TestConfig.pages_dir,
                  TestConfig.docs_config_file,
                  TestConfig.page_schema_file)


def test_validation_for_incorrect_items(load_docs_from_incorrect_pages_config):
    docs = load_docs_from_incorrect_pages_config
    results = []
    for index_json_file in TestConfig.incorrect_pages_items_dir.rglob('*.json'):
        results += validate_page(index_json_file, docs)
    incorrect_ids = [r for r in results if type(r) is DocIdNotFoundError]
    incorrect_pages = [r for r in results if type(r) is PageNotFoundError]
    assert len(incorrect_ids) == 5
    assert len(incorrect_pages) == 4


def test_validation_for_incorrect_env_settings(load_docs_from_incorrect_pages_config):
    docs = load_docs_from_incorrect_pages_config
    all_validated_pages = []
    all_envs_validation_results = []
    for index_json_file in TestConfig.incorrect_pages_env_settings_dir.rglob('*.json'):
        envs_validation_results, validated_pages = validate_env_settings(
            index_json_file,
            docs,
            envs=[],
            validated_pages=all_validated_pages,
            validation_results=all_envs_validation_results,
        )
        all_envs_validation_results = envs_validation_results
        all_validated_pages = validated_pages
    assert len(all_envs_validation_results) == 5


def test_running_validator_for_incorrect_items():
    with pytest.raises(SyntaxError, match=r'.*errors.*9'):
        run_validator(TestConfig.send_bouncer_home,
                      TestConfig.incorrect_pages_items_dir,
                      TestConfig.incorrect_pages_docs_config_file,
                      TestConfig.page_schema_file)


def test_running_validator_for_incorrect_env_settings():
    with pytest.warns(SyntaxWarning, match=r'.*warnings.*5'):
        run_validator(TestConfig.send_bouncer_home,
                      TestConfig.incorrect_pages_env_settings_dir,
                      TestConfig.incorrect_pages_docs_config_file,
                      TestConfig.page_schema_file)


def test_env_settings():
    def test_id_item_with_item_envs():
        EnvSettings = namedtuple('EnvSettings', 'parent_envs item_envs doc_config_envs')
        correct_settings = [
            EnvSettings(['dev', 'staging', 'prod'], ['dev', 'staging'], ['dev', 'staging', 'prod']),
            EnvSettings(['staging', 'prod'], ['staging'], ['dev', 'int', 'staging', 'prod']),
            EnvSettings([], ['int'], ['dev', 'int'])
        ]

        incorrect_settings = [
            EnvSettings(['dev', 'staging', 'prod'], ['dev', 'int', 'staging'], ['dev', 'int', 'staging', 'prod']),
            EnvSettings(['staging', 'prod'], ['prod'], ['dev', 'int', 'staging']),
            EnvSettings([], ['int'], ['dev', 'staging', 'prod'])
        ]

        for i in correct_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0]) \
                                   and \
                                   flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[2])
            assert env_settings_correct is True

        for i in incorrect_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0]) \
                                   and \
                                   flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[2])
            assert env_settings_correct is False

    def test_id_item_without_item_envs():
        EnvSettings = namedtuple('EnvSettings', 'parent_envs doc_config_envs')
        correct_settings = [
            EnvSettings(['dev', 'staging', 'prod'], ['dev', 'int', 'staging']),
            EnvSettings(['int'], ['dev', 'int', 'staging']),
            EnvSettings([], ['int'])
        ]

        incorrect_settings = [
            EnvSettings(['dev'], ['int']),
            EnvSettings(['dev', 'int'], ['staging', 'prod']),
            EnvSettings(['staging', 'prod'], ['dev', 'int'])
        ]

        for i in correct_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0],
                                                                                partial_match=True)
            assert env_settings_correct is True

        for i in incorrect_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0],
                                                                                partial_match=True)
            assert env_settings_correct is False

    def test_other_item():
        EnvSettings = namedtuple('EnvSettings', 'parent_envs item_envs')
        correct_settings = [
            EnvSettings(['dev', 'staging', 'prod'], ['dev', 'staging']),
            EnvSettings(['dev', 'int'], ['int'], ),
            EnvSettings([], ['dev']),
            EnvSettings(['staging', 'prod'], [])
        ]

        incorrect_settings = [
            EnvSettings(['dev'], ['int']),
            EnvSettings(['dev', 'int'], ['staging', 'prod']),
            EnvSettings(['staging', 'prod'], ['dev', 'int'])
        ]

        for i in correct_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0])
            assert env_settings_correct is True

        for i in incorrect_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0])
            assert env_settings_correct is False

    test_id_item_with_item_envs()
    test_id_item_without_item_envs()
    test_other_item()


def test_removing_refs_to_empty_pages():
    input_dir = TestConfig.incorrect_pages_empty_items
    expected_dir = TestConfig.expected_incorrect_pages_empty_items
    expected_pages_to_remove = ['gwsf/nonExistentGuide/index.json', 'assess/index.json']

    all_pages_to_remove = []
    for input_file in input_dir.rglob('*.json'):
        for expected_file in expected_dir.rglob('*.json'):
            if input_file.relative_to(input_dir) == expected_file.relative_to(expected_dir):
                input_file_items = load_json_file(input_file)['items']
                expected_file_items = load_json_file(expected_file)['items']
                items_with_no_refs_to_empty_pages, empty_pages_to_remove = remove_refs_to_empty_and_non_existent_pages(
                    input_file.parent, input_file_items)
                all_pages_to_remove += empty_pages_to_remove
                assert items_with_no_refs_to_empty_pages == expected_file_items
    assert len(all_pages_to_remove) == 2
    assert sorted([Path(input_dir / p) for p in expected_pages_to_remove]) == sorted(all_pages_to_remove)


def test_removing_items_with_empty_child_items():
    input_dir = TestConfig.incorrect_pages_empty_child_items
    expected_dir = TestConfig.expected_incorrect_pages_empty_child_items

    for input_file in input_dir.rglob('*.json'):
        for expected_file in expected_dir.rglob('*.json'):
            if input_file.relative_to(input_dir) == expected_file.relative_to(expected_dir):
                input_file_items = load_json_file(input_file)['items']
                expected_file_items = load_json_file(expected_file)['items']
                items_with_no_empty_child_items = remove_items_with_empty_child_items(input_file_items)
                assert items_with_no_empty_child_items == expected_file_items


def check_dirs_have_the_same_files(output_dir: Path, expected_dir: Path):
    output_dir_files = sorted(f.relative_to(output_dir) for f in output_dir.rglob('*.json'))
    expected_files = sorted(f.relative_to(expected_dir) for f in expected_dir.rglob('*.json'))
    assert output_dir_files == expected_files


def check_files_have_the_same_content(output_dir: Path, expected_dir: Path):
    for output_file in output_dir.rglob('*.json'):
        for expected_file in expected_dir.rglob('*.json'):
            if output_file.relative_to(output_dir) == expected_file.relative_to(expected_dir):
                tmp_test_file_json = load_json_file(output_file)
                expected_file_json = load_json_file(expected_file)
                assert tmp_test_file_json == expected_file_json


def test_cleaning_pages():
    input_dir = TestConfig.incorrect_pages_clean_pages
    expected_dir = TestConfig.expected_incorrect_pages_clean_pages
    tmp_test_dir = TestConfig.incorrect_pages_dir / 'tmp-test-dir-clean-pages'

    shutil.copytree(input_dir, tmp_test_dir, dirs_exist_ok=True)
    clean_pages(tmp_test_dir, send_bouncer_home=False)

    check_dirs_have_the_same_files(tmp_test_dir, expected_dir)
    check_files_have_the_same_content(tmp_test_dir, expected_dir)
    shutil.rmtree(tmp_test_dir)


def test_processing_pages(load_docs_from_main_config):
    """Both pages link to the same set of pages and documents but they have different env settings.
    Expected behaviour: Linked pages are removed if they don't match the env settings.
    If one page has env settings that include a linked page and the other page has env settings that exclude the same
    linked page, the linked page is removed.
    IMPORTANT: This test doesn't contain the step for cleaning pages. Therefore, the Dobson expected file contains
    links to pages that were removed (Cloud Data Access, Explore, Feature Preview)."""
    input_dir = TestConfig.resources_input_dir / 'pages' / 'process-pages'
    expected_dir = TestConfig.resources_expected_dir / 'pages' / 'process-pages'

    tmp_test_dir = TestConfig.resources_input_dir / 'tmp-test-dir-process-pages'
    shutil.copytree(input_dir,
                    tmp_test_dir, dirs_exist_ok=True)

    process_pages(tmp_test_dir, 'prod', load_docs_from_main_config, False)
    remove_empty_dirs(tmp_test_dir, removed_dirs=[], failed_removals=[])

    check_dirs_have_the_same_files(tmp_test_dir, expected_dir)
    check_files_have_the_same_content(tmp_test_dir, expected_dir)
    shutil.rmtree(tmp_test_dir)
