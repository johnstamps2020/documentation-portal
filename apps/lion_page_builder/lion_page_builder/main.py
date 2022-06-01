import json
import os
import re
import shutil
from pathlib import Path

from PyPDF2 import PdfFileReader
from natsort import natsorted, ns

locale_codes_labels = {
    'de-DE': {'label': 'Deutsch',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'},
    'es-ES': {'label': 'Español (España)',
              'localeSelect': 'Seleccione el idioma',
              'productSelect': 'Seleccionar producto'},
    'es-LA': {'label': 'Español',
              'localeSelect': 'Seleccione el idioma',
              'productSelect': 'Seleccionar producto'},
    'fr-FR': {'label': 'Français',
              'localeSelect': 'Choisir la langue',
              'productSelect': 'Choisissez un produit'},
    'it-IT': {'label': 'Italiano',
              'localeSelect': 'Seleziona la lingua',
              'productSelect': 'Seleziona il prodotto'},
    'ja-JP': {'label': '日本語',
              'localeSelect': '言語を選択する',
              'productSelect': '製品を選択'},
    'nl-NL': {'label': 'Nederlands',
              'localeSelect': 'Selecteer taal',
              'productSelect': 'Selecteer product'},
    'pt-BR': {'label': 'Português',
              'localeSelect': 'Selecione o idioma',
              'productSelect': 'Selecione o produto'},
    'ru': {'label': 'Pусский',
           'localeSelect': 'Выбрать язык',
           'productSelect': 'Выбрать продукт'},
    'zh-CN': {'label': 'Chinese',
              'localeSelect': '选择语言',
              'productSelect': '选择产品'}
}

product_codes_labels = {
    'bc': {'label': 'BillingCenter'},
    'cc': {'label': 'ClaimCenter'},
    'pc': {'label': 'PolicyCenter'},
    'dh': {'label': 'DataHub'},
    'ic': {'label': 'InfoCenter'},
    'ce-am': {'label': 'CustomerEngage Account Management'},
    'ce-claims': {'label': 'CustomerEngage Account Management for ClaimCenter'},
    'ce-qb': {'label': 'CustomerEngage Quote and Buy'},
    'pe': {'label': 'ProducerEngage'},
    'pe-claims': {'label': 'ProducerEngage for ClaimCenter'},
    'sre': {'label': 'ServiceRepEngage'},
    've': {'label': 'VendorEngage'},
    'is-configupgradetools': {'label': 'InsuranceSuite Configuration Upgrade Tools'},
    'gcc': {'label': 'Guidewire Cloud Console'},
    'cda': {'label': 'Cloud Data Access'},
    'explore': {'label': 'Explore'},
    'ipf': {'label': 'ClaimCenter Package for France'},
    'ipg': {'label': 'Global Solutions - Germany'}
}


def get_locale_name_from_code(code: str) -> str:
    if locale_codes_labels.get(code):
        return locale_codes_labels.get(code).get('label')
    else:
        return 'Undefined'


def get_product_name_from_code(code: str) -> str:
    if product_codes_labels.get(code):
        return product_codes_labels.get(code).get('label')
    else:
        return 'Undefined'


def get_locale_selector_label_from_code(code: str) -> str:
    if locale_codes_labels.get(code) and locale_codes_labels.get(code).get(
            'localeSelect'
    ):
        return locale_codes_labels.get(code).get('localeSelect')
    else:
        return 'Select locale'


def get_product_selector_label_from_code(code: str) -> str:
    if locale_codes_labels.get(code) and locale_codes_labels.get(code).get(
            'productSelect'
    ):
        return locale_codes_labels.get(code).get('productSelect')
    else:
        return 'Select product'


def get_paths(path: Path) -> []:
    return [f for f in path.iterdir() if f.is_dir() and not f.name.startswith('.')]


def get_sibling_paths(path: Path) -> []:
    return [
        f
        for f in path.parent.iterdir()
        if f.is_dir() and f != path and not f.name.startswith('.')
    ]


def write_top_index(locale_dirs: [], loc_docs_output_path: Path):
    index_json = {
        "$schema": "/frontend/page-schema.json",
        "title": "Translated Documentation",
        "template": "page",
        "class": "threeCards l10n",
        "items": []
    }

    for d in locale_dirs:
        locale_label = get_locale_name_from_code(d.name)

        index_json["items"].append(
            {
                "label": locale_label,
                "class": "productFamily cardShadow",
                "page": d.name
            }
        )

    with open(loc_docs_output_path / 'index.json', 'w', encoding='utf-8') as outfile:
        json.dump(index_json, outfile, indent=2, ensure_ascii=False)


def write_locale_index(locale_path, loc_docs_output_path):
    index_json = {
        "$schema": "/frontend/page-schema.json",
        "title": get_locale_name_from_code(locale_path.name),
        "template": "page",
        "class": f"threeCards product {locale_path.name} l10n",
        "items": []
    }
    if sibling_paths := get_sibling_paths(locale_path):
        sibling_paths.sort()
        index_json["selector"] = {"label": get_locale_selector_label_from_code(locale_path.name), "selectedItem": get_locale_name_from_code(locale_path.name), "items": []}

        for path in sibling_paths:
            index_json["selector"]["items"].append({"label": get_locale_name_from_code(path.name), "page": f"../{path.name}"})


    product_paths = get_paths(locale_path)
    product_paths.sort()
    for product_path in product_paths:
        index_json["items"].append(
            {
                "label": get_product_name_from_code(product_path.name),
                "class": "productFamily cardShadow",
                "page": product_path.name
            }
        )

    Path.mkdir(loc_docs_output_path / locale_path.name)
    with open(loc_docs_output_path / locale_path.name / 'index.json', 'w', encoding='utf-8') as outfile:
        json.dump(index_json, outfile, indent=2, ensure_ascii=False)


def write_product_index(product_path, loc_docs_output_path, loc_docs_root_path):
    index_json = {
        "$schema": "/frontend/page-schema.json",
        "title": get_product_name_from_code(product_path.name),
        "template": "page",
        "class": f"threeCards version {product_path.parent.name} l10n",
        "items": []
    }

    if sibling_paths := get_sibling_paths(product_path):
        sibling_paths.sort()
        index_json["selector"] = {"label": get_product_selector_label_from_code(product_path.parent.name), "selectedItem": get_product_name_from_code(product_path.name), "items": []}

        for path in sibling_paths:
            index_json["selector"]["items"].append({"label": get_product_name_from_code(path.name), "page": f"../{path.name}"})


    version_paths = get_paths(product_path)
    version_paths = natsorted(
        version_paths, alg=ns.PATH, reverse=True)
    for version_path in version_paths:
        version_json = {
            "label": version_path.name,
            "class": "categoryCard cardShadow",
            "items": []
        }

        for pdf_file in version_path.glob('*.pdf'):
            with open(pdf_file, 'rb') as f:
                pdf = PdfFileReader(f)
                pdf_info = pdf.getDocumentInfo()

            short_title = re.sub(
                "^\\d+", "", pdf_info.title.rpartition('.')[2]).strip()

            pdf_link = pdf_file.relative_to(loc_docs_root_path)

            version_json["items"].append({"label": short_title, "link": f'/{loc_docs_output_path.name}/' + str(pdf_link).replace('\\', '/')})


        index_json["items"].append(version_json)

    Path.mkdir(loc_docs_output_path /
               product_path.parent.name / product_path.name)
    with open(loc_docs_output_path / product_path.parent.name / product_path.name / 'index.json', 'w',
              encoding='utf-8') as outfile:
        json.dump(index_json, outfile, indent=2, ensure_ascii=False)


def prepare_output_dir(output_dir: Path):
    shutil.rmtree(output_dir, ignore_errors=True)
    output_dir.mkdir(parents=True)


# TODO: by default check for PDFs in the folders to avoid creating
#       configs that go nowhere. Give an option to ignore that as
#       it is useful for testing to build more.
# TODO: add readme.md
# TODO: add logging, including errors for undefined locales or product codes
# TODO: add strict mode
# TODO: catch empty PDF title and use file name instead or throw error
# TODO: default output path if not specified


def main():
    loc_docs_root_path = Path(os.environ['LOC_DOCS_SRC'])
    loc_docs_output_path = Path(os.environ['LOC_DOCS_OUT'])
    prepare_output_dir(loc_docs_output_path)

    locale_dirs = get_paths(loc_docs_root_path)
    locale_dirs.sort()
    write_top_index(locale_dirs, loc_docs_output_path)

    for locale_dir in locale_dirs:
        write_locale_index(locale_dir, loc_docs_output_path)
        product_dirs = get_paths(locale_dir)
        product_dirs.sort()
        for product_dir in product_dirs:
            write_product_index(
                product_dir, loc_docs_output_path, loc_docs_root_path)


if __name__ == '__main__':
    main()
