import argparse
import copy
import datetime
import hashlib
import json
import logging
import os
import pathlib
import shutil
from collections import Counter
from pathlib import Path

import itertools
from jsonschema import validate


def add_schema_reference(obj: dict):
    if "$schema" in obj:
        return obj
    else:
        return {
            "$schema": "./config-schema.json",
            **obj
        }


def load_json_file(json_file: Path):
    with open(json_file) as json_file:
        return json.load(json_file)


def save_json_file(save_path: Path, obj_to_save: dict, add_schema_ref: bool = True):
    if add_schema_ref:
        obj_to_save = add_schema_reference(obj_to_save)
    with open(save_path, 'w') as result_file:
        json.dump(obj_to_save, result_file, indent=2)


def sort_list_of_objects(objects_to_sort: list, key_name: str):
    sort_key = {
        'docs': 'id',
        'sources': 'id',
        'builds': 'buildType'
    }.get(key_name)
    return sorted(objects_to_sort, key=lambda x: x[sort_key])


def get_object_property(obj: dict, property_name: str) -> str:
    # KeyError is raised when the prop doesn't exist. It is ok because we can only split the file if all objects
    # have the property by which splitting is done
    keys = property_name.split('.')
    if len(keys) == 2:
        return obj[keys[0]][keys[1]]
    elif len(keys) == 1:
        return obj[keys[0]]
    else:
        raise KeyError('Incorrect key. Maximum nesting level is 2.')


def set_object_property(obj: dict, property_name: str, property_value) -> dict:
    current_value_type = type(get_object_property(obj, property_name))
    new_property_value = property_value
    if current_value_type is list:
        new_property_value = property_value.split(',')
    elif current_value_type is bool:
        new_property_value = json.loads(property_value.lower())

    keys = property_name.split('.')
    if len(keys) == 2:
        obj[keys[0]][keys[1]] = new_property_value
    elif len(keys) == 1:
        obj[keys[0]] = new_property_value
    else:
        raise KeyError('Incorrect key. Maximum nesting level is 2.')
    return obj


def get_root_object(json_file_path: Path) -> tuple:
    json_data = load_json_file(json_file_path)
    root_key_name = next((key for key in json_data.keys() if not key.startswith('$')), None)
    root_key_items = json_data[root_key_name]
    root_key_items_sorted_by_id = sort_list_of_objects(root_key_items, root_key_name)
    return root_key_name, root_key_items_sorted_by_id


def filter_objects_by_property_value(objects_to_filter: list, property_name: str, property_value):
    property_type = type(get_object_property(objects_to_filter[0], property_name))
    if property_type is list:
        return [obj for obj in objects_to_filter
                if property_value.casefold() in [
                    value.casefold() for value in get_object_property(obj, property_name)]
                ]
    elif property_type is bool:
        return [obj for obj in objects_to_filter
                if json.loads(property_value.lower()) == get_object_property(obj, property_name)]
    else:
        return [obj for obj in objects_to_filter
                if property_value.casefold() == get_object_property(obj, property_name).casefold()]


def merge_objects(objects_to_merge: list) -> dict:
    root_key_names = []
    all_elements = []
    for obj_info in objects_to_merge:
        root_key_name, sorted_objects_to_merge = obj_info
        root_key_names.append(root_key_name)
        all_elements += sorted_objects_to_merge
    unique_root_key_names = set(root_key_names)
    if len(unique_root_key_names) > 1:
        raise KeyError(f'Unable to merge files. Multiple root keys were found in config files: '
                       f'{", ".join(unique_root_key_names)} '
                       f'Make sure all config files have the same root key. For example: "docs"')

    root_key_name = root_key_names[0]
    return {
        root_key_name: sort_list_of_objects(all_elements, root_key_name)
    }


def get_objects_for_deploy_env(objects_to_merge: list, deploy_env: str) -> dict:
    merged_objects = merge_objects(objects_to_merge)
    merged_objects_key = next(iter(merged_objects.keys()))
    return {
        merged_objects_key: filter_objects_by_property_value(merged_objects[merged_objects_key], 'environments',
                                                             deploy_env)
    }


