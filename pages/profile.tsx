import { useMeData } from 'services/api-hooks';
import Card, { Header, Header2 } from 'components/Card';
import ItemList from 'components/ItemList';
import Loading from 'components/Loading';

export default function Me() {
  const { isSuccess, isLoading, data } = useMeData();

  const content = (
    <>
      <Header2>Items You&apos;ve Voted For</Header2>
      <div>{isSuccess && data && <ItemList items={data.votes} />}</div>
    </>
  );

  return (
    <Card className="flex flex-col">
      <Header className="mb-6">Profile</Header>

      {isLoading && <Loading className="mx-auto text-purple-700 opacity-50" />}

      {!isLoading && content}
    </Card>
  );
}
