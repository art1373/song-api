## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

- Go to `main.ts` and un-comment the `app.enableCors()`
- Make sure to comment the other `app.enableCors({...})` for production

Then:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

```

## Live version?

go to this [Link](https://songs-client-ten.vercel.app/)

**Important** I used Vercel and Render for web service and client, the Render platform makes the api go to sleep in free tier, so you need to wait at least a good minute or two before it's live again :).
