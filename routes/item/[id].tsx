import { Head } from '$fresh/runtime.ts';
import { type PageProps, type RouteContext } from '$fresh/server.ts';

import { Header } from '../../components/header.tsx';
import { Item } from '../../components/item.tsx';
import { Items } from '../../components/items.tsx';
import { itemFetcher, itemWithCommentsFetcher } from '../../libs/queries/item.query.ts';
import { getDifferentInDays } from '../../libs/utils/index.ts';

export default async function ItemPage(req: Request, ctx: RouteContext<PageProps>) {
  const { id: itemId } = ctx.params;

  const item = await itemFetcher(itemId);
  if (item == null || item.kids == null || item.kids.length === 0) {
    return ctx.renderNotFound();
  }

  const items = await itemWithCommentsFetcher(item.kids);

  return (
    <>
      <Head>
        <title>{item.title} | HackerNews</title>
        <style>
          {`
          .item-content a {
            text-decoration: underline;
            color: rgba(107,114,128,var(--tw-text-opacity));
          }
          .item-content pre {
            overflow: hidden;
            white-space: pre-wrap;
          }
          .item-content p {
            margin-top: 4px;
          }
        `}
        </style>
      </Head>
      <div className='w-full bg-hackernews-body md:container md:my-2 m-auto'>
        <Header route={ctx.route} />
        <section className='px-10 pb-5'>
          <Item
            id={item.id}
            title={item.title}
            source={item.url}
            points={item.score}
            author={item.by}
            createdAt={getDifferentInDays(
              new Date(item.time * 1000),
              new Date(),
            )}
            commentsCount={item.descendants ?? 0}
            text={item.text}
          />
          {items && <Items items={items} />}
          {/* <pre>{JSON.stringify(props.data, null, 2)}</pre> */}
        </section>
      </div>
    </>
  );
}
