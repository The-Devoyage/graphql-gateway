# The Devoyage GraphQL Gateway

A simple to spin up and customize Apollo Gateway with pre-built Authorization Checking and File Uploading/Serving features. Use it out of the box, or as a starting point to jump start your API design.

## Features

### JSON Web Token Decryption

All incoming request to the gateway are checked for a JSON Web Token. Auth context is then generated and passed on to other micro services.

Set the JWT Decryption Key from within the Environment Variables to allow the Gateway to decode incoming tokens.

### File Uploading and Serving

File uploads are handled through external services, but can pass through the Gateway first using `graphql-upload` and custom "Remote Data Source" Classes. This allows you to use graphql to upload new files.

File serving is also handled with the gateway using express. Define the `route` such as `/public`, and the location of the upload/file server in the environment variables. All file requests that use the defiend route will bypass the graphql server in favor of an express proxy, directly to your file server.

## Usage

### Clone and Setup

1. Purchase access from our [Basetools Account](https://www.google.com).

2. Next, install dependencies.

Global Dependencies:

Rover CLI to generate Supergraph

```
curl -sSL https://rover.apollo.dev/nix/latest | sh
```

Install Dependencies:

```
npm install
```

3. Set Environment Variables

   Copy the `.env.example` file to `.env` and fill in the variables. If you are using docker or docker-compose, you can use the various built in environment variable options to set these variables.

4. Run the application.

In development

```
npm run dev
```

or In Production

```
npm start
```

5. Create a Supergraph config for use with Rover.

   An example supergraph config is found in the root of the project at `./supergraph-config.yaml`. Spacing is important in a yaml file. Fill in the information about your existing services.

6. Use Rover to generate the Supergraph.

Once the server is up and running, run the following command to generate a supergraph.graphql file.

```
rover supergraph compose --config ./supergraph-config.yaml > supergraph.graphql
```

If you are using Docker or Docker-Compose, create a volume to mount the newly generated `supergraph.graphql` to `/app/supergraph.graphql`.

7. Anytime a new supergraph is generated, you must restart the server. Create new supergraphs as the typings of external services change.
