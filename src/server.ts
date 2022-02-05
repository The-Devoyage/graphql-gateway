import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { isAuth } from "./middleware";
import { ApolloGateway } from "@apollo/gateway";
import { graphqlUploadExpress } from "graphql-upload";
import { Router } from "./routes";
import { AuthenticatedDataSource, supergraphSdl } from "graphql";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(Router);

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
