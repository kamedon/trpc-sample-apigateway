import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { apiRouter } from "./trpc/router";
import { createApiContext } from "./trpc/context";

export const handler = awsLambdaRequestHandler({
  router: apiRouter,
  createContext: createApiContext,
});
