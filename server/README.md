```
 ____                                        _        _   _
|  _ \  ___   ___ _   _ _ __ ___   ___ _ __ | |_ __ _| |_(_) ___  _ __
| | | |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __/ _` | __| |/ _ \| '_ \
| |_| | (_) | (__| |_| | | | | | |  __/ | | | || (_| | |_| | (_) | | | |
|____/ \___/ \___|\__,_|_| |_| |_|\___|_| |_|\__\__,_|\__|_|\___/|_| |_|

 ____            _        _
|  _ \ ___  _ __| |_ __ _| |
| |_) / _ \| '__| __/ _` | |
|  __/ (_) | |  | || (_| | |
|_|   \___/|_|   \__\__,_|_|
```

> WARNING: This content is obsolete and requires update.

This is a simple (not anymore) Node.js app which enforces Okta authentication.

## Setup

1. Place documents on an S3 bucket (include landing pages if necessary)
2. Configure the environment (locally, you can use a `.env` file)
   ```
   OKTA_DOMAIN=https://guidewire-hub.oktapreview.com
   OKTA_CLIENT_ID={{ YOU CLIENT ID }}
   OKTA_CLIENT_SECRET={{ YOUR CLIENT SECRET }}
   APP_BASE_URL={{ THE URL WHERE YOUR APP WILL BE HOSTED, OR http://localhost:3000 }}
   SESSION_KEY={{ A RANDOM AND SECURE SESSION KEY }}
   DOC_S3_URL={{ THE PUBLIC URL AVAILABLE TO THE DEPLOYMENT MACHINE, S3 INGRESS e.g., https://docportal-content.int.ccs.guidewire.net }}
   ALLOW_PUBLIC_DOCS={{ IF YOUR SET IT TO yes, USERS CAN BROWSE THE SITE WITHOUT LOGGING IN, BUT THEY CAN ONLY ACCESS PUBLIC DOCS }}
   ```
3. To test on localhost, you can set the following environment vars:
   ```
   LOCAL_CONFIG=yes
   ENABLE_AUTH=yes
   LOCALHOST_SESSION_SETTINGS=yes
   ```
   Note: If running from a VS Code terminal in Windows, start VS Code with Run
   as Administrator.
4. You can also "pretend" to be an external user. This allows you to view the
   site locally as somebody without a Guidewire email. Set the following
   optional variable:
   ```
   PRETEND_TO_BE_EXTERNAL=yes
   ```

## Keti

The attached `keti.json` contains application configuration. Use it if you want
to make changes to Keti. Make sure you commit your changes to this repository.

## HTML5 webpack

To build the webpack bundle, run:

```bash
// in the root folder
yarn build:html5
```

To develop the HTML5 plugin, in the root folder run:

```
yarn dev:html5
```

## Local preview of webhelp

1. Put a webhelp in a folder somewhere.
1. Run this command to serve the folder on localhost:5000:
   ```
   npx serve .
   ```
1. Add this you your server `.env`:
   ```
   DOC_S3_URL=http://localhost:5000/
   ```
1. In a separate terminal, run the Webpack dev script:
   ```
   yarn dev:html5
   ```
1. In a separate terminal, run the server:
   ```
   yarn dev:server
   ```
1. Go to `http://localhost:8081/something.html` to preview your webhelp
