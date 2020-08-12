import ItemList from 'components/ItemList';
import { useItems } from 'services/api-hooks';
import { Item } from 'services/data-types';

interface HomeProps {
  items: Item[] | undefined;
}

export default function Home({ items }: HomeProps) {
  const { data, isSuccess } = useItems({ initialData: items });

  return <div>{isSuccess && data && <ItemList items={data} />}</div>;
}

export async function getStaticProps() {
  const res = await fetch(`${process.env.SITE}/api/items`);
  const items = await res.json();

  return {
    props: {
      items,
    },
    revalidate: 30,
  };
}
