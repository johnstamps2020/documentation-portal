import filecmp
import json
from pathlib import Path
from config_deployer.processor import merge_objects, add_schema_reference, save_json_file, load_json_file, \
    split_objects_into_chunks, split_objects_by_property, clone_objects_with_updated_property, \
    extract_objects_by_property, remove_objects_by_property, update_property_for_objects

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


def load_json_file(json_file: Path):
    with open(json_file) as json_file:
        return json.load(json_file)


def check_dirs_have_the_same_files(left_dir: Path, right_dir: Path):
    dir_comp = filecmp.dircmp(left_dir,
                              right_dir)

    assert dir_comp.left_list == dir_comp.right_list


def check_files_have_the_same_content(output_dir: Path, expected_dir: Path, root_object_name: str):
    for output_file in output_dir.glob('*.json'):
        for expected_file in expected_dir.glob('*.json'):
            if output_file.name == expected_file.name:
                output_items = load_json_file(output_file)[root_object_name]
                expected_items = load_json_file(expected_file)[root_object_name]
                assert output_items == expected_items


def test_docs_merge():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/output')

    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')


def test_docs_split():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/output')
    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')


def test_docs_remove():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/remove/output')
    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/remove/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')


def test_docs_extract():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/extract/output')
    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/extract/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')


def test_docs_update():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/update/output')
    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/update/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')


def test_docs_clone():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/clone/output')
    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/clone/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')
