import Head from 'next/head';
import Content from 'components/content';

export default function Home() {
  return (
    <div>
      <Head>
        <title>votey-uppy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto my-4 max-w-6xl">
        <h1 className="text-center text-6xl">votey-uppy</h1>
      </main>

      <Content />
    </div>
  );
}
