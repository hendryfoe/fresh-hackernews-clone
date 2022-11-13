import { Head } from '$fresh/runtime.ts';
import { PageProps, type Handlers } from '$fresh/server.ts';

import { Header } from '../../components/header.tsx';
import { Item } from '../../components/item.tsx';
import { Items } from '../../components/items.tsx';
import { EndpointConstant } from '../../libs/constants/endpoint.constant.ts';
import {
  ItemData,
  ItemDataEntity,
  ItemDataWithChildren
} from '../../libs/models/item.model.ts';
import { getDifferentInDays } from '../../libs/utils/index.ts';
import { Request } from '../../libs/utils/request.util.ts';

async function itemFetcher(id: string): Promise<ItemData | null> {
  const endpoint = `${EndpointConstant.API_URL}${EndpointConstant.ITEM}`;
  const item = await Request.get<ItemData>(`${endpoint}/${id}.json`).catch(
    () => {
      return null;
    }
  );
  return item;
}

async function itemsFetcher(ids: number[]): Promise<ItemDataWithChildren[]> {
  const endpoint = `${EndpointConstant.API_URL}${EndpointConstant.ITEM}`;
  const endpointPromises = ids.map((id) =>
    Request.get<ItemDataWithChildren>(`${endpoint}/${id}.json`)
  );
  const items = await Promise.all(endpointPromises).catch(() => {
    return [];
  });
  let filteredItems = items.filter((item) => !item.dead && !item.deleted);

  filteredItems = await Promise.all(
    filteredItems.map(async (item) => {
      if (item.kids && item.kids.length > 0) {
        const result = await itemsFetcher(item.kids);
        return {
          ...item,
          children: result
        };
      }

      return item;
    })
  );

  return filteredItems;
}

export const handler: Handlers<ItemDataEntity> = {
  async GET(req, ctx) {
    const { id: itemId } = ctx.params;

    const item = await itemFetcher(itemId);
    if (item == null || item.kids == null || item.kids.length === 0) {
      return ctx.renderNotFound();
    }

    const items = await itemsFetcher(item.kids);
    const resp = await ctx.render({
      parent: item,
      children: items
    });

    return resp;
  }
};

export default function ItemPage(props: PageProps<ItemDataEntity>) {
  const item = props.data.parent
  const items = props.data.children

  return (
    <>
      <Head>
        <title>Fresh - HackerNews</title>
      </Head>
      <div className='w-full bg-hackernews-body md:container md:my-2 m-auto'>
        <Header />
        <section className="px-10">
          <Item
            id={item.id}
            title={item.title}
            source={item.url}
            points={item.score}
            author={item.by}
            createdAt={getDifferentInDays(
              new Date(item.time * 1000),
              new Date()
            )}
            commentsCount={item.descendants ?? 0}
            text={item.text}
          />
          {items && <Items items={items} /> }
          {/* <pre>{JSON.stringify(props.data, null, 2)}</pre> */}
        </section>
      </div>
    </>
  );
}
