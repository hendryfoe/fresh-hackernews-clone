export function Header(props: { route: string }) {
  return (
    <header className='bg-hackernews-title p-0.5 pl-2 flex items-center gap-3'>
      <div className='font-extrabold'>
        <a href='/'>Hacker News</a>
      </div>
      <div className='flex items-center gap-2 text-sm'>
        <a href='/newest' className={props.route === '/newest' ? 'text-bold text-white' : ''}>new</a>
        <span>|</span>
        <a href='/best' className={props.route === '/best' ? 'text-bold text-white' : ''}>best</a>
      </div>
    </header>
  );
}
