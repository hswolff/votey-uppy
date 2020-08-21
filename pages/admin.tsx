import ItemList from 'components/ItemList';
import { useItems } from 'services/api-hooks';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';

export default function Admin() {
  const [session, loadingSession] = useSession();
  const router = useRouter();

  const { data, isSuccess } = useItems({ status: 'pending' });

  if (!session) {
    if (!loadingSession) {
      router.push('/');
    }
    return null;
  }

  return <div>{isSuccess && data && <ItemList items={data} />}</div>;
}
