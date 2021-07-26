import {Caller} from "./caller";
import {Lambda} from 'aws-sdk';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

export function lambdaApiInvoker(arn: string, lambda: Lambda, transform: (request: APIGatewayProxyEvent) => APIGatewayProxyEvent = r => r): Caller {
  return { call: (async (method, resource, path, body, pathParameters, queryParameters, headers) => {
      const request = transform({ httpMethod: method, resource, path, body: body ?? null, pathParameters: pathParameters as any, headers: headers as any, queryStringParameters: queryParameters} as APIGatewayProxyEvent);
      const result = await lambda.invoke({FunctionName: arn, InvocationType: 'RequestResponse', Payload: JSON.stringify(request)}).promise();
      if(result.StatusCode! >= 200 && result.StatusCode! < 300) {
        const response: APIGatewayProxyResult = JSON.parse(result.Payload!.toString());
        return {statusCode: response.statusCode, body: response.body, headers: response.headers as any };
      }
      throw new Error(result.FunctionError ?? 'Unknown Invoke Error');
    }) };
}
