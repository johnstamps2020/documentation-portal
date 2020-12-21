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

This is a simple Node.js app which enforces Okta authentication.

## Setup

1. Place documents on an S3 (include landing pages if necessary)
2. Configure the environment (locally, you can use a `.env` file)
   ```
   OKTA_DOMAIN=https://guidewire-hub.oktapreview.com
   OKTA_CLIENT_ID={{ YOU CLIENT ID }}
   OKTA_CLIENT_SECRET={{ YOUR CLIENT SECRET }}
   APP_BASE_URL={{ THE URL WHERE YOUR APP WILL BE HOSTED, OR http://localhost:3000 }}
   SESSION_KEY={{ A RANDOM AND SECURE SESSION KEY }}
   DOC_S3_URL={{ THE PUBLIC URL AVAILABLE TO THE DEPLOYMENT MACHINE, S3 INGRESS e.g., https://ditaot.internal.dev.ccs.guidewire.net }}
   ```
3. To test on localhost, you can set the following environment vars:
   ```
   LOCAL_CONFIG=yes
   ENABLE_AUTH=yes
   LOCALHOST_SESSION_SETTINGS=yes
   ```

## Keti

The attached `keti.json` contains application configuration. Use if if you want to make changes to Keti. Make sure you commit your changes to this repository.
