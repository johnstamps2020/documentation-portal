# TODO: Support all the operations for sources and builds:
# TODO: Add a CLI (argparse)
# TODO: Add support for props that are not lists (str, bool)
import argparse
import json
import logging
import pathlib
from pathlib import Path
from string import Template


def add_schema_reference(obj: dict):
    if "$schema" not in obj.keys():
        return {
            "$schema": "./config-schema.json",
            **obj
        }
    return obj


def load_json_file(json_file: Path):
    with open(json_file) as json_file:
        return json.load(json_file)


def save_json_file(save_path: Path, obj_to_save: dict):
    with open(save_path, 'w') as result_file:
        json.dump(add_schema_reference(obj_to_save), result_file, indent=2)


def sort_list_of_objects(objects_to_sort: list, sort_key: str):
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
    keys = property_name.split('.')
    if len(keys) == 2:
        obj[keys[0]][keys[1]] = property_value
    elif len(keys) == 1:
        obj[keys[0]] = property_value
    else:
        raise KeyError('Incorrect key. Maximum nesting level is 2.')
    return obj


def get_root_object(json_file_path: Path) -> tuple:
    json_data = load_json_file(json_file_path)
    root_key_name = next((key for key in json_data.keys() if not key.startswith('$')), None)
    root_key_items = json_data[root_key_name]
    root_key_items_sorted_by_id = sort_list_of_objects(root_key_items, 'id')
    return root_key_name, root_key_items_sorted_by_id


def merge_objects(src_dir: Path) -> dict:
    root_key_names = []
    all_elements = []
    for src_file in src_dir.rglob('*.json'):
        root_key_name, sorted_objects_to_merge = get_root_object(src_file)
        root_key_names.append(root_key_name)
        all_elements += sorted_objects_to_merge
    unique_root_key_names = set(root_key_names)
    if len(unique_root_key_names) > 1:
        raise KeyError(f'Unable to merge files. Multiple root keys were found in config files: '
                       f'{", ".join(unique_root_key_names)} '
                       f'Make sure all config files have the same root key. For example: "docs"')
    else:
        return {
            root_key_names[0]: sort_list_of_objects(all_elements, 'id')
        }


def split_objects_into_chunks(src_file: Path, chunk_size: int) -> list:
    split_objects = []
    root_key_name, sorted_objects_to_split = get_root_object(src_file)
    for i in range(0, len(sorted_objects_to_split), chunk_size):
        split_objects.append(
            {
                root_key_name: sorted_objects_to_split[i:i + chunk_size]
            })
    return split_objects


def split_objects_by_property(src_file: Path, property_name: str) -> list:
    root_key_name, sorted_objects_to_split = get_root_object(src_file)
    unique_property_values = []
    for obj in sorted_objects_to_split:
        [unique_property_values.append(property_value) for property_value in get_object_property(obj, property_name) if
         property_value not in unique_property_values]
    split_objects = []
    for unique_property_value in unique_property_values:
        split_objects.append({
            'property_name': property_name,
            'property_value': unique_property_value,
            root_key_name: [obj for obj in sorted_objects_to_split if
                            unique_property_value in get_object_property(obj, property_name)]

        })
    return split_objects


def remove_objects_by_property(src_file: Path, property_name: str,
                               property_value: str) -> dict:
    root_key_name, sorted_objects_to_clean = get_root_object(src_file)
    cleaned_objects = [obj for obj in sorted_objects_to_clean
                       if property_value.casefold() not in [
                           value.casefold() for value in get_object_property(obj, property_name)]
                       ]
    return {
        root_key_name: cleaned_objects
    }


def update_property_for_objects(src_file: Path, property_name: str, current_property_value: str,
                                new_property_value) -> dict:
    root_key_name, sorted_objects_to_update = get_root_object(src_file)
    updated_objects = []
    if current_property_value:
        for obj in sorted_objects_to_update:
            if get_object_property(obj, property_name) and current_property_value.casefold() in [value.casefold() for
                                                                                                 value
                                                                                                 in get_object_property(
                    obj, property_name)]:
                set_object_property(obj, property_name, new_property_value)
            updated_objects.append(obj)
    else:
        for obj in sorted_objects_to_update:
            set_object_property(obj, property_name, new_property_value)
            updated_objects.append(obj)
    return {
        root_key_name: updated_objects
    }


def extract_objects_by_property(src_file: Path, root_object_name: str, property_name: str,
                                property_value: str) -> tuple:
    objects_to_update = load_json_file(src_file)[root_object_name]
    objects_to_update_sorted_by_id = sort_list_of_objects(objects_to_update, 'id')
    updated_objects = []
    extracted_objects = []
    for obj in objects_to_update_sorted_by_id:
        if property_value.casefold() in [value.casefold() for value in get_object_property(obj, property_name)]:
            extracted_objects.append(obj)
        else:
            updated_objects.append(obj)

    return updated_objects, extracted_objects


def clone_objects_with_updated_property(src_file: Path, root_object_name: str, property_name: str,
                                        current_property_value: str, new_property_value) -> list:
    all_objects = load_json_file(src_file)[root_object_name]
    all_objects_sorted_by_id = sort_list_of_objects(all_objects, 'id')
    cloned_objects = []
    for obj in all_objects_sorted_by_id:
        if current_property_value.casefold() in [value.casefold() for value in get_object_property(obj, property_name)]:
            set_object_property(obj, property_name, new_property_value)
            cloned_objects.append(obj)
    return cloned_objects


