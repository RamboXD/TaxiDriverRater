import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { CompanyInvoice } from 'types/generated/models/CompanyInvoice';

export default function useInvoiceCompany({
  transactionId,
  enabled,
}: {
  transactionId: string | undefined;
  enabled: boolean;
}): UseQueryResult<
  AxiosResponse<CompanyInvoice>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const getInvoiceCompanyProfile = () => {
    return client.get(`invoice/company/?transaction_id=${transactionId}`);
  };

  return useQuery(
    ['invoiceCompanyProfile', transactionId, enabled],
    getInvoiceCompanyProfile,
    {
      enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
}