import axios from "axios";
import {Caller} from "./caller";
import qs from 'query-string';

const httpInvoker: Caller = { call: async (
  method: any,
  resource: any,
  path: string,
  body: any,
  pathParameters: any,
  queryParameters: any,
  multiQueryParameters: any,
  headers: any,
  url: string
) => {
  const result = await axios(url + path, {
    method: method as any,
    data: body,
    paramsSerializer: (params) => qs.stringify(params),
    params: { ...queryParameters, ...multiQueryParameters },
    headers,
    transformResponse: [],
  });
  return {
    statusCode: result.status,
    body: result.data,
    headers: result.headers as any,
  };
} };

export default httpInvoker