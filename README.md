## [ENDGAME PORTAL](https://endgame-portal.vercel.app/)

This project contains the source code for the ENDGAME web portal, which uses Next.JS, Typescript and Tailwind CSS.

## Getting Started

First, configure your environment variables to start the development server. See the .env.example file for reference.

Run the express server app, or use the hosted Express Deployment. Then, run the development server:

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

To authenticate using PSN, first enter the Playstation Network page and sign in using your email and password. After signing in, visit the link in the home page to retrieve the NPSSO token for your account. Enter the token and click on the submit button.

## Xbox Live Authentication

Currently, the Xbox Live features are only available on the Vercel Deployment. Visit the URL in the description section of the repository page to use these features. You'll need to sign in using a Microsoft account with an Xbox profile associated to it.

## Steam Authentication

Click on the Sign in with Steam button to authenticate using your Steam account. You'll need to confirm your identity through the Steam page everytime you wish to sign in.

## DISCLAIMER

None of your personal information will be stored or shared with anyone. All the data accessed from your account will merely be used to provide our services and offer our products to you as a user of our website.
