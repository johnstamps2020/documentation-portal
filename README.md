# Node Okta container
This is a simple Node.js app which enforces Okta authentication.

## Setup
1. Place documents in the `public` folder
2. Configure the environment (locally, you can use a `.env` file)
    ```
    OKTA_DOMAIN=https://guidewire-hub.oktapreview.com
    OKTA_CLIENT_ID={{ YOU CLIENT ID }}
    OKTA_CLIENT_SECRET={{ YOUR CLIENT SECRET }}
    APP_BASE_URL={{ THE URL WHERE YOUR APP WILL BE HOSTED, OR http://localhost:3000 }}
    SESSION_KEY={{ A RANDOM AND SECURE SESSION KEY }}
    ```

## Keti
The attached `keti.json` contains application configuration. Use if if you want to make changes to Keti. Make sure you commit your changes to this repository.