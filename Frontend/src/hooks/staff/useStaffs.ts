import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
// import { PaginatedStaffList } from 'types/generated';

import { UrlParams } from '../../types';

export default function useStaffs({
  search,
}: {
  search?: string;
}): UseQueryResult<AxiosResponse<any>, AxiosError<{ message: string }>> {
  const client = useClient();

  const getStaffs = () => {
    const params: UrlParams = { limit: '20', offset: '0' };

    if (search) {
      params.search = search;
    }

    return client.get(`staffs/`, { params });
  };

  return useQuery(['staffs', search], getStaffs, {
    getNextPageParam: (page) => {
      return page.data.next ? page.data.next : undefined;
    },
    getPreviousPageParam: (page) => {
      return page.data.previous ? page.data.previous : undefined;
    },
  });
}
