# The Devoyage GraphQL Gateway

A simple to spin up and customize Apollo Gateway with pre-built Authorization Checking and File Uploading/Serving features. Use it out of the box, or as a starting point to jump start your API design.

## Features

### Authentication and Authorization Built In

The `graphql-gateway` repo is ready to deploy with authorization and authentication features. Simply pass a JSON web token in the `Authorization` header with each request. It is NOT required to send the token.

All incoming request are checked for the token. If the environment variables are set properly, the server will decode the token's payload and send the context to all federated subgraphs automatically.

### File Uploading and Serving - Routing Features

File upload routing is pre-configured to allow file uploads to an external file upload server that is using the `graphql-upload` package. This repo uses `@profusion/apollo-federation-upload` package to route the files to the external file upload server out of the box. Note, this is not a file upload server.

File serving is also enabled by default using proxies to serve static files from an external express server. These can be configured through environment variables. The gateway server proxies requests for files at a custom route, `/public` by default. All requests that use this endpoint are proxied to the uri set in the env vars.

## Setup

### Clone and Setup

1. Next, install dependencies.

Global Dependencies:

Rover CLI to generate Supergraph

```
curl -sSL https://rover.apollo.dev/nix/latest | sh
```

Login to Github NPM Registry:

There are a few packages we use that are located within the NPM Github Registry -- Login, so that you may install them with NPM.

```
npm login --registry=https://npm.pkg.github.com
```

Install Dependencies:

```
npm install
```

2. Set Environment Variables

   Copy the `.env.example` file to `.env` and fill in the variables. If you are using docker or docker-compose, you can use the various built in environment variable options to set these variables.

3. Run the application.

In development

```
npm run dev
```

or In Production

```
npm start
```

4. Create a Supergraph config for use with Rover.

   An example supergraph config is found in the root of the project at `./supergraph-config.yaml`. Spacing is important in a yaml file. Fill in the information about your existing services.

5. Start the subgraphs and use Rover to generate the Supergraph.

Once the server is up and running, run the following command to generate a supergraph.graphql file.

```
rover supergraph compose --config ./supergraph-config.yaml > supergraph.graphql
```

If you are using Docker or Docker-Compose, create a volume to mount the newly generated `supergraph.graphql` to `/app/supergraph.graphql`. This will allow you to override the `supergraph.graphql` file that is default inside the container.

7. Anytime a new supergraph is generated, you must restart the server. Create new supergraphs as the typings of external services change.
