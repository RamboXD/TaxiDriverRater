import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { BranchInvoice } from 'types/generated';

export default function useInvoiceBranch({
  transactionId,
  branchId,
  enabled,
}: {
  transactionId: string | undefined;
  branchId: string | undefined;
  enabled: boolean;
}): UseQueryResult<
  AxiosResponse<BranchInvoice>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const getInvoiceBranchProfile = () => {
    return client.get(
      `invoice/branch/?transaction_id=${transactionId}&branch_id=${branchId}`,
    );
  };

  return useQuery(
    ['invoiceBranchProfile', transactionId, enabled],
    getInvoiceBranchProfile,
    {
      enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
}
