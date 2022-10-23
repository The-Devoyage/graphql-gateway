# The Devoyage GraphQL Gateway

An Apollo Gateway server with pre-built authorization, file routing capabilities.

## Features

### Apollo Gateway

Uses Apollo Gateway out of the box! Build supergraph schema, and send the requests.

### JWT Authorization

Built in, the gateway can authorize requests using JWTs. The gateway will check every request for the JWT and provide useful context for subsequent actions.

1. Set Token Secret Key in `.env`.

2. Pass the issued JSON web token in the `Authorization` header with each request. Be sure to sign the token with the same key used in step one.

```json
// Request Headers
{
  "Authorization": "Bearer $TOKEN",
}
}
```

3. Authorization context is appended to `Global Context`.

- Token payloads are decoded and attached to context.
- Authorization status is determined based on valid tokens, and attached to context.
- Errors are propagated and attached to context.

### Global Context

Each request is appended with `Global Context`. This is data that can be utilized within subgraphs. 

```
// Subgraph Service:
// request.headers.context
{
  auth: {
    payload: { ...tokenPayload };
    isAuth: boolean;
    error?: string;
  },
  ...customContext
}
```

### File Serving Proxy

A file serving proxy is included to get files from an external API/micro service. This way you can keep a single API endpoint while accessing restful data from external services.

1. Configure the `.env` variables. Both are required. 
  - `MEDIA_SERVER_URL` - The url of the file upload server.
  - `MEDIA_SERVING_ROUTE` - The endpoint to request media from.

2. Send request for the file to `$YOUR_GATEWAY_URL/$MEDIA_SERVING_ROUTE/YOUR_CUSTOM_ENDPOINT`.
  - The request is now proxied to `$MEDIA_SERVER_URL/YOUR_CUSTOM_ENDPOINT` to receive/handle the request.


### File Uploading "Proxy"

Attach files directly to graphql mutations of which support the `@profusion/apollo-federation-upload` library.

1. Ensure the file uploading server is set up with the `@profusion/apollo-federation-upload` library.

2. Send files as documented through graphql mutations. This server is pre-configured to allow files through graphql requests using the same library. 

## License

This repository provides a GPL License by default. If you want to use this product in a private commercial setting, you may purchase the MIT Licensed Version [Here!](https://thedevoyage.gumroad.com/l/graphql-gateway)

## Setup

### Clone and Setup

1. Install dependencies

Global Dependencies:

Rover CLI to generate Supergraph - Documentation about Rover is provided on the Apollo Rover website.

Install Dependencies:

```
npm install
```

2. Set Environment Variables

   Copy the `.env.example` file to `.env` and fill in the variables. 

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

   An example supergraph config is found in the root of the project at `./supergraph-config.yaml`.

5. Start the subgraphs and use Rover to generate the Supergraph.

Once the server is up and running, run the following command to generate a `supergraph.graphql` file.

```
rover supergraph compose --config ./supergraph-config.yaml > supergraph.graphql
```

You may also use the npm script:

```
npm run supergraph
```

If you are using Docker or Docker-Compose, create a volume to mount the newly generated `supergraph.graphql` to `/app/supergraph.graphql`. This will allow you to override the `supergraph.graphql` file that is default inside the container.

6. Anytime a new supergraph is generated, you must restart the server. Create new supergraphs as the typings of external services change.

