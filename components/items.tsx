import { ItemDataWithChildren } from '../libs/models/item.model.ts';
import { getDifferentInDays } from '../libs/utils/index.ts';

interface CommentProps {
  items: ItemDataWithChildren[];
}

export function Items(props: CommentProps) {
  return (
    <>
      {props.items.map((item) => {
        return (
          <>
            <section className='py-1 mb-2'>
              <div className='text-xs text-gray-500 flex items-center'>
                <span className='mr-0.5'>&#x2022;</span>
                <h5>
                  {item.by} {getDifferentInDays(new Date(item.time * 1000), new Date())}
                </h5>
              </div>
              <div
                className='ml-2 text-black pt-1 item-content text-sm overflow-hidden break-all'
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </section>
            {item.children && item.children.length > 0 && (
              <section className='pl-4 sm:pl-6 md:pl-8 lg:pl-4'>
                <Items items={item.children} />
              </section>
            )}
          </>
        );
      })}
    </>
  );
}
