import { useRouter } from 'next/dist/client/router';
import Item from 'components/Item';
import { useItemById } from 'lib/api-hooks';
import ManageItemForm from 'components/ManageItemForm';
import { Header, Card } from 'components/Typography';

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
    return (
      <Card>
        <Header>Edit Item</Header>
        <ManageItemForm mode="edit" item={item} />
      </Card>
    );
  }

  return <div>{isSuccess && item && <Item item={item} />}</div>;
}
