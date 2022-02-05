import { readFileSync } from "fs";

export const supergraphSdl = readFileSync(
  "../../../supergraph.graphql"
).toString();
