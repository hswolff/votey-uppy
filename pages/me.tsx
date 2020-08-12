import { useMeData } from 'services/api-hooks';
import ItemList from 'components/ItemList';

export default function Me() {
  const { isSuccess, data } = useMeData();
  return (
    <div>
      <h1 className="text-6xl border-b border-gray-600 mb-8">Me!</h1>

      <h2 className="text-4xl">Items You&apos;ve Voted For</h2>
      <div>{isSuccess && data && <ItemList items={data.votes} />}</div>
    </div>
  );
}
