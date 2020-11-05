import { useQuery, useMutation, queryCache, QueryConfig } from 'react-query';
import queryString from 'query-string';
import { Item, FormItem, ItemQueryFilters, SessionUser } from 'lib/data-types';
import { MeApiResponse } from 'pages/api/me';
import { Session, useSession } from 'next-auth/client';

const defaultQueryFn = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => {
    if (res.status >= 300) {
      throw res;
    }
    return res.json();
  });

// queries

export function useItems<Result = Item[]>(
  filters?: ItemQueryFilters,
  options?: QueryConfig<Result>
) {
  const query = filters ? `?${queryString.stringify(filters)}` : '';
  return useQuery<Result, string>(
    `/api/items${query}`,
    defaultQueryFn,
    options
  );
}

export function useItemById(itemId?: string) {
  return useQuery<Item>(`/api/items/${itemId}`, defaultQueryFn, {
    enabled: itemId != null,
  });
}

export function useMeData() {
  return useQuery<MeApiResponse>('/api/me', defaultQueryFn);
}

// mutations

export function useAddItem() {
  const addItem = (body: FormItem) => {
    return defaultQueryFn('/api/items', {
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

export function useEditItem(itemId?: string) {
  const editItem = (body: FormItem) => {
    return defaultQueryFn(`/api/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  };

  return useMutation(editItem, {
    onSuccess() {
      queryCache.invalidateQueries(`/api/items/${itemId}`);
      queryCache.invalidateQueries('/api/items');
      queryCache.invalidateQueries('/api/me');
    },
  });
}

export function useAddVote(itemId: string) {
  return useMutation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e_: unknown) => fetch(`/api/vote/${itemId}`, { method: 'POST' }),
    {
      onSuccess() {
        queryCache.invalidateQueries(`/api/items/${itemId}`);
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
        queryCache.invalidateQueries(`/api/items/${itemId}`);
        queryCache.invalidateQueries('/api/items');
        queryCache.invalidateQueries('/api/me');
      },
    }
  );
}

export function useSessionUser(): [
  SessionUser | undefined,
  Session | null | undefined,
  boolean
] {
  const [session, isLoadingSession] = useSession();

  return [session?.user as SessionUser | undefined, session, isLoadingSession];
}
