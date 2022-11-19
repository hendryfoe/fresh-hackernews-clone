import type { ItemData, ItemDataWithChildren, ItemDataWithNo } from '../models/item.model.ts';
import { EndpointConstant } from '../constants/endpoint.constant.ts';
import { GeneralConstant } from '../constants/general.constant.ts';
import { Request } from '../utils/request.util.ts';

export interface ItemFetcherResponse {
  data: ItemDataWithNo[];
  nextPage: number;
  canNext: boolean;
}

export async function itemsFetcher(
  stories: number[],
  page: number,
): Promise<ItemFetcherResponse> {
  const endpoint = `${EndpointConstant.API_URL}${EndpointConstant.ITEM}`;
  const start = page * GeneralConstant.ITEMS_PER_PAGE;
  const end = (page + 1) * GeneralConstant.ITEMS_PER_PAGE;
  const canNext = stories.length > end;
  const nextPage = page + 2;

  const endpointPromises = stories.slice(start, end).map((id) => {
    return Request.get<ItemData>(`${endpoint}/${id}.json`);
  });

  const items = await Promise.all(endpointPromises).catch((_) => {
    return [];
  });

  const data: ItemDataWithNo[] = items.map((item, index) => {
    return {
      no: start + (index + 1),
      ...item,
    };
  });

  return { data, nextPage, canNext };
}

export async function itemFetcher(id: string): Promise<ItemData | null> {
  const endpoint = `${EndpointConstant.API_URL}${EndpointConstant.ITEM}/${id}.json`;
  const item = await Request.get<ItemData>(endpoint).catch((_) => {
    return null;
  });
  return item;
}

export async function itemWithCommentsFetcher(ids: number[]): Promise<ItemDataWithChildren[]> {
  const endpoint = `${EndpointConstant.API_URL}${EndpointConstant.ITEM}`;
  const endpointPromises = ids.map((id) => Request.get<ItemDataWithChildren>(`${endpoint}/${id}.json`));
  const items = await Promise.all(endpointPromises).catch(() => {
    return [];
  });
  const filteredItems = items.filter((item) => !item.dead && !item.deleted);
  const filteredItemsPromises = filteredItems.map(async (item) => {
    if (item.kids && item.kids.length > 0) {
      const result = await itemWithCommentsFetcher(item.kids);

      return {
        ...item,
        children: result,
      };
    }

    return item;
  });

  const result = await Promise.all(filteredItemsPromises);

  return result;
}
