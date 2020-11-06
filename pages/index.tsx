import React from 'react';
import ItemList from 'components/ItemList';
import { useRouter } from 'next/router';
import { useItems, useSessionUser } from 'lib/api-hooks';
import {
  Item,
  ItemCategory,
  ItemQueryFilters,
  ItemStatus,
} from 'lib/data-types';
import Loading from 'components/Loading';
import Filter from 'components/Filter';

interface HomeProps {
  items: Item[] | undefined;
}

export default function Home({ items }: HomeProps) {
  const router = useRouter();
  const [sessionUser] = useSessionUser();
  const isAdmin = sessionUser?.role === 'admin';

  const filters: ItemQueryFilters | undefined =
    Object.entries(router.query).length === 0
      ? undefined
      : (router.query as ItemQueryFilters);

  const { data, isLoading } = useItems(filters, {
    initialData: filters ? undefined : items,
  });

  return (
    <div>
      <div className="flex items-center justify-center pb-1 space-x-4">
        <Filter
          title={filters?.status ?? ItemStatus.Open}
          filterKey="status"
          items={Object.entries(ItemStatus).filter(
            ([, value]) =>
              ![isAdmin ? undefined : ItemStatus.Pending].includes(value)
          )}
        />

        <Filter
          title={filters?.category ?? 'All'}
          filterKey="category"
          items={[['All', 'All'], ...Object.entries(ItemCategory)]}
        />

        <SortFilter currentSort={filters?.sort} />
      </div>

      {isLoading && <Loading className="mx-auto text-purple-700 opacity-50" />}

      {data && <ItemList items={data} />}
      {data?.length === 0 && (
        <p className="text-center my-4 opacity-75">No items found</p>
      )}
    </div>
  );
}

enum SortOptions {
  Votes = 'votes',
  Created = 'created',
}
function SortFilter({ currentSort }: { currentSort?: string }) {
  let title = 'Sort';

  const isDescending = currentSort && currentSort[0] === '-';
  const normalizedSort =
    currentSort && isDescending ? currentSort?.slice(1) : currentSort;

  const items: [string, string][] = Object.entries(SortOptions).map(
    ([key, value]) => {
      const isCurrentSort = normalizedSort === value;
      if (isCurrentSort) {
        title = `Sort: ${key} (${isDescending ? 'desc' : 'asc'})`;
      }
      return [key, isCurrentSort ? value : `-${value}`];
    }
  );

  return <Filter title={title} filterKey="sort" items={items} />;
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
