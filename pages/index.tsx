import ItemList from 'components/ItemList';
import { useItems } from 'services/api-hooks';

export default function Home() {
  const { data, isSuccess } = useItems();

  return <div>{isSuccess && data && <ItemList items={data} />}</div>;
}
