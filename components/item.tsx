import { urlToDomainName } from '../libs/utils/index.ts';

interface ItemProps {
  id: number;
  no: string;
  title: string;
  source: string;
  points: number;
  author: string;
  createdAt: string;
  commentsCount: number;
}

export function Item(props: ItemProps) {
  return (
    <section class='py-2 flex text-gray-400 gap-2'>
      <div class='text-xl min-w-[2rem] text-right'>{props.no}</div>
      <div class='w-[calc(100%-2.5rem)]'>
        <div class='flex flex-wrap items-baseline'>
          <a href={props.source}>
            <h2 class='text-lg text-black mr-1'>{props.title}</h2>
          </a>
          {props.source && (
            <span>
              (
              <a href='#' class='hover:underline'>
                {urlToDomainName(props.source)}
              </a>
              )
            </span>
          )}
        </div>

        <div class='text-sm'>
          {props.points} points by {props.author} {props.createdAt} |{' '}
          <a
            class='hover:underline'
            href={`/item/${props.id}`}
            disabled={props.points <= 0}
          >
            {props.commentsCount} comments
          </a>
        </div>
        {/* <Show when={isOpen()}>
          <div class="overflow-scroll max-h-96 bg-white py-2 px-5 w-[calc(100%-10px)] max-w-[calc(100%-10px)]">
            {props.children(isOpen())}
          </div>
        </Show> */}
      </div>
    </section>
  );
}
