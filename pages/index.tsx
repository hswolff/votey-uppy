import Head from 'next/head';
import SignIn from 'components/sign-in';
import Content from 'components/content';
import AddItemForm from 'components/AddItemForm';
import { useItems } from 'hooks/api-hooks';

export default function Home() {
  const { data, isSuccess } = useItems();

  return (
    <div>
      <Head>
        <title>votey-uppy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto my-4 max-w-6xl">
        <h1 className="text-center text-6xl">votey-uppy</h1>
      </main>

      <SignIn />
      <AddItemForm />
      {isSuccess && data && <Content items={data} />}
    </div>
  );
}
