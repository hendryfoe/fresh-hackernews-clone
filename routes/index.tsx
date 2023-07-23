import { Head } from '$fresh/runtime.ts';
import { type PageProps, type RouteContext } from '$fresh/server.ts';

import { Header } from '../components/header.tsx';
import { Item } from '../components/item.tsx';
import { EndpointConstant } from '../libs/constants/endpoint.constant.ts';
import { itemsFetcher } from '../libs/queries/item.query.ts';
import { storiesFetcher } from '../libs/queries/story.query.ts';
import { getDifferentInDays, getPageFromSearchParams } from '../libs/utils/index.ts';

export default async function HomePage(req: Request, ctx: RouteContext<PageProps>) {
  const url = new URL(req.url);
  const page = getPageFromSearchParams(url);

  const stories = await storiesFetcher(EndpointConstant.TOP_STORIES);
  const result = await itemsFetcher(stories, page);

  return (
    <>
      <Head>
        <title>Fresh | Hacker News</title>
      </Head>
      <div className='w-full bg-hackernews-body md:container md:my-2 m-auto'>
        <Header route={ctx.route} />
        {result.data.map((item) => {
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
        {result.canNext && (
          <div className='text-gray-400 text-2xl mt-3 ml-10 pb-10'>
            <a href={`?p=${result.nextPage}`}>More</a>
          </div>
        )}
      </div>
    </>
  );
}
