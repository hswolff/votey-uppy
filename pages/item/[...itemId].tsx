import { useRouter } from 'next/dist/client/router';
import Item from 'components/Item';
import { useItemById } from 'lib/api-hooks';
import ManageItemForm from 'components/ManageItemForm';
import { Header, Card } from 'components/Typography';
import Loading from 'components/Loading';

export default function ItemPage() {
  const router = useRouter();

  const [itemId, modifier] = (router.query.itemId ?? []) as [
    string | undefined,
    'edit' | null
  ];

  const { data: item, isSuccess, isLoading } = useItemById(itemId);

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

  return (
    <div>
      {isLoading && (
        <Loading className="mx-auto my-4 text-purple-700 opacity-50" />
      )}
      {isSuccess && item && <Item item={item} />}
    </div>
  );
}