def split_objects_into_chunks(key_name: str, objects_to_split: list, chunk_size: int) -> list:
    return [{
        key_name: objects_to_split[i:i + chunk_size]
    } for i in range(0, len(objects_to_split), chunk_size)]


def split_objects_by_property(key_name: str, objects_to_split: list, property_name: str) -> list:
    property_values = [get_object_property(obj, property_name) for obj in objects_to_split]
    unique_property_values = {
        ', '.join(value) if type(value) is list else value
        for value in property_values
    }

    return [
        {
            'property_name': property_name,
            'property_value': unique_property_value,
            'objects':
                {key_name: filter_objects_by_property_value(objects_to_split, property_name,
                                                            unique_property_value)}
        }
        for unique_property_value in unique_property_values
    ]


def remove_objects_by_property(key_name: str, all_objects: list, property_name: str,
                               property_value) -> dict:
    objects_to_remove = filter_objects_by_property_value(all_objects, property_name, property_value)
    return {
        key_name: [obj for obj in all_objects if obj not in objects_to_remove]
    }


def copy_objects_by_property(key_name: str, all_objects: list, property_name: str,
                             property_value) -> dict:
    return {
        key_name: filter_objects_by_property_value(all_objects, property_name, property_value)
    }


def update_property_for_objects(key_name: str, all_objects: list, property_name: str, current_property_value,
                                new_property_value) -> dict:
    objects_to_update = all_objects
    if current_property_value:
        objects_to_update = filter_objects_by_property_value(all_objects, property_name, current_property_value)
    updated_objects = [set_object_property(obj, property_name, new_property_value) if
                       obj in objects_to_update else obj for obj in all_objects]
    return {
        key_name: updated_objects
    }


def create_new_objects(root_key_name: str, number_of_objects: int, id_prefix: str):
    docs_template = {
        "id": "",
        "title": "",
        "url": "",
        "metadata": {
            "product": [],
            "platform": [],
            "version": [],
            "release": [],
            "subject": []
        },
        "environments": [],
        "displayOnLandingPages": True,
        "indexForSearch": True,
        "public": False
    }
    sources_template = {
        "id": "",
        "title": "",
        "sourceType": "",
        "gitUrl": "",
        "branch": "main"

    }
    builds_template = {
        "buildType": "",
        "filter": "",
        "root": "",
        "srcId": "",
        "docId": "",
        "indexRedirect": False
    }
    object_template = {
        'docs': docs_template,
        'sources': sources_template,
        'builds': builds_template
    }.get(root_key_name)

    new_items = []
    if object_template.get('id') == '':
        for tmp_obj in list(itertools.repeat(object_template, number_of_objects)):
            object_instance = copy.deepcopy(tmp_obj)
            id_hash = hashlib.md5()
            id_hash.update(str(datetime.datetime.utcnow()).encode("utf-8"))
            object_instance['id'] = f'{id_prefix}{id_hash.hexdigest()[:6]}'
            new_items.append(object_instance)
    else:
        new_items = list(itertools.repeat(object_template, number_of_objects))

    return {
        root_key_name: new_items
    }


def check_for_duplicated_ids(objects_to_check: list):
    property_name = 'id'
    property_values_counter = Counter([obj[property_name] for obj in objects_to_check])
    duplicates = [property_value for property_value in property_values_counter if
                  property_values_counter[property_value] > 1]
    if duplicates:
        raise ValueError(f'Found duplicated values for the {property_name} property: {", ".join(duplicates)}')


def validate_against_schema(config_file_path: Path):
    schema_path = (Path(__file__).parent / '..' / '..' / '..' / '.teamcity' / 'config' / 'config-schema.json').resolve()
    config_schema = load_json_file(schema_path)
    config_json = load_json_file(config_file_path)
    validate(instance=config_json, schema=config_schema)


