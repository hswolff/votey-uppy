import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { signin, signout } from 'next-auth/client';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 sm:mx-auto my-4 max-w-xl">
      <Head>
        <title>votey-uppy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        <Link href="/">
          <a className="">
            <h1 className="text-center text-6xl text-purple-700 hover:text-purple-600 transition-colors ease-linear">
              votey-uppy
            </h1>
          </a>
        </Link>
      </div>

      <Nav />

      {children}
    </div>
  );
}

const links = [
  {
    href: '/new',
    text: 'New',
  },
  {
    href: '/about',
    text: 'About',
  },
];

function Nav() {
  const [session] = useSession();

  return (
    <nav className="flex flex-row max-w-md my-4 py-1 px-2 mx-auto justify-between text-purple-900">
      <ul className="flex flex-row space-x-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <a>{link.text}</a>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-row space-x-2">
        {session && (
          <li>
            <Link href="/profile">
              <a>Profile</a>
            </Link>
          </li>
        )}
        <li>
          {session ? (
            <button onClick={() => signout()}>Sign Out</button>
          ) : (
            <button onClick={() => signin('github')}>Sign In</button>
          )}
        </li>
      </ul>
    </nav>
  );
}
