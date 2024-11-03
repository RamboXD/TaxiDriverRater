import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { PaginatedProductAutoCompleteList } from 'types/generated';

export default function useAutoCompleteProducts({
  search,
  exists,
}: {
  search?: string;
  exists?: boolean;
}): UseQueryResult<
  AxiosResponse<PaginatedProductAutoCompleteList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchProducts = () => {
    const params: UrlParams = { limit: '100', offset: '0' };

    if (search) {
      params.search = search;
    }
    if (exists !== undefined) {
      params.exists = exists ? 'True' : 'False';
    }

    return client.get(`products/auto_complete/`, {
      params,
    });
  };

  return useQuery(['productsAutocomplete', search, exists], fetchProducts, {
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
