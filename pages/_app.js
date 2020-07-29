import '../styles/tailwind.css';
import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  const { session } = pageProps;
  return (
    <Provider options={{ site: process.env.SITE }} session={session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
