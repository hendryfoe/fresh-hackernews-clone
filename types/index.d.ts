type URLSearchParamsArg =
  | ConstructorParameters<typeof URLSearchParams>[0]
  | Record<string, string>;
type FetchInitRequest = RequestInit & { query?: URLSearchParamsArg };
type BodyPayload = BodyInit | null | undefined;
type InitPayload = Omit<FetchInitRequest, 'body'>;
