import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { PaginatedAdvertList } from 'types/generated';

  export default function useSorts(
    product_id: string | undefined
  ): UseQueryResult<
  AxiosResponse<PaginatedAdvertList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchSorts = () => {
    const params = { product_id: product_id };

    return client.get(`adverts/`, { params });
  };

  return useQuery(['sorts'], fetchSorts);
}
