# GraphQL Gateway - The Devoyage

A simple to spin up and customize Apollo Gateway with pre-built Auth and File Uploading/Serving Features. Use it out of the box, or as a starting point to jump start your API design.

## Built In Features

### JSON Web Token Decryption

All incoming request to the gateway are checked for a JSON Web Token. Auth context is generated and passed on to other micro services.

Set the JWT Decryption Key from within the Environment Variables to allow the Gateway to decode incoming tokens.

All requests are passed on to the next microservice, with context to define the auth status, allowing the service to have more control over handling un-authenticated or restricted content.

### File Uploading and Serving

File uploads are handled through an external services, but still pass through the Gateway with GraphQL Post Requests using `graphql-upload`, which is pre-configured out of the box.

File serving is also handled through the gateway with express. Define the `route` such as `/public` (default) in the environment variable. Then, provide the location of the file server. Once the correct configuration has been implemented, you can request files from your gateway through the defined route.

## Usage

### Clone and Setup

1. Purchase access from our [Basetools Account](https://www.google.com).

2. Next, install dependencies.

Global Dependencies:

Rover CLI to generate Supergraph

```
curl -sSL https://rover.apollo.dev/nix/latest | sh
```

Project Dependencies:

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

or for production

```
npm start
```

5. Create a Supergraph config for use with Rover.

   An example config is found in the root of the project at `./supergraph-config.yaml`. Spacing is important in a yaml file.

6. Use Rover to generate the Supergraph.

```
rover supergraph compose --config ./supergraph-config.yaml > supergraph.graphql
```

If you are using Docker or Docker-Compose, create a volume to mount the newly generated `supergraph.graphql` to `/app/supergraph.graphql`.

7. Anytime a new supergraph is generated, you must restart the server.
