import { useQuery, useMutation, queryCache } from 'react-query';
import { Item } from 'services/data-types';

export function useItems() {
  return useQuery<Item[], unknown, string>('items', () =>
    fetch('/api/items').then((res) => res.json())
  );
}

export function useAddItem() {
  const addItem = (body: Pick<Item, 'title' | 'description'>) => {
    return fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

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

export function useAddVote(itemId: string) {
  return useMutation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e_: unknown) => fetch(`/api/vote/${itemId}`, { method: 'POST' }),
    {
      onSuccess() {
        queryCache.invalidateQueries('items');
      },
    }
  );
}

export function useRemoveVote(itemId: string) {
  return useMutation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e_: unknown) => fetch(`/api/vote/${itemId}`, { method: 'DELETE' }),
    {
      onSuccess() {
        queryCache.invalidateQueries('items');
      },
    }
  );
}
