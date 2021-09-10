export type Caller = {
  call(
    method: string,
    resource: string,
    path: string,
    body: string | undefined,
    pathParameters: Record<string, string>,
    queryParameters: Record<string, string>,
    multiQueryParameters: Record<string, string[]>,
    headers: Record<string, string>,
    uri?: string
  ): Promise<{ statusCode: number; body: string; headers: Record<string, string> }>;
}

export type CallerArgs = {
  method: string;
  resource: string;
  path: string;
  body?: string;
  pathParameters: Record<string, string>;
  queryParameters: Record<string, string>;
  multiQueryParameters: Record<string, string[]>;
  headers: Record<string, string>;
  uri?: string;
}

export function wrap(caller: Caller, update: (args: CallerArgs) => Partial<CallerArgs>): Caller {
  return {
    call: (method, resource, path, body, pathParameters, queryParameters, multiQueryParameters, headers, uri) => {
      const updates = update({method, resource, path, body, pathParameters, queryParameters, multiQueryParameters, headers, uri});
      return caller.call(
        updates.method ?? method,
        updates.resource ?? resource,
        updates.path ?? path,
        updates.body ?? body,
        updates.pathParameters ?? pathParameters,
        updates.queryParameters ?? queryParameters,
        updates.multiQueryParameters ?? multiQueryParameters,
        updates.headers ?? headers,
        updates.uri ?? uri
      );
    }
  }
}