def check_for_broken_id_references(builds_objects: list, sources_objects: list, docs_objects: list):
    source_ids = [source['id'] for source in sources_objects]
    referenced_source_ids = [build['srcId'] for build in builds_objects]
    refs_to_missing_sources = [id for id in referenced_source_ids if id not in source_ids]

    doc_ids = [doc['id'] for doc in docs_objects]
    referenced_doc_ids = [build['docId'] for build in builds_objects]
    refs_to_missing_docs = [id for id in referenced_doc_ids if id not in doc_ids]

    error_messages = []
    if refs_to_missing_sources:
        error_messages.append(f'Found builds that reference missing source IDs: {", ".join(refs_to_missing_sources)}')
    if refs_to_missing_docs:
        error_messages.append(f'Found builds that reference missing doc IDs: {", ".join(refs_to_missing_docs)}')

    if error_messages:
        raise ValueError(f'{os.linesep}{os.linesep.join(error_messages)}')


def run_command(args: argparse.Namespace()):
    try:
        src_path = args.src_path.resolve()
    except AttributeError:
        src_path = None

    out_dir = args.out_dir.resolve()
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(exist_ok=True, parents=True)

    log_file = Path.cwd() / 'config-deployer.log'
    if log_file.exists():
        log_file.unlink()
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    def create_file_name(file_name: str):
        return f'{file_name.replace(" ", "-").lower()}.json'

    def prepare_input(path: Path = src_path):
        if path.is_dir():
            return [get_root_object(obj) for obj in path.rglob('*.json')]
        elif path.is_file():
            return get_root_object(path)

    def run_create_command():
        logger.info(
            f'Creating a new config file with {args.number_of_items} {args.type}.')
        file_name = create_file_name(f'{args.command}-{args.type}-new')
        new_items = create_new_objects(args.type, args.number_of_items, args.id_prefix)
        logger.info(f'Saving output to {out_dir / file_name}')
        save_json_file(out_dir / file_name, new_items)

    def run_merge_command():
        logger.info(f'Merging files in "{src_path}".')
        all_items = merge_objects(prepare_input())
        file_name = create_file_name(f'{args.command}-all')
        logger.info(f'Saving output to {out_dir / file_name}')
        save_json_file(out_dir / file_name, all_items)

    def run_deploy_command():
        logger.info(
            f'Filtering items in {src_path} for the "{args.deploy_env}" environment.')
        file_name = 'config.json'
        filtered_items = get_objects_for_deploy_env(prepare_input(), args.deploy_env)
        logger.info(f'Saving output to {out_dir / file_name}')
        save_json_file(out_dir / file_name, filtered_items, add_schema_ref=False)

    def run_split_command():
        root_key_name, root_key_objects = prepare_input()
        if args.chunk_size:
            logger.info(f'Splitting "{src_path}" into chunks of {args.chunk_size}.')
            chunked_items = split_objects_into_chunks(root_key_name, root_key_objects, args.chunk_size)
            for chunk_number, chunk in enumerate(chunked_items):
                file_name = create_file_name(f'{args.command}-chunk-{chunk_number}')
                logger.info(f'Saving output to {out_dir / file_name}')
                save_json_file(out_dir / file_name, chunk)
        elif args.prop_name:
            logger.info(f'Splitting "{src_path}" by "{args.prop_name}".')
            split_items = split_objects_by_property(root_key_name, root_key_objects, args.prop_name)
            for item in split_items:
                file_name = create_file_name(
                    f'{args.command}-{item["property_name"].casefold()}-{item["property_value"].casefold()}')
                logger.info(f'Saving output to {out_dir / file_name}')
                save_json_file(out_dir / file_name, item['objects'])

    def run_remove_command():
        logger.info(
            f'Removing items that have "{args.prop_name}" set to "{args.prop_value}" from "{src_path}".')
        cleaned_items = remove_objects_by_property(*prepare_input(), args.prop_name,
                                                   args.prop_value)
        file_name = create_file_name(f'{args.command}-{args.prop_name}-{args.prop_value}')
        logger.info(f'Saving output to {out_dir / file_name}')
        save_json_file(out_dir / file_name, cleaned_items)

    def run_update_command():
        if args.prop_value:
            logger.info(
                f'Updating "{args.prop_name}" to "{args.new_prop_value}" in items that have "{args.prop_name}" set to "{args.prop_value}" in "{src_path}".')
            file_name = create_file_name(
                f'{args.command}-{args.prop_name}-{args.new_prop_value}-from-{args.prop_value}')
        else:
            logger.info(
                f'Updating "{args.prop_name}" to "{args.new_prop_value}" in all items in "{src_path}".')
            file_name = create_file_name(f'{args.command}-{args.prop_name}-{args.new_prop_value}-all')

        updated_items = update_property_for_objects(*prepare_input(),
                                                    args.prop_name,
                                                    args.prop_value,
                                                    args.new_prop_value)
        logger.info(f'Saving output to {out_dir / file_name}')
        save_json_file(out_dir / file_name, updated_items)

    def run_extract_command():
        logger.info(
            f'Extracting items that have "{args.prop_name}" set to "{args.prop_value}" from "{src_path}".')
        root_key_name, root_key_objects = prepare_input()
        extracted_items = copy_objects_by_property(root_key_name, root_key_objects, args.prop_name, args.prop_value)
        updated_items = remove_objects_by_property(root_key_name, root_key_objects,
                                                   args.prop_name,
                                                   args.prop_value)
        file_name_updated_items = create_file_name(f'{args.command}-removed-{args.prop_name}-{args.prop_value}')
        logger.info(f'Saving output to {out_dir / file_name_updated_items}')
        save_json_file(out_dir / file_name_updated_items, updated_items)
        file_name_extracted_items = create_file_name(f'{args.command}-{args.prop_name}-{args.prop_value}')
        logger.info(f'Saving output to {out_dir / file_name_extracted_items}')
        save_json_file(out_dir / file_name_extracted_items, extracted_items)

    def run_clone_command():
        logger.info(
            f'Cloning items that have "{args.prop_name}" set to "{args.prop_value}" from "{src_path}" and updating the property value to "{args.new_prop_value}".')
        file_name = create_file_name(f'{args.command}-{args.prop_name}-{args.prop_value}-to-{args.new_prop_value}')
        root_key_name, root_key_objects = prepare_input()
        copied_items = copy_objects_by_property(root_key_name, root_key_objects, args.prop_name,
                                                args.prop_value)
        updated_items = update_property_for_objects(root_key_name, copied_items[root_key_name], args.prop_name,
                                                    args.prop_value,
                                                    args.new_prop_value)
        logger.info(f'Saving output to {out_dir / file_name}')
        save_json_file(out_dir / file_name, updated_items)

    def run_test_command():
        root_key_name, root_key_objects = prepare_input()
        logger.info(f'Testing {src_path}')
        logger.info(f'Checking against the schema.')
        validate_against_schema(src_path)
        logger.info(f'OK')
        if root_key_name == 'docs' or root_key_name == 'sources':
            logger.info(f'Checking for duplicated IDs.')
            check_for_duplicated_ids(root_key_objects)
            logger.info(f'OK')
        if root_key_name == 'builds':
            _, sources_objects = prepare_input(args.sources_path)
            _, docs_objects = prepare_input(args.docs_path)
            logger.info(f'Checking for broken ID references.')
            check_for_broken_id_references(root_key_objects, sources_objects, docs_objects)
            logger.info(f'OK')

    return {
        'create': run_create_command,
        'merge': run_merge_command,
        'deploy': run_deploy_command,
        'split': run_split_command,
        'remove': run_remove_command,
        'update': run_update_command,
        'extract': run_extract_command,
        'clone': run_clone_command,
        'test': run_test_command,
    }[args.command]()


