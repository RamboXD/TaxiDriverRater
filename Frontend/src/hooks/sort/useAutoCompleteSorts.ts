import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { PaginatedSortAutoCompleteList } from 'types/generated';

export default function useAutoCompleteSorts({
  productId,
  search,
  exists,
}: {
  productId?: string;
  search?: string;
  exists?: boolean;
}): UseQueryResult<
  AxiosResponse<PaginatedSortAutoCompleteList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchSorts = () => {
    const params: UrlParams = { limit: '100', offset: '0' };

    if (productId) {
      params.product_id = productId;
    }
    if (search) {
      params.search = search;
    }
    if (exists !== undefined) {
      params.exists = exists ? 'True' : 'False';
    }

    return client.get(`sorts/`, {
      params: {
        ...params,
        isTrue: true,
      },
    });
  };

  return useQuery(['productSorts', productId, search, exists], fetchSorts, {
    enabled: !!productId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
