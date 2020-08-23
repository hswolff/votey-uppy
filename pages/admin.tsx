import ItemList from 'components/ItemList';
import { useItems } from 'services/api-hooks';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { ItemStatus } from 'services/data-types';

export default function Admin() {
  const [session, loadingSession] = useSession();
  const router = useRouter();

  const { data, isSuccess } = useItems({ status: ItemStatus.Pending });

  if (!session) {
    if (!loadingSession) {
      router.push('/');
    }
    return null;
  }

  const isAdmin = session.user.role === 'admin';
  if (!isAdmin) {
    router.push('/');
    return;
  }

  return <div>{isSuccess && data && <ItemList items={data} />}</div>;
}