def main():
    _parser_main_dir = argparse.ArgumentParser(add_help=False)
    _parser_main_dir.add_argument('src_path', type=pathlib.Path,
                                  help='Path to the source directory with config files')
    _parser_main_file = argparse.ArgumentParser(add_help=False)
    _parser_main_file.add_argument('src_path', type=pathlib.Path,
                                   help='Path to the source config file')
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('-o', '--out-dir', dest='out_dir', type=pathlib.Path,
                        help='Path to a directory where the output files are saved',
                        default=f'{Path.cwd() / "out"}')

    subparsers = parser.add_subparsers(help='Commands', dest='command', required=True)
    parser_create = subparsers.add_parser('create',
                                          help='Create a new config file',
                                          formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_create.add_argument('type', type=str, choices=['docs', 'sources', 'builds'],
                               help='Config file type.')
    parser_create.add_argument('-n', '--number-of-items', dest='number_of_items', type=int, required=True,
                               help='Number of items in the file')
    parser_create.add_argument('-p', '--id-prefix', dest='id_prefix', type=str, default='',
                               help='Prefix that is added to the "id" property of each item. '
                                    'Used only for the "docs" and "sources" types.')

    subparsers.add_parser('merge', help='Merge all config files in a dir into one file',
                          formatter_class=argparse.ArgumentDefaultsHelpFormatter, parents=[_parser_main_dir])

    parser_deploy = subparsers.add_parser('deploy',
                                          help='Filter items in the config file by deployment environment',
                                          formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                          parents=[_parser_main_dir])
    parser_deploy.add_argument('--deploy-env', dest='deploy_env', type=str, choices=['dev', 'int', 'staging', 'prod'],
                               required=True,
                               help='Name of the environment where the config file will be deployed.')

    parser_split = subparsers.add_parser('split',
                                         help='Split the config file into smaller files'
                                              ' based on a chunk size or a property',
                                         formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                         parents=[_parser_main_file])
    split_options = parser_split.add_mutually_exclusive_group()
    split_options.add_argument('--chunk-size', dest='chunk_size', type=int,
                               help='Number of items in a single config file.')
    split_options.add_argument('--prop-name', dest='prop_name', type=str,
                               help='Property name by which the config file is split. '
                                    'For a nested property, use the dot notation. For example, "metadata.product".')
    parser_remove = subparsers.add_parser('remove', help='Remove items from the config file',
                                          formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                          parents=[_parser_main_file])
    parser_remove.add_argument('--prop-name', dest='prop_name', type=str, required=True,
                               help='Property name used for removing items. '
                                    'For a nested property, use the dot notation. For example, "metadata.product".')
    parser_remove.add_argument('--prop-value', dest='prop_value', type=str, required=True,
                               help='Property value used for removing items.')
    parser_update = subparsers.add_parser('update', help='Update the value of a property in items',
                                          formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                          parents=[_parser_main_file])
    parser_update.add_argument('--prop-name', dest='prop_name', type=str, required=True,
                               help='Name of the property to update. '
                                    'For a nested property, use the dot notation. For example, "metadata.product".')
    parser_update.add_argument('--prop-value', dest='prop_value', type=str, default='',
                               help='Current value of the property. If provided, the property is updated only in items'
                                    ' with this property value. Otherwise, the property is updated in all items.')
    parser_update.add_argument('--new-prop-value', dest='new_prop_value', type=str, required=True,
                               help='New value of the property.')

    parser_extract = subparsers.add_parser('extract',
                                           help='Copy items to a separate file and remove them from the original file',
                                           formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                           parents=[_parser_main_file])
    parser_extract.add_argument('--prop-name', dest='prop_name', type=str, required=True,
                                help='Property name used for extracting items. '
                                     'For a nested property, use the dot notation. For example, "metadata.product".')
    parser_extract.add_argument('--prop-value', dest='prop_value', type=str, required=True,
                                help='Property value used for extracting items.')
    parser_clone = subparsers.add_parser('clone',
                                         help='Copy items to a separate file '
                                              'and update their property value with a new value',
                                         formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                         parents=[_parser_main_file])
    parser_clone.add_argument('--prop-name', dest='prop_name', type=str, required=True,
                              help='Name of the property to update in cloned items. '
                                   'For a nested property, use the dot notation. For example, "metadata.product".')
    parser_clone.add_argument('--prop-value', dest='prop_value', type=str, required=True,
                              help='Current value of the property. Only items'
                                   ' with this property value are cloned.')
    parser_clone.add_argument('--new-prop-value', dest='new_prop_value', type=str, required=True,
                              help='New value of the property used in cloned items.')

    parser_test = subparsers.add_parser('test',
                                        help='Test a config file',
                                        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                        parents=[_parser_main_file])
    parser_test.add_argument('--sources-path', dest="sources_path", type=pathlib.Path,
                             help='Path to the sources config file. Required only for builds validation.')
    parser_test.add_argument('--docs-path', dest="docs_path", type=pathlib.Path,
                             help='Path to the docs config file. Required only for builds validation.')

    cli_args = parser.parse_args()
    run_command(cli_args)


if __name__ == '__main__':
    main()
