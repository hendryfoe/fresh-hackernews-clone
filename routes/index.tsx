import { Head } from '$fresh/runtime.ts';
import { PageProps, type Handlers } from '$fresh/server.ts';

import { Header } from '../components/header.tsx';
import { Item } from '../components/item.tsx';
import { EndpointConstant } from '../libs/constants/endpoint.constant.ts';
import { GeneralConstant } from '../libs/constants/general.constant.ts';
import type { ItemData, ItemDataWithNo } from '../libs/models/item.model.ts';
import { getDifferentInDays } from '../libs/utils/index.ts';
import { Request } from '../libs/utils/request.util.ts';

interface ItemFetcherResponse {
  data: ItemDataWithNo[];
  nextPage: number;
  canNext: boolean;
}

async function itemsFetcher(
  stories: number[],
  page: number
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
      ...item
    }
  })

  return { data, nextPage, canNext };
}

async function storiesFetcher(): Promise<number[]> {
  const endpoint = `${EndpointConstant.API_URL}${EndpointConstant.STORIES}`;
  const stories = await Request.get<number[]>(endpoint).catch((_) => {
    return [];
  });

  return stories;
}

export const handler: Handlers<ItemFetcherResponse> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    let page = Number(url.searchParams.get('p'));
    page = Number.isNaN(page) ? 0 : page;
    page = page <= 1 ? 0 : page - 1;

    const stories = await storiesFetcher();
    const result = await itemsFetcher(stories, page);
    const resp = await ctx.render(result);

    return resp;
  }
};

export default function Home(props: PageProps<ItemFetcherResponse>) {
  return (
    <>
      <Head>
        <title>Fresh - HackerNews</title>
      </Head>
      <div className='w-full bg-hackernews-body md:container md:my-2 m-auto'>
        <Header />
        {props.data.data.map((item, index) => {
          return (
            <Item
              id={item.id}
              no={`${item.no}.`}
              title={item.title}
              source={item.url}
              points={item.score}
              author={item.by}
              createdAt={getDifferentInDays(
                new Date(item.time * 1000),
                new Date()
              )}
              commentsCount={item.descendants ?? 0}
            />
          );
        })}
        {props.data.canNext && (
          <div className='text-gray-400 text-2xl mt-3 ml-10 pb-10'>
            <a href={`/?p=${props.data.nextPage}`}>More</a>
          </div>
        )}
      </div>
    </>
  );
}
