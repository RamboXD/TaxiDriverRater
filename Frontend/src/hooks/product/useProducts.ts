import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { PaginatedProductList } from 'types/generated';

export default function useProducts(): UseQueryResult<
  AxiosResponse<PaginatedProductList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchProducts = () => {
    const params = { exists: true };

    return client.get(`products/`, { params });
  };

  return useQuery(['products'], fetchProducts);
}