def main():
    # TODO: Add required=True where needed
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    subparsers = parser.add_subparsers(help='Commands', dest='command', required=True)
    parser_merge = subparsers.add_parser('merge', help='Merge all config files in a dir into one file',
                                         formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_merge.add_argument('merge_src_dir', type=pathlib.Path, help='Source dir with config files to merge')
    parser_split = subparsers.add_parser('split',
                                         help='Split the config file into smaller files'
                                              ' based on a chunk size or a property',
                                         formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_split.add_argument('split_src_file', type=pathlib.Path, help='Source config file to split')
    split_options = parser_split.add_mutually_exclusive_group()
    split_options.add_argument('--chunk-size', dest='split_chunk_size', type=int,
                               help='Number of items in a single config file.')
    split_options.add_argument('--prop-name', dest='split_prop_name', type=str,
                               help='Property name by which the config file is split.')
    parser_remove = subparsers.add_parser('remove', help='Remove items from the config file',
                                          formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_remove.add_argument('remove_src_file', type=pathlib.Path,
                               help='Source config file from which you want to remove items')
    parser_remove.add_argument('--prop-name', dest='remove_prop_name', type=str,
                               help='Property name used for removing items.')
    parser_remove.add_argument('--prop-value', dest='remove_prop_value', type=str,
                               help='Property value used for removing items.')
    parser_update = subparsers.add_parser('update', help='Update the value of a property in items',
                                          formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_update.add_argument('update_src_file', type=pathlib.Path,
                               help='Source config file in which you want to update items')
    parser_update.add_argument('--prop-name', dest='update_prop_name', type=str,
                               help='Name of the property to update')
    parser_update.add_argument('--prop-value', dest='update_prop_value', type=str, default='',
                               help='Current value of the property. If provided, the property is updated only in items'
                                    ' with this property value. Otherwise, the property is updated in all items.')
    parser_update.add_argument('--new-prop-value', dest='update_new_prop_value', type=str,
                               help='New value of the property.')

    parser_extract = subparsers.add_parser('extract',
                                           help='Copy items to a separate file and remove them from the original file',
                                           formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_clone = subparsers.add_parser('clone',
                                         help='Copy objects to a separate file '
                                              'and update their property with a new value',
                                         formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    # parser_list_items = subparsers.add_parser('list-items', help="List items from Jira, like projects")
    # list_options = parser_list_items.add_mutually_exclusive_group()
    # list_options.add_argument('-ap', '--available-projects', action='store_true', dest='available_jira_projects',
    #                           help='Lists all projects available in Jira')
    # list_options.add_argument('-af', '--available-fields', action='store_true', dest='available_jira_fields',
    #                           help='Lists all fields available in Jira')

    args = parser.parse_args()
    current_working_dir = Path.cwd()
    log_file = current_working_dir / 'admin-panel-cli.log'
    if log_file.exists():
        log_file.unlink()
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    output_dir = current_working_dir / 'out'
    output_file_name = Template(f'_{args.command}-$info.json')
    output_dir.mkdir(exist_ok=True)

    if args.command == 'merge':
        logger.info(f'Merging files in "{str(args.merge_src_dir)}".')
        all_items = merge_objects(args.merge_src_dir)
        file_name = output_file_name.safe_substitute(info='all')
        save_json_file(output_dir / file_name, all_items)
    elif args.command == 'split':
        if args.split_chunk_size:
            logger.info(f'Splitting "{str(args.split_src_file)}" into chunks of {args.split_chunk_size}.')
            chunked_items = split_objects_into_chunks(args.split_src_file, args.split_chunk_size)
            for chunk_number, chunk in enumerate(chunked_items):
                file_name = output_file_name.safe_substitute(info=f'chunk-{chunk_number}')
                save_json_file(output_dir / file_name, chunk)
        elif args.split_prop_name:
            logger.info(f'Splitting "{str(args.split_src_file)}" by "{args.split_prop_name}".')
            split_items = split_objects_by_property(args.split_src_file, args.split_prop_name)
            for item in split_items:
                file_name = output_file_name.safe_substitute(
                    info=f'{item["property_name"].casefold()}-{item["property_value"].casefold()}')
                save_json_file(output_dir / file_name, item)
    elif args.command == 'remove':
        logger.info(
            f'Removing items that have "{args.remove_prop_name}" set to "{args.remove_prop_value}" from "{args.remove_src_file}".')
        cleaned_items = remove_objects_by_property(args.remove_src_file, args.remove_prop_name, args.remove_prop_value)
        file_name = output_file_name.safe_substitute(info=f'{args.remove_prop_name}-{args.remove_prop_value}')
        save_json_file(output_dir / file_name, cleaned_items)
    elif args.command == 'update':
        if args.update_prop_value:
            logger.info(
                f'Updating "{args.update_prop_name}" to "{args.update_new_prop_value}" in items that have "{args.update_prop_name}" set to "{args.update_prop_value}" in "{args.update_src_file}".')
            file_name = output_file_name.safe_substitute(
                info=f'{args.update_prop_name}-{args.update_new_prop_value}-from-{args.update_prop_value}')
        else:
            logger.info(
                f'Updating "{args.update_prop_name}" to "{args.update_new_prop_value}" in all items in "{args.update_src_file}".')
            file_name = output_file_name.safe_substitute(
                info=f'{args.update_prop_name}-{args.update_new_prop_value}-all')

        updated_items = update_property_for_objects(args.update_src_file, args.update_prop_name, args.update_prop_value,
                                                    args.update_new_prop_value)
        save_json_file(output_dir / file_name, updated_items)
    elif args.command == 'extract':
        pass
    elif args.command == 'clone':
        pass


if __name__ == '__main__':
    main()
