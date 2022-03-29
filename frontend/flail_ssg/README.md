``` 
  __ _       _ _
/ _| | __ _(_) |  ___ ___  __ _
| |_| |/ _` | | | / __/ __|/ _` |
|  _| | (_| | | | \__ \__ \ (_| |
|_| |_|\__,_|_|_| |___/___/\__, |
|___/

```

# Flail SSG

A simple and opinionated static site generator for the doc site.

## Validations

Validations in Flail work as follows:

1. Flail runs validations as the first step in the page building procedure, before items are filtered by env. If an item
   in the page config has the `id` property, Flail checks that a doc with the same `id` exists in the config file. If it
   doesn’t, an error is raised.
2. After the validations pass, pages are preprocessed. During this stage, the items are filtered by env and cleaned.
3. Flail runs the same validations again.

## Rules

### Removal of filtered-out pages

(Changes made in DOCS-2235)
References to pages are removed from page configs if they don't match the env settings. Before, if a page config had a
page reference with env settings that included the referenced page and another page config had env settings that
excluded the same referenced page, the referenced page WAS removed. Now, in such a situation, the referenced page IS NOT
removed.

### Processing of version selectors

(Changes made in DOCS-2235)
Before, when version selector items were filtered by env, filtered-out page references in the selector were also added
to the list of pages for removal. Now, version selector items are treated in a different way than main page items. They
are still filtered because we still may want to filter out links or docs, but they aren’t added to the general count
that determines if a page can be deleted.

To determine if a page can be deleted, we use only filtered items and pages for removal from main page items. The
function for removing empty or non-existent pages is used later in the process to clean up selectors and keep them in
sync with main page items.

We decided to adopt this approach because including selector items in the check for pages that can be removed would
require keeping env settings that align with env settings in the main page items. It’s not sustainable.

Example: I have a ref for the PC 2021.01 page in a page config. It's only for `int` and `staging`. In every selector
where I link to this page, I need to add the same env settings. If I have 4 selectors that reference PC 2021.01, I need
to add the settings in all of them.