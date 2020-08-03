import Content from 'components/content';
import { useItems } from 'hooks/api-hooks';

export default function Home() {
  const { data, isSuccess } = useItems();

  return <div>{isSuccess && data && <Content items={data} />}</div>;
}
