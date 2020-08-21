import { useQuery, useMutation, queryCache, QueryConfig } from 'react-query';
import { Item, FormItem } from 'services/data-types';

const defaultQueryFn = (requestPath: string) =>
  fetch(requestPath).then((res) => res.json());

// queries

export function useItems<Result = Item[]>(options?: QueryConfig<Result>) {
  return useQuery<Result, string>('/api/items', defaultQueryFn, options);
}

export function useMeData() {
  return useQuery('/api/me', defaultQueryFn);
}

// mutations

export function useAddItem() {
  const addItem = (body: FormItem) => {
    return fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  return useMutation(addItem, {
    onSuccess() {
      queryCache.invalidateQueries('/api/items');
    },
  });
}

export function useAddVote(itemId: string) {
  return useMutation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e_: unknown) => fetch(`/api/vote/${itemId}`, { method: 'POST' }),
    {
      onSuccess() {
        queryCache.invalidateQueries('/api/items');
        queryCache.invalidateQueries('/api/me');
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
        queryCache.invalidateQueries('/api/items');
        queryCache.invalidateQueries('/api/me');
      },
    }
  );
}
