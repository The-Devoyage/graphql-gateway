import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { isAuth } from "./middleware";
import { ApolloGateway } from "@apollo/gateway";
import { GraphQLRequest } from "apollo-server-core";
import { readFileSync } from "fs";
import { createProxyMiddleware } from "http-proxy-middleware";
import FileUploadDataSource from "@profusion/apollo-federation-upload";
import { graphqlUploadExpress } from "graphql-upload";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mediaServerUrl = process.env.MEDIA_SERVER_URL;

if (mediaServerUrl) {
  app.use(
    "/public",
    createProxyMiddleware({
      target: process.env.MEDIA_SERVER_URL,
      changeOrigin: false,
    })
  );
}

const supergraphSdl = readFileSync("./supergraph.graphql").toString();

class AuthenticatedDataSource extends FileUploadDataSource {
  willSendRequest({
    request,
    context,
  }: {
    request: GraphQLRequest;
    context: any;
  }) {
    request.http?.headers.set("token", JSON.stringify(context.token));
    request.http?.headers.set("isauth", JSON.stringify(context.isAuth));
  }
}

const gateway = new ApolloGateway({
  supergraphSdl,
  buildService({ url }) {
    const dataSource = new AuthenticatedDataSource({ url });
    return dataSource;
  },
});

let apolloServer;

async function startServer() {
  apolloServer = new ApolloServer({
    gateway,
    context: ({ req }) => {
      return isAuth(req);
    },
  });
  await apolloServer.start();
  app.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app });
}

startServer();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`GATEWAY ====> UP ON PORT ${port}`));
