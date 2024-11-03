import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { OrderItemCreate } from 'types/generated';

export default function useCreateOrderItems(): UseMutationResult<
  AxiosResponse<unknown>,
  AxiosError<{ message: string }>,
  OrderItemCreate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateOrder = (payload: OrderItemCreate) => {
    return client.post(`order/item/`, payload);
  };

  return useMutation(updateOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
}
