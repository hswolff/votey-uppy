import { useMeData } from 'services/api-hooks';
import ItemList from 'components/ItemList';
import Loading from 'components/Loading';

export default function Me() {
  const { isSuccess, isLoading, data } = useMeData();
  return (
    <div>
      <h1 className="text-6xl border-b border-gray-600 mb-8">Me!</h1>

      {isLoading && <Loading className="mx-auto text-purple-700 opacity-50" />}
      <h2 className="text-4xl">Items You&apos;ve Voted For</h2>
      <div>{isSuccess && data && <ItemList items={data.votes} />}</div>
    </div>
  );
}
