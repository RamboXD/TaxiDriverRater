import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';

export default function useInvoiceOrder({
  orderId,
  enabled,
}: {
  orderId: string | undefined;
  enabled: boolean;
}): UseQueryResult<AxiosResponse<any>, AxiosError<{ message: string }>> {
  const client = useClient();

  const getInvoiceOrderProfile = () => {
    return client.get(`invoice/order/?order_id=${orderId}`);
  };

  return useQuery(
    ['invoiceOrderProfile', orderId, enabled],
    getInvoiceOrderProfile,
    {
      enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
}
