import { buildURL } from './index.ts';

async function internalFetcher<T>(...args: Parameters<typeof fetch>): Promise<T> {
  const response = await fetch(...args);
  if (!response.ok) {
    throw response;
  }
  return response.json();
}

function defaultRequest(fetcher: typeof internalFetcher) {
  return {
    get<ReturnData>(endpoint: string, init?: InitPayload): Promise<ReturnData> {
      return fetcher(buildURL(endpoint, init?.query), init);
    },
    post<ReturnData>(endpoint: string, body?: BodyPayload, init?: InitPayload): Promise<ReturnData> {
      return fetcher(buildURL(endpoint, init?.query), {
        ...init,
        body,
        method: 'POST',
      });
    },
    put<ReturnData>(endpoint: string, body?: BodyPayload, init?: InitPayload): Promise<ReturnData> {
      return fetcher(buildURL(endpoint, init?.query), {
        ...init,
        body,
        method: 'PUT',
      });
    },
    delete<ReturnData>(endpoint: string, body?: BodyPayload, init?: InitPayload): Promise<ReturnData> {
      return fetcher(buildURL(endpoint, init?.query), {
        ...init,
        body,
        method: 'DELETE',
      });
    },
  };
}

export const Request = defaultRequest(internalFetcher);
