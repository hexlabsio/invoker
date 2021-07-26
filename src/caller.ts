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
