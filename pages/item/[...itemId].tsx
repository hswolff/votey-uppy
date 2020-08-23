import { useRouter } from 'next/dist/client/router';
import { Item } from 'components/ItemList';
import { useItemById } from 'services/api-hooks';
import ManageItemForm from 'components/ManageItemForm';

export default function ItemPage() {
  const router = useRouter();

  const [itemId, modifier] = (router.query.itemId ?? []) as [
    string | undefined,
    'edit' | null
  ];

  const { data: item, isSuccess } = useItemById(itemId);

  const isEdit = modifier === 'edit';
  if (modifier && !isEdit) {
    router.push(`/item/${itemId}`);
    return;
  }

  if (isEdit && item) {
    return <ManageItemForm mode="edit" item={item} />;
  }

  return <div>{isSuccess && item && <Item item={item} />}</div>;
}
