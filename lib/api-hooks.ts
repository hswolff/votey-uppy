import {
  useQuery,
  useMutation,
  UseQueryOptions,
  QueryFunctionContext,
  useQueryClient,
  QueryClient,
} from 'react-query';
import queryString from 'query-string';
import { Item, FormItem, ItemQueryFilters, SessionUser } from 'lib/data-types';
import { MeApiResponse } from 'pages/api/me';
import { Session, useSession } from 'next-auth/client';

export const queryClient = new QueryClient();

const fetchWrapper = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => {
    if (res.status >= 300) {
      throw res;
    }
    return res.json();
  });

const defaultQueryFn = (context: QueryFunctionContext) =>
  fetchWrapper(context.queryKey as string);

// queries

export function useItems<Result = Item[]>(
  filters?: ItemQueryFilters,
  options?: UseQueryOptions<Result, string, Result>
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
    return fetchWrapper('/api/items', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  const queryClient = useQueryClient();

  return useMutation(addItem, {
    onSuccess() {
      queryClient.invalidateQueries('/api/items');
    },
  });
}

export function useEditItem(itemId?: string) {
  const editItem = (body: FormItem) => {
    return fetchWrapper(`/api/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  };

  const queryClient = useQueryClient();

  return useMutation(editItem, {
    onSuccess() {
      queryClient.invalidateQueries(`/api/items/${itemId}`);
      queryClient.invalidateQueries('/api/items');
      queryClient.invalidateQueries('/api/me');
    },
  });
}

export function useDeleteItem(itemId?: string) {
  const deleteItem = () => {
    return fetchWrapper(`/api/items/${itemId}`, {
      method: 'DELETE',
    });
  };

  const queryClient = useQueryClient();

  return useMutation(deleteItem, {
    onSuccess() {
      queryClient.invalidateQueries(`/api/items/${itemId}`);
      queryClient.invalidateQueries('/api/items');
      queryClient.invalidateQueries('/api/me');
    },
  });
}

export function useAddVote(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e_: unknown) => fetch(`/api/vote/${itemId}`, { method: 'POST' }),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/api/items/${itemId}`);
        queryClient.invalidateQueries('/api/items');
        queryClient.invalidateQueries('/api/me');
      },
    }
  );
}

export function useRemoveVote(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e_: unknown) => fetch(`/api/vote/${itemId}`, { method: 'DELETE' }),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/api/items/${itemId}`);
        queryClient.invalidateQueries('/api/items');
        queryClient.invalidateQueries('/api/me');
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
