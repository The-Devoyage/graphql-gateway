import "module-alias/register";
import "source-map-support/register";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";
import { graphqlUploadExpress } from "graphql-upload";
import { Router } from "./routes";
import { readFileSync } from "fs";
import { Helpers } from "@the-devoyage/micro-auth-helpers";
import { ApolloServerPluginGraphQLPaywall } from "@the-devoyage/paywall-helpers";

const supergraphSdl = readFileSync("./supergraph.graphql").toString();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(Router);

const gateway = new ApolloGateway({
  supergraphSdl: supergraphSdl ?? "",
  buildService({ url }) {
    const dataSource = new Helpers.Gateway.ContextDataSource({ url });
    return dataSource;
  },
});

async function startServer() {
  const apolloServer = new ApolloServer({
    gateway,
    context: async ({ req }) =>
      await Helpers.Gateway.GenerateContext({
        headers: ["Authorization"],
        req,
        secretOrPublicKey: process.env.JWT_ENCRYPTION_KEY,
      }),
    plugins: [
      ApolloServerPluginGraphQLPaywall({
        paywallURI: "http://localhost:5010",
        config: { createPurchaseContext: true },
      }),
    ],
  });
  await apolloServer.start();
  app.use(graphqlUploadExpress());

  apolloServer.applyMiddleware({
    app,
    path: "/graphql",
  });
}

startServer();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`GATEWAY ====> UP ON PORT ${port}`));
