import { useRouter } from 'next/dist/client/router';
import { Item } from 'components/ItemList';
import { useItemById } from 'services/api-hooks';

export default function ItemPage() {
  const router = useRouter();
  const { itemId } = router.query;

  const { data, isSuccess } = useItemById(itemId as string);

  return <div>{isSuccess && data && <Item item={data} />}</div>;
}
