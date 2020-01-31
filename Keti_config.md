# Keti configuration for the doc portal

## Overview

Keti has two instances: **dev** and **prod**. Our dev, int, and staging doc portals are registered in the dev instance of Keti as `NODE_Hawaii_Docs_Web`. Our production doc portal is registered in the prod instance of Keti as `Documentation_portal`.

## Get details of the registered doc portals

> IMPORTANT: Currently, you are only able to get details of the apps registered in the Keti dev instance.

1. In your browser, open a Swagger UI for the Keti dev or prod instance:

    - [Keti dev](https://cca-provisioning.dev.ccs.guidewire.net/swagger-ui.html)
    - [Keti prod](https://keti.us-east-2.service.guidewire.net/swagger-ui.html)

1. Select **Authorize**.

1. In the **Available authorizations** window, select **groups** and then **Authorize**. When the authorization is complete, select **Close**.

1. Go to the `GET /applications` endpoint and select **Try it out**.

1. In the **filter** field, type in

    - `name eq NODE_Hawaii_Docs_Web` for Keti dev
    - `name eq Documentation_portal` for Keti prod
    
    The details of the application are shown in the **Response body**.
    
    > The owner pod for the production doc portal is set to the CCS provisioning admin because a dev pod cannot register their app themselves in the production environment. They need to ask the Keti team to do it. You cannot set the owner pod to a pod that you are not part of so the Keti team needs to set the owner pod to their pod.
    
