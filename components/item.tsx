import { urlToDomainName } from '../libs/utils/index.ts';

interface ItemProps {
  id: number;
  no?: string;
  title: string;
  source: string;
  points: number;
  author: string;
  createdAt: string;
  commentsCount: number;
  text?: string;
}

export function Item(props: ItemProps) {
  return (
    <section className='py-2 flex text-gray-400 gap-2'>
      {props.no && <div className='text-xl min-w-[2rem] text-right'>{props.no}</div>}
      <div className='w-[calc(100%-2.5rem)]'>
        <div className='flex flex-wrap items-baseline'>
          <a href={props.source}>
            <h2 className='text-lg text-black mr-1'>{props.title}</h2>
          </a>
          {props.source && (
            <span>
              (
              <a href='#' className='hover:underline'>
                {urlToDomainName(props.source)}
              </a>
              )
            </span>
          )}
        </div>

        <div className='text-xs'>
          {props.points} points by {props.author} {props.createdAt}
          {props.commentsCount > 0 && (
            <>
              <span className='mx-1.5'>|</span>
              <a
                className='hover:underline'
                href={`/item/${props.id}`}
                disabled={props.points <= 0}
              >
                {props.commentsCount} comments
              </a>
            </>
          )}
        </div>
        {props.text && <div className="item-content pt-1.5 text-sm overflow-hidden break-all" dangerouslySetInnerHTML={{ __html: props.text }} />}
      </div>
    </section>
  );
}
