import { AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { PaginatedGrossMarketAutoCompleteList } from 'types/generated';

export default function useAutoCompleteFarm({
  search,
}: {
  search?: string;
}): UseQueryResult<AxiosResponse<PaginatedGrossMarketAutoCompleteList>> {
  const client = useClient();

  const fetchAutocompleteFarms = (): Promise<
    AxiosResponse<PaginatedGrossMarketAutoCompleteList>
  > => {
    const params: UrlParams = { limit: '100', offset: '0' };

    if (search) {
      params.search = search;
    }

    return client.get(`farms/auto_complete/`, { params });
  };

  return useQuery(['farmsAutocomplete', search], fetchAutocompleteFarms);
}
