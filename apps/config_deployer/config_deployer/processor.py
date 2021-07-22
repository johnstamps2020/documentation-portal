# TODO: Support all the operations for sources and builds:
# TODO: Add a CLI (argparse)
# TODO: Add support for props that are not lists
import argparse
import json
import logging
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


def merge_objects(src_dir: Path, root_object_name: str) -> list:
    all_elements = []
    for file_path in src_dir.rglob('*.json'):
        json_data = load_json_file(file_path)
        all_elements += json_data[root_object_name]
    return sort_list_of_objects(all_elements, 'id')


def split_objects_into_chunks(src_file: Path, root_object_name: str, chunk_size: int) -> list:
    objects_to_split = load_json_file(src_file)[root_object_name]
    objects_to_split_sorted_by_id = sort_list_of_objects(objects_to_split, 'id')
    for i in range(0, len(objects_to_split_sorted_by_id), chunk_size):
        yield objects_to_split_sorted_by_id[i:i + chunk_size]


def split_objects_by_property(src_file: Path, root_object_name: str, property_name: str) -> list:
    objects_to_split = load_json_file(src_file)[root_object_name]
    objects_to_split_sorted_by_id = sort_list_of_objects(objects_to_split, 'id')
    unique_property_values = []
    for obj in objects_to_split_sorted_by_id:
        [unique_property_values.append(property_value) for property_value in get_object_property(obj, property_name) if
         property_value not in unique_property_values]
    split_objects = []
    for unique_property_value in unique_property_values:
        split_objects.append({
            'property_name': property_name,
            'property_value': unique_property_value,
            root_object_name: [obj for obj in objects_to_split_sorted_by_id if
                               unique_property_value in get_object_property(obj, property_name)]

        })
    return split_objects


def extract_objects_by_property(src_file: Path, root_object_name: str, property_name: str,
                                property_value: str) -> tuple:
    """Copy objects to a separate list and remove them from the original list"""
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


def update_property_for_objects(src_file: Path, root_object_name: str, property_name: str,
                                new_property_value, current_property_value: str = '') -> list:
    objects_to_update = load_json_file(src_file)[root_object_name]
    objects_to_update_sorted_by_id = sort_list_of_objects(objects_to_update, 'id')
    updated_objects = []
    if current_property_value:
        for obj in objects_to_update_sorted_by_id:
            if get_object_property(obj, property_name) and current_property_value.casefold() in [value.casefold() for
                                                                                                 value
                                                                                                 in get_object_property(
                    obj, property_name)]:
                set_object_property(obj, property_name, new_property_value)
            updated_objects.append(obj)
    else:
        for obj in objects_to_update_sorted_by_id:
            set_object_property(obj, property_name, new_property_value)
            updated_objects.append(obj)
    return updated_objects


def remove_objects_by_property(src_file: Path, root_object_name: str, property_name: str,
                               property_value: str) -> list:
    objects_to_update = load_json_file(src_file)[root_object_name]
    objects_to_update_sorted_by_id = sort_list_of_objects(objects_to_update, 'id')
    updated_objects = [obj for obj in objects_to_update_sorted_by_id
                       if property_value.casefold() not in [
                           value.casefold() for value in get_object_property(obj, property_name)]
                       ]
    return updated_objects


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
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    subparsers = parser.add_subparsers(help='Commands', dest='command', required=True)
    parser_merge = subparsers.add_parser('merge', help="Merge all config files in a dir into one file",
                                         formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_merge.add_argument('src_dir', help="Source dir with config files to merge")
    parser_split = subparsers.add_parser('split',
                                         help="Split the config file into smaller files based on a chunk size or a property",
                                         formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_remove = subparsers.add_parser('remove', help="Remove items from the config file",
                                          formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_update = subparsers.add_parser('update', help="Update the value of a property in items",
                                          formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_extract = subparsers.add_parser('extract',
                                           help="Copy items to a separate file and remove them from the original file",
                                           formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser_clone = subparsers.add_parser('clone',
                                         help="Copy objects to a separate file and update their property with a new value",
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
        logger.info('Merge option selected.')
        file_name = output_file_name.safe_substitute(info='docs')
        all_items = merge_objects(Path(args.src_dir), 'docs')
        save_json_file(output_dir / file_name, {'docs': all_items})
    elif args.command == 'split':
        pass
    elif args.command == 'remove':
        pass
    elif args.command == 'update':
        pass
    elif args.command == 'extract':
        pass
    elif args.command == 'clone':
        pass


if __name__ == '__main__':
    main()
