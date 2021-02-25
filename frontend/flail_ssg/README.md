``` 
  __ _       _ _
/ _| | __ _(_) |  ___ ___  __ _
| |_| |/ _` | | | / __/ __|/ _` |
|  _| | (_| | | | \__ \__ \ (_| |
|_| |_|\__,_|_|_| |___/___/\__, |
|___/

```

# TO DO: generator stuff

crawl files starting from the top and following "page" links [x]
pages can have relative links, IDs can only be a single value [x]
on each page, add a breadcrumb [x]
on each page, add a dropdown which allows you to switch to a sibling page, e.g., on the billingCenterForGuidewireCloud
allow the user to switch to policyCenterForGuidewireCloud and claimCenterForGuidewireCloud don't crawl the same page [x]
twice, even if more than one link points to it [x]

throw an error when a docs ID does not exist [x]
throw an error when an ID contains a forward slash / [x]
if an object has an env which does not match current env, don't add it and don't crawl down from it [x]
if the env in environment variables does not match, do not generate the link or crawl pages [x]
if an object has an ID, check the env of the doc and see if we want to display it [x]
if the env on the doc does not match, throw an error [x]
allow a 'loose' mode where errors become warnings [x]
enable support for public docs:
    - While building pages, add the public attribute to each doc
    - Based on the attribute, change how the doc link is shown


# TO DO: template stuff

add something to the home page which will make the browser skip this page and redirect ot a selected link add the toggle
between cloud/self-managed add the links to community add the log in/log out button implement the search page implement
the login page

# TO DO: nice-to-have stuff

create a schema that helps validate the JSON file, make sure env is not allowed on an object with an ID
