import '../styles/tailwind.css';
import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'lib/api-hooks';
import Layout from 'components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const { session } = pageProps;
  return (
    <Provider session={session}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
