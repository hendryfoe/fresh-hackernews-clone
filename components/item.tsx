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
      {props.no && (
        <div className='text-xl min-w-[2rem] text-right'>{props.no}</div>
      )}
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

        <div className='text-sm'>
          {props.points} points by {props.author} {props.createdAt} |{' '}
          <a
            className='hover:underline'
            href={`/item/${props.id}`}
            disabled={props.points <= 0}
          >
            {props.commentsCount} comments
          </a>
        </div>
        {props.text && <div dangerouslySetInnerHTML={{ __html: props.text }} />}
      </div>
    </section>
  );
}
