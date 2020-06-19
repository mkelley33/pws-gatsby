# WIP

This site/app is a work in progress.

# Getting Started

1. **.env**

You'll need to create a `.env.development` file at a minimum to integrate the
client with the server. In it you should type
`GATSBY_API_URL=http://localhost:8080` or whereever you're running the server.

You'll also need to assign `RECAPTCHA_SITE_KEY` for the reCAPTCHA functionality.
Additionally, create the server `.env.development` in the server directory, and set
`RECAPTCHA_SECRET_KEY` You can obtain values for these keys respectively by going
to https://www.google.com/recaptcha/admin.

1. `cd` into `client` and run `npm install`
1. Then, run `gatsby develop`
1. From the root directory `cd` into `server` and run `npm install`
1. Then, run `npm run dev`. NOTE: you will need to have a MongoDB instance installed and configured in the file `./config/env/development`.

This should be enough to get you up and running. If you have any questions, please feel free to email me at michauxkelley@gmail.com.
