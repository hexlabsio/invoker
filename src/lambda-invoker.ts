import {Caller} from "./caller";
import {Lambda} from 'aws-sdk';
import {APIGatewayProxyResult} from 'aws-lambda';

function lambdaInvoker(arn: string, lambda: Lambda): Caller {
  return { call: (async (method, resource, path, body, pathParameters, queryParameters, headers) => {
      const result = await lambda.invoke({FunctionName: arn, InvocationType: 'RequestResponse', Payload: JSON.stringify({ httpMethod: method, resource, path, body: body ?? null, pathParameters: pathParameters as any, headers, queryStringParameters: queryParameters})}).promise();
      if(result.StatusCode! >= 200 && result.StatusCode! < 300) {
        const response: APIGatewayProxyResult = JSON.parse(result.Payload!.toString());
        return {statusCode: response.statusCode, body: response.body, headers: response.headers as any };
      }
      throw new Error(result.FunctionError ?? 'Unknown Invoke Error');
    }) };
}

export default lambdaInvoker;
