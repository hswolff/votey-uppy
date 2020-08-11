import '../styles/tailwind.css';
import type { AppProps } from 'next/app';
// @ts-expect-error
import { Provider } from 'next-auth/client';
import Layout from 'components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const { session } = pageProps;
  return (
    <Provider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
