import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Order } from 'types/generated';

export default function useUpdateOrder(): UseMutationResult<
  AxiosResponse<Order>,
  AxiosError<{ message: string }>,
  { confirm: boolean; order_id: string }
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateOrder = ({
    confirm,
    order_id,
  }: {
    confirm: boolean;
    order_id: string;
  }) => {
    return client.patch(`order/${order_id}`, null, {
      params: { confirm },
    });
  };

  return useMutation(updateOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
}
