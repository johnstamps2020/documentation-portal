import json
import os
import re
from pathlib import Path

from PyPDF2 import PdfFileReader

locale_codes_labels = {
    'de-DE': {'label': 'Deutsch',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'},
    'es-ES': {'label': 'Español (España)',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'},
    'es-LA': {'label': 'Español',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'},
    'fr-FR': {'label': 'Français',
              'localeSelect': 'Choisir la langue',
              'productSelect': 'Choisissez un produit'},
    'it-IT': {'label': 'Italiano',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'},
    'ja-JP': {'label': '日本語',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'},
    'nl-NL': {'label': 'Nederlands',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'},
    'pt-BR': {'label': 'Português',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'},
    'ru': {'label': 'Pусский',
           'localeSelect': 'Sprache wählen',
           'productSelect': 'Produkt auswählen'},
    'zh-CN': {'label': 'Chinese',
              'localeSelect': 'Sprache wählen',
              'productSelect': 'Produkt auswählen'}
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
    if locale_codes_labels.get(code):
        if locale_codes_labels.get(code).get('localeSelect'):
            return locale_codes_labels.get(code).get('localeSelect')
        else:
            return 'Select locale'
    else:
        return 'Select locale'


def get_product_selector_label_from_code(code: str) -> str:
    if locale_codes_labels.get(code):
        if locale_codes_labels.get(code).get('productSelect'):
            return locale_codes_labels.get(code).get('productSelect')
        else:
            return 'Select product'
    else:
        return 'Select product'


def get_paths(path: Path) -> []:
    paths = []
    for f in path.iterdir():
        if f.is_dir():
            paths.append(f)
    return paths


def get_sibling_paths(path: Path) -> []:
    paths = []
    for f in path.parent.iterdir():
        if f.is_dir() and f != path:
            paths.append(f)
    return paths


def write_top_index(locale_dirs: [], loc_docs_output_path: Path):
    index_json = {
        "$schema": "/frontend/page-schema.json",
        "title": "Localized Documentation",
        "template": "page.j2",
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
        "template": "page.j2",
        "class": f"threeCards product {locale_path.name} l10n",
        "selector": {
            "label": get_locale_selector_label_from_code(locale_path.name),
            "selectedItem": get_locale_name_from_code(locale_path.name),
            "items": []
        },
        "items": []
    }

    for path in get_sibling_paths(locale_path):
        index_json["selector"]["items"].append(
            {
                "label": get_locale_name_from_code(path.name),
                "page": "../" + path.name
            }
        )

    product_paths = get_paths(locale_path)
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
        "template": "page.j2",
        "class": f"threeCards version {product_path.parent.name} l10n",
        "selector": {
            "label": get_product_selector_label_from_code(product_path.parent.name),
            "selectedItem": get_product_name_from_code(product_path.name),
            "items": []
        },
        "items": []
    }

    for path in get_sibling_paths(product_path):
        index_json["selector"]["items"].append(
            {
                "label": get_product_name_from_code(path.name),
                "page": "../" + path.name
            }
        )

    version_paths = get_paths(product_path)
    for version_path in reversed(version_paths):
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

            version_json["items"].append(
                {
                    "label": short_title,
                    "link": '/' + str(pdf_link).replace('\\', '/')
                }
            )

        index_json["items"].append(version_json)

    Path.mkdir(loc_docs_output_path /
               product_path.parent.name / product_path.name)
    with open(loc_docs_output_path / product_path.parent.name / product_path.name / 'index.json', 'w',
              encoding='utf-8') as outfile:
        json.dump(index_json, outfile, indent=2, ensure_ascii=False)


def clear_output(loc_docs_output_path: Path):
    if loc_docs_output_path.exists():
        try:
            empty_tree(loc_docs_output_path)
        except OSError as e:
            print("Error: %s : %s" % (loc_docs_output_path, e.strerror))
    else:
        try:
            loc_docs_output_path.mkdir()
        except OSError as e:
            print("Error: %s : %s" % (loc_docs_output_path, e.strerror))


def empty_tree(path: Path):
    assert path.is_dir()
    for child in reversed(list(path.glob('**/*'))):
        if child.is_file():
            child.unlink()
        elif child.is_dir():
            child.rmdir()


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
    clear_output(loc_docs_output_path)

    locale_dirs = get_paths(loc_docs_root_path)
    write_top_index(locale_dirs, loc_docs_output_path)

    for locale_dir in locale_dirs:
        write_locale_index(locale_dir, loc_docs_output_path)
        product_dirs = get_paths(locale_dir)
        for product_dir in product_dirs:
            write_product_index(
                product_dir, loc_docs_output_path, loc_docs_root_path)


if __name__ == '__main__':
    main()
