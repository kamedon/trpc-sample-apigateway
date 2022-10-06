import {
  aws_apigateway as apigateway,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_s3 as s3,
  aws_s3_deployment as s3Deploy,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class FormationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaRole = new iam.Role(this, "TRpcSampleLambdaRole", {
      roleName: "TRpcSampleLambdaRole",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });

    const tRpcLambda = new lambda.Function(this, "TRpcLambda", {
      functionName: "trpc",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../server/lambda.zip")
      ),
      memorySize: 128,
      handler: "dist/index.handler",
      role: lambdaRole,
      environment: {
        NODE_ENV: "production",
      },
    });

    const api = new apigateway.RestApi(this, "TRpcApi", {
      restApiName: "TRpcApi",
      description: "TRpcApi",
      endpointTypes: [apigateway.EndpointType.EDGE],
      deployOptions: { stageName: "v1" },
    });

    const apiResource = api.root.addResource("api");
    const anyResource = apiResource.addResource("{path+}");
    anyResource.addMethod("any", new apigateway.LambdaIntegration(tRpcLambda));

    ///// CF

    const trpSampleBucket = new s3.Bucket(this, "TRpcSampleKamedonS3", {
      bucketName: "trpc-sample-kamedon",
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity",
      {
        comment: "website-distribution-originAccessIdentity",
      }
    );

    const bucketPolicyStatement = new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.CanonicalUserPrincipal(
          originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
      resources: [trpSampleBucket.bucketArn + "/*"],
    });
    trpSampleBucket.addToResourcePolicy(bucketPolicyStatement);

    const cachePolicy = new cloudfront.CachePolicy(
      this,
      "TRpcSampleCFCachePolicy",
      {
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      }
    );

    const distribution = new cloudfront.Distribution(this, "TRpcSampleCF", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cachePolicy,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new origins.S3Origin(trpSampleBucket, {
          originAccessIdentity: originAccessIdentity,
        }),
      },
      additionalBehaviors: {
        "/api/*": {
          origin: new origins.RestApiOrigin(api),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cachePolicy,
        },
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    new s3Deploy.BucketDeployment(this, "WebsiteDeploy", {
      sources: [
        s3Deploy.Source.asset(path.join(__dirname, "../../client/dist")),
      ],
      destinationBucket: trpSampleBucket,
      distribution: distribution,
      distributionPaths: ["/*"],
    });
  }
}
