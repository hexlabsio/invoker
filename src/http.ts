import {APIGatewayProxyResult} from "aws-lambda";


type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus] | number;

function responder<F>(fn: (code: HttpStatusCode) => F): {[K in keyof typeof HttpStatus]: F} {
  return Object.keys(HttpStatus).reduce((acc, name) => ({...acc, [name]: fn(HttpStatus[name])}), {} as any);
}

export const HttpStatus = {
  continue: 100 as const,
  switchingProtocols: 101 as const,
  earlyHints: 103 as const,
  ok: 200 as const,
  created: 201 as const,
  accepted: 202 as const,
  nonAuthoritativeInformation: 203 as const,
  noContent: 204 as const,
  resetContent: 205 as const,
  partialContent: 206 as const,
  multipleChoices: 300 as const,
  movedPermanently: 301 as const,
  found: 302 as const,
  seeOther: 303 as const,
  notModified: 304 as const,
  temporaryRedirect: 307 as const,
  permanentRedirect: 308 as const,
  badRequest: 400 as const,
  unauthorized: 401 as const,
  paymentRequired: 402 as const,
  forbidden: 403 as const,
  notFound: 404 as const,
  methodNotAllowed: 405 as const,
  notAcceptable: 406 as const,
  proxyAuthenticationRequired: 407 as const,
  requestTimeout: 408 as const,
  conflict: 409 as const,
  gone: 410 as const,
  lengthRequired: 411 as const,
  preconditionFailed: 412 as const,
  payloadTooLarge: 413 as const,
  uRITooLong: 414 as const,
  unsupportedMediaType: 415 as const,
  rangeNotSatisfiable: 416 as const,
  expectationFailed: 417 as const,
  imateapot: 418 as const,
  unprocessableEntity: 422 as const,
  tooEarly: 425 as const,
  upgradeRequired: 426 as const,
  preconditionRequired: 428 as const,
  tooManyRequests: 429 as const,
  requestHeaderFieldsTooLarge: 431 as const,
  unavailableForLegalReasons: 451 as const,
  internalServerError: 500 as const,
  notImplemented: 501 as const,
  badGateway: 502 as const,
  serviceUnavailable: 503 as const,
  gatewayTimeout: 504 as const,
  hTTPVersionNotSupported: 505 as const,
  variantAlsoNegotiates: 506 as const,
  insufficientStorage: 507 as const,
  loopDetected: 508 as const,
  notExtended: 510 as const,
  networkAuthenticationRequired: 511 as const
} as const;


export function customStatusResponse<S extends HttpStatusCode>(statusCode: S, body: string, rest: Partial<Omit<APIGatewayProxyResult, 'statusCode' | 'body'>> = {}): { [K in keyof APIGatewayProxyResult]: (Omit<APIGatewayProxyResult, 'statusCode'> & {statusCode: S})[K]} {
  return {...rest, statusCode, body};
}

export function jsonCustomStatusResponse<T, S extends HttpStatusCode>(statusCode: S, body: T, rest: Partial<Omit<APIGatewayProxyResult, 'statusCode' | 'body'>> = {}): { [K in keyof APIGatewayProxyResult]: (Omit<APIGatewayProxyResult, 'statusCode'> & {statusCode: S})[K]} {
  return customStatusResponse(statusCode, JSON.stringify(body), rest);
}
export const jsonResponse = responder(code => <T>(body: T, rest: Partial<Omit<APIGatewayProxyResult, 'statusCode' | 'body'>> = {}) => jsonCustomStatusResponse(code, body, rest));

