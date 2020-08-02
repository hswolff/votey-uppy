import { useQuery, useMutation, queryCache } from 'react-query';
import Item from 'data/data-types';

export function useItems() {
  return useQuery<Item[], unknown, string>('items', () =>
    fetch('/api/items').then((res) => res.json())
  );
}

const addItem = (body: Partial<Item>) => {
  return fetch('/api/items', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export function useAddItem() {
  return useMutation(addItem, {
    onSuccess() {
      queryCache.invalidateQueries('items');
    },
  });
}

export function useClearItems() {
  return useMutation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e_: unknown) => fetch('/api/items', { method: 'DELETE' }),
    {
      onSuccess() {
        queryCache.invalidateQueries('items');
      },
    }
  );
}
