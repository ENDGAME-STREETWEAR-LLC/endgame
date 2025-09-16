## ENDGAME Portal

This project contains source code for the [ENDGAME web portal](https://endgame-portal.vercel.app), which uses Next.JS, Typescript and Tailwind CSS.

## Getting Started

First, configure your environment variables to start the development server. See the .env.example file for reference.

This project requires you to configure the endgame-express app, for more information, [visit the official repository](https://github.com/salvadorC03/endgame-express). Run the express server app, or use the [hosted deployment](https://endgame-express.vercel.app). Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result and start using the web app locally.

## PSN Authentication

To authenticate using PSN, first enter the Playstation Network using the link from the home page and sign in using your email and password. After signing in, visit the link in the home page to retrieve the NPSSO token for your account. Enter the token and click on the submit button.

## Xbox Live Authentication

Currently, the Xbox Live features are only available on the Vercel Deployment. Visit the URL in the description section of the repository page to use these features. Click on the Sign in with XBL button to authenticate. You'll need to sign in using a Microsoft account with an Xbox Live profile associated to it.

## Steam Authentication

Click on the Sign in with Steam button to authenticate using your Steam account. You'll need to confirm your identity through the Steam page everytime you wish to sign in.

## DISCLAIMER

None of your personal information will be stored or shared with anyone. All the data accessed from your account will only be used to better provide our services and offer our products to you as a user of our platform.
