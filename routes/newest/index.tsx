import { Head } from '$fresh/runtime.ts';
import { type Handlers, PageProps } from '$fresh/server.ts';

import { Header } from '../../components/header.tsx';
import { Item } from '../../components/item.tsx';
import { EndpointConstant } from '../../libs/constants/endpoint.constant.ts';
import { ItemFetcherResponse, itemsFetcher } from '../../libs/queries/item.query.ts';
import { storiesFetcher } from '../../libs/queries/story.query.ts';
import { getDifferentInDays, getPageFromSearchParams } from '../../libs/utils/index.ts';

export const handler: Handlers<ItemFetcherResponse> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = getPageFromSearchParams(url);

    const stories = await storiesFetcher(EndpointConstant.NEW_STORIES);
    const result = await itemsFetcher(stories, page);
    const resp = await ctx.render(result);

    return resp;
  },
};

export default function NewestPage(props: PageProps<ItemFetcherResponse>) {
  return (
    <>
      <Head>
        <title>News | Hacker News</title>
      </Head>
      <div className='w-full bg-hackernews-body md:container md:my-2 m-auto'>
        <Header route={props.route} />
        {props.data.data.map((item) => {
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
                new Date(),
              )}
              commentsCount={item.descendants ?? 0}
            />
          );
        })}
        {props.data.canNext && (
          <div className='text-gray-400 text-2xl mt-3 ml-10 pb-10'>
            <a href={`?p=${props.data.nextPage}`}>More</a>
          </div>
        )}
      </div>
    </>
  );
}
