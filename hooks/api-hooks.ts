import { useQuery, useMutation, queryCache } from 'react-query';

export function useItems() {
  return useQuery('items', () => fetch('/api/items').then((res) => res.json()));
}

const addItem = (body) => {
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
  return useMutation(() => fetch('/api/items', { method: 'DELETE' }), {
    onSuccess() {
      queryCache.invalidateQueries('items');
    },
  });
}
