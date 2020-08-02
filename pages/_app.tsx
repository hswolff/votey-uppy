import '../styles/tailwind.css';
import type { AppProps } from 'next/app';
// @ts-expect-error
import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps }: AppProps) {
  const { session } = pageProps;
  return (
    <Provider options={{ site: process.env.SITE }} session={session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
