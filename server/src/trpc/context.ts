import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export function createApiContext({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) {
  return {
    event,
  };
}
