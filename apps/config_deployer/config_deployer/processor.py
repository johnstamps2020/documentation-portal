import json
from pathlib import Path

merge_input = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/input')

merge_output = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/output')

split_input = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/input/docs.json')
split_output = Path(
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/output')


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


def merge_objects(src_dir: Path, root_object_name: str) -> list:
    all_elements = []
    for file_path in src_dir.rglob('*.json'):
        json_data = load_json_file(file_path)
        all_elements += json_data[root_object_name]
    return all_elements


def split_objects_into_chunks(src_file: Path, root_object_name: str, chunk_size: int) -> list:
    objects_to_split = load_json_file(src_file)[root_object_name]
    objects_to_split_sorted_by_id = sort_list_of_objects(objects_to_split, 'id')
    for i in range(0, len(objects_to_split_sorted_by_id), chunk_size):
        yield objects_to_split_sorted_by_id[i:i + chunk_size]


def split_objects_by_metadata_property(src_file: Path, root_object_name: str, property_name: str) -> list:
    objects_to_split = load_json_file(src_file)[root_object_name]
    unique_property_values = []
    for obj in objects_to_split:
        [unique_property_values.append(property_value) for property_value in obj['metadata'][property_name] if
         property_value not in unique_property_values]
    return objects_to_split


def extract_elements():
    pass


def clone_elements():
    pass


def remove_elements():
    pass


# merge
all_docs = merge_objects(merge_input, 'docs')
docs_obj = add_schema_reference({
    'docs': sort_list_of_objects(all_docs, 'id')
})
save_json_file(merge_output / '_merge-docs.json', docs_obj)

# split
chunked_docs = split_objects_into_chunks(split_input, 'docs', 10)
for chunk_number, chunk in enumerate(chunked_docs):
    docs_obj = add_schema_reference(
        {
            'docs': chunk
        }
    )
    save_json_file(split_output / f'_split-docs-chunk-{chunk_number}.json', docs_obj)

split_docs = split_objects_by_metadata_property(split_input, 'docs', 'product')
