# Reseptikirja

WIP

A Recipe Book App for adding and browsing recipes, including authentication.

Features:

-   registration with Google
-   choose username
-   add, update and delete recipes
-   browse recipes

The app is responsive, includes dark/light mode switch and skeleton loader.

Based on a [Realtime Chat App tutorial](https://www.youtube.com/watch?v=mj_Qe2jBYS4). The code has been applied to develop a different project with the same technologies.

## Technologies

-   Next.js
-   TypeScript
-   Node.js
-   Apollo / GraphQL
-   Prisma
-   MongoDB
-   Chakra UI

---

## Getting started

Clone the repo

```
$ git clone <repo>
```

## Add the environment variables

In frontend directory, add `.env.local` file. Add the following environment variables:

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

MONGODB_URI=
```

To get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, go to Google Cloud Console and create a new project & credentials. https://next-auth.js.org/providers/google .

To get `MONGODB_URI`, create a new database in MongoDB.

`NEXTAUTH_URL` is the domain of the app. Therefore, locally, it's http://localhost:3000

Not providing `NEXTAUTH_SECRET` would cause an error in the production. To get the secret, in terminal, run the following:

```
$ openssl rand -base64 32
```

In backend directory, create `.env` file. Add the following variables:

```
CLIENT_ORIGIN=
MONGODB_URI=
```

`MONGODB_URI` is the same as in frontend. `CLIENT_ORIGIN` is locally http://localhost:3000.

## Install dependencies & generate Prisma Client

Install the dependencies and generate Prisma Client code both in backend and frontend directories:

```
$ npm install
$ npx prisma generate --schema=src/prisma/schema.prisma
```

Run the project

```
$ cd backend
$ npm run dev

# open new cmd line tab
$ cd .. && cd frontend
$ npm run dev
```
