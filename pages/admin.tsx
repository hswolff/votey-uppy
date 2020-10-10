import ItemList from 'components/ItemList';
import { useItems, useSessionUser } from 'services/api-hooks';
import { useRouter } from 'next/dist/client/router';
import { ItemStatus } from 'services/data-types';

export default function Admin() {
  const [sessionUser, , loadingSession] = useSessionUser();
  const router = useRouter();

  const { data, isSuccess } = useItems({ status: ItemStatus.Pending });

  if (!sessionUser) {
    if (!loadingSession) {
      router.push('/');
    }
    return null;
  }

  const isAdmin = sessionUser.role === 'admin';
  if (!isAdmin) {
    router.push('/');
    return;
  }

  return <div>{isSuccess && data && <ItemList items={data} />}</div>;
}
