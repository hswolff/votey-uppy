import React from 'react';
import ItemList from 'components/ItemList';
import { useRouter } from 'next/router';
import { useItems } from 'services/api-hooks';
import {
  Item,
  ItemCategory,
  ItemQueryFilters,
  ItemStatus,
} from 'services/data-types';
import Loading from 'components/Loading';
import Filter from 'components/Filter';

interface HomeProps {
  items: Item[] | undefined;
}

export default function Home({ items }: HomeProps) {
  const router = useRouter();

  const filters: ItemQueryFilters | undefined =
    Object.entries(router.query).length === 0
      ? undefined
      : (router.query as ItemQueryFilters);

  const { data, isSuccess, isLoading } = useItems(filters, {
    initialData: filters ? undefined : items,
  });

  if (!(isSuccess && data)) {
    return null;
  }

  return (
    <div>
      {isLoading && <Loading className="mx-auto text-purple-700 opacity-50" />}

      <div className="flex items-center justify-center pb-1 space-x-4">
        <Filter
          title={filters?.status ?? ItemStatus.Open}
          filterKey="status"
          items={Object.entries(ItemStatus).filter(
            ([, value]) => ![ItemStatus.Pending].includes(value)
          )}
        />

        <Filter
          title={filters?.category ?? 'All'}
          filterKey="category"
          items={[['All', 'All'], ...Object.entries(ItemCategory)]}
        />
      </div>

      {isSuccess && data && <ItemList items={data} />}
    </div>
  );
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
