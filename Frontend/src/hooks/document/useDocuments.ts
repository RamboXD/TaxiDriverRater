import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';

export default function useDocuments(): UseQueryResult<
  AxiosResponse<any[]>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchDocuments = () => client.get(`documents/`);

  return useQuery(['documents'], fetchDocuments);
}
