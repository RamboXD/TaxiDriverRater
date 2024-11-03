import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { UrlParams } from 'types';
import { Order, OrderItem } from 'types/generated';

export default function useOrder({
  order_id,
}: {
  order_id: string | undefined;
}): UseQueryResult<
  AxiosResponse<{ data: { order: Order; items: OrderItem[] } }>,
  AxiosError<{ detail: string }>
> {

  const client = useClient();

  const fetchOrder = () => {
    const params: UrlParams = {};

    return client.get(`order/${order_id}`, { params });
  };

  return useQuery(['orders'], fetchOrder, {
    enabled: !!order_id,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
