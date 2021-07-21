# TODO: Support all the operations for sources and builds:
# TODO: Add a CLI (argparse)
# TODO: Add support for props that are not lists
import json
from pathlib import Path


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
        json.dump(obj_to_save, result_file, indent=2)


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


# Testing part

# merge
merge_input = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/input')

merge_output = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/output')

all_docs = merge_objects(merge_input, 'docs')
docs_obj = add_schema_reference({
    'docs': all_docs
})
save_json_file(merge_output / '_merge-docs.json', docs_obj)

# split
split_input = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/input/docs.json')
split_output = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/output')

chunked_docs = split_objects_into_chunks(split_input, 'docs', 10)
for chunk_number, chunk in enumerate(chunked_docs):
    docs_obj = add_schema_reference(
        {
            'docs': chunk
        }
    )
    save_json_file(split_output / f'_split-docs-chunk-{chunk_number}.json', docs_obj)

docs_by_product = split_objects_by_property(split_input, 'docs', 'metadata.product')
for version_docs_obj in docs_by_product:
    docs_obj = add_schema_reference(
        {
            'docs': version_docs_obj['docs']
        }
    )
    save_json_file(
        split_output / f'_split-docs-{version_docs_obj["property_name"].casefold()}-{version_docs_obj["property_value"].casefold()}.json',
        docs_obj)

# remove
remove_input = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/remove/input/docs.json')
remove_output = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/remove/output')

docs_without_product_bc = remove_objects_by_property(remove_input, 'docs', 'metadata.product', 'BillingCenter')
no_bc_product_docs_obj = add_schema_reference({
    'docs': docs_without_product_bc
})
save_json_file(remove_output / '_remove-docs-metadata.product-billingcenter.json', no_bc_product_docs_obj)

docs_without_version_1011 = remove_objects_by_property(remove_input, 'docs', 'metadata.version', '10.1.1')
no_version_1011_docs_obj = add_schema_reference({
    'docs': docs_without_version_1011
})
save_json_file(remove_output / '_remove-docs-metadata.version-10.1.1.json', no_version_1011_docs_obj)

# extract
extract_input = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/extract/input/docs.json')
extract_output = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/extract/output')

updated_docs, extracted_docs = extract_objects_by_property(extract_input, 'docs', 'metadata.product', 'BillingCenter')
updated_docs_obj = add_schema_reference({
    'docs': updated_docs
})
extracted_docs_obj = add_schema_reference({
    'docs': extracted_docs
})
save_json_file(extract_output / '_extract-docs-removed-metadata.product-billingcenter.json', updated_docs_obj)
save_json_file(extract_output / '_extract-docs-metadata.product-billingcenter.json', extracted_docs_obj)

# update
update_input = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/update/input/docs.json')
update_output = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/update/output')

docs_with_updated_version = update_property_for_objects(update_input, 'docs', 'metadata.version', ['10.1.3'], '10.1.2')
updated_version_docs_obj = add_schema_reference({
    'docs': docs_with_updated_version
})
save_json_file(update_output / '_update-docs-version-10.1.2-to-10.1.3.json', updated_version_docs_obj)

docs_with_updated_product = update_property_for_objects(update_input, 'docs', 'metadata.product', ['XCenter'],
                                                        'ClaimCenter')
updated_product_docs_obj = add_schema_reference({
    'docs': docs_with_updated_product
})
save_json_file(update_output / '_update-docs-product-claimcenter-to-xcenter.json', updated_product_docs_obj)

# clone
clone_input = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/clone/input/docs.json')
clone_output = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/clone/output')

cloned_docs_with_updated_version = clone_objects_with_updated_property(clone_input, 'docs', 'metadata.version',
                                                                       '9.0.10', ['9.0.11'])
cloned_version_docs_obj = add_schema_reference({
    'docs': cloned_docs_with_updated_version
})
save_json_file(clone_output / '_clone-docs-metadata.version-9.0.10-to-9.0.11.json', cloned_version_docs_obj)

cloned_docs_with_updated_product = clone_objects_with_updated_property(clone_input, 'docs', 'metadata.product',
                                                                       'ClaimCenter',
                                                                       ['ClaimCenter for Guidewire Cloud'])
cloned_product_docs_obj = add_schema_reference({
    'docs': cloned_docs_with_updated_product
})
save_json_file(clone_output / '_clone-docs-metadata.product-claimcenter-to-claimcenter-for-guidewire-cloud.json',
               cloned_product_docs_obj)
