# Commands

`npm start` for development

## Mac

You will need to have the Teraphone Code Signing Certificates (CSC) from Apple installed in your keychain. You can get them from the [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list).

`APPLE_ID=<your-apple-developer-id> APPLE_ID_PASS=<apple-id-password> npm run package:mac`

Instructions to generate an APPLE_ID_PASS can be found [here](https://support.apple.com/en-us/HT204397).

`GH_TOKEN=<your-github-token> APPLE_ID=<your-apple-developer-id> APPLE_ID_PASS=<apple-id-password> npm run publish:mac`

You can generate a new GH_TOKEN [here](https://github.com/settings/tokens/new). Must have the repo scope.

## Windows

You will need to have the Teraphone Code Signing Certificates (CSC) from Sectigo in your local directory. You can get them [here](https://drive.google.com/file/d/15IUeFz9F8zMfB-xbM9aJYFTFryKm7h6l/view?usp=sharing). The password for the zip is in Google Secrets Manager.

`$Env:CSC_LINK="<path-to-windows-csc.p12>"; $Env:CSC_KEY_PASSWORD="<your-personal-p12-password>"; npm run package:win`

`$Env:GH_TOKEN="<your-github-token>"; $Env:CSC_LINK="<path-to-windows-csc.p12>"; $Env:CSC_KEY_PASSWORD="<your-personal-p12-password>"; npm run publish:win`

## electron-builder.env

Rather than setting environment variables in the command line, you can create a file called `electron-builder.env` in the root of the project. This file will be ignored by git and will be used by electron-builder to set the environment variables. See this [example](https://github.com/motdotla/dotenv-expand/blob/1cc80d02e1f8aa749253a04a2061c0fecb9bdb69/tests/.env).
