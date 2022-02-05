import { GraphQLRequest } from "apollo-server-core";
import FileUploadDataSource from "@profusion/apollo-federation-upload";

export class AuthenticatedDataSource extends FileUploadDataSource {
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
