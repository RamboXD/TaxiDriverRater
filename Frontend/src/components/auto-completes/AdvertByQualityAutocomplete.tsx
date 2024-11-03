import { useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Loader,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import useAdverts from 'hooks/advert/useAdverts';
import { DynamicAutoCompleteValue } from 'types';

interface AdvertByQualityAutocompleteProps
  extends Omit<AutocompleteProps, 'data' | 'value' | 'onChange'> {
  qualityId?: string;
  requiredVolume?: number;
  value: DynamicAutoCompleteValue;
  onChange: (item: DynamicAutoCompleteValue | null) => void;
}

const AdvertByQualityAutocomplete = ({
  qualityId,
  requiredVolume,
  icon,
  disabled,
  error,
  value,
  onChange,
  ...autocompleteProps
}: AdvertByQualityAutocompleteProps) => {
  const [options, setOptions] = useState<AutocompleteItem[]>([]);
  const [search, setSearch] = useState(value.label);
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, isLoading, isSuccess, isError } = useAdverts({
    search: debouncedSearch,
    quality: qualityId,
    enabled: !!qualityId,
  });

  const handleSearchChange = (query: string): void => {
    setSearch(query);
    onChange(null);
  };
  const handleItemSubmit = (item: DynamicAutoCompleteValue): void => {
    setSearch('');
    onChange(item);
  };
  const handleClearSearch = (): void => {
    setSearch('');
  };

  useEffect(() => {
    if (isSuccess && data?.data) {
      setOptions(
        data.data.results.map((advert) => ({
          value: advert.id,
          // TODO: add farm address after we add map
          label: `${advert.product.name} - ${advert.sort.name} - ${advert.qualitiesOfAdvert[0].name} - ${requiredVolume}/${advert.product.totalAdvertsVolume}kgs, farm - ${advert.grossMarket.name}`,
        })),
      );
    }
  }, [isSuccess, data?.data]);

  return (
    <Autocomplete
      data={options}
      value={value.label || search}
      onChange={handleSearchChange}
      onItemSubmit={handleItemSubmit}
      onDropdownClose={handleClearSearch}
      filter={(_value, _item) =>
        _item.label.toLowerCase().includes(_value.toLowerCase().trim())
      }
      icon={isLoading ? <Loader size='sm' /> : icon}
      disabled={isError || disabled}
      error={isError ? 'Something went wrong while fetching' : error}
      nothingFound={
        isLoading
          ? 'Adverts are loading'
          : `Adverts with name "${search}" are not found`
      }
      {...autocompleteProps}
    />
  );
};

export default AdvertByQualityAutocomplete;
