import { EndpointConstant } from '../constants/endpoint.constant.ts';
import { Request } from '../utils/request.util.ts';

export async function storiesFetcher(storyType: string): Promise<number[]> {
  const endpoint = `${EndpointConstant.API_URL}${storyType}`;
  const stories = await Request.get<number[]>(endpoint).catch((_) => {
    return [];
  });

  return stories;
}
