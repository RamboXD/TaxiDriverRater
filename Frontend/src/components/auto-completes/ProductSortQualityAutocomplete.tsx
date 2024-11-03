import { useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Loader,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import useAutoCompleteQualities from 'hooks/quality/useAutoCompleteQualities.ts';
import { DynamicAutoCompleteValue } from 'types';

interface ProductSortQualityAutocompleteProps
  extends Omit<AutocompleteProps, 'data' | 'value' | 'onChange'> {
  sortId?: string;
  value: DynamicAutoCompleteValue;
  onChange: (item: DynamicAutoCompleteValue | null) => void;
}

const ProductSortQualityAutocomplete = ({
  sortId,
  icon,
  disabled,
  error,
  value,
  onChange,
  ...autocompleteProps
}: ProductSortQualityAutocompleteProps) => {
  const [options, setOptions] = useState<AutocompleteItem[]>([]);
  const [search, setSearch] = useState(value.label);
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, isLoading, isSuccess, isError } = useAutoCompleteQualities({
    sortId,
    exists: false,
    search: debouncedSearch,
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
        data.data.results!.map((quality) => ({
          value: String(quality.id),
          label: quality.name,
        })),
      );
    }
  }, [isSuccess, data?.data]);

  useEffect(() => {
    if (!sortId) {
      onChange(null);
      setSearch('');
      setOptions([]);
    }
  }, [sortId]);

  return (
    <Autocomplete
      data={options}
      value={value.label || search}
      onChange={handleSearchChange}
      onItemSubmit={handleItemSubmit}
      onDropdownClose={handleClearSearch}
      maxDropdownHeight={200}
      limit={1000}
      filter={(_value, _item) =>
        _item.label.toLowerCase().includes(_value.toLowerCase().trim())
      }
      icon={isLoading ? <Loader size='sm' /> : icon}
      disabled={isError || disabled}
      nothingFound={
        !sortId ? 'Product sort is not selected' : 'No available qualities'
      }
      error={isError ? 'Something went wrong while fetching' : error}
      {...autocompleteProps}
    />
  );
};

export default ProductSortQualityAutocomplete;
