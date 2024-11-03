import { useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Loader,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import useAutoCompleteSorts from 'hooks/sort/useAutoCompleteSorts';
import { DynamicAutoCompleteValue } from 'types';

interface ProductSortSelectProps
  extends Omit<AutocompleteProps, 'data' | 'value' | 'onChange'> {
  productId?: string;
  value: DynamicAutoCompleteValue;
  onChange: (item: DynamicAutoCompleteValue | null) => void;
}

const ProductSortAutocomplete = ({
  productId,
  icon,
  disabled,
  error,
  value,
  onChange,
  ...autocompleteProps
}: ProductSortSelectProps) => {
  const [options, setOptions] = useState<AutocompleteItem[]>([]);
  const [search, setSearch] = useState(value.label);
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, isLoading, isSuccess, isError } = useAutoCompleteSorts({
    productId,
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
        data.data.results.map((sort) => ({
          value: sort.id,
          label: sort.name,
        })),
      );
    }
  }, [isSuccess, data?.data]);

  useEffect(() => {
    if (!productId) {
      onChange(null);
      setSearch('');
      setOptions([]);
    }
  }, [productId]);

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
        !productId ? 'Product is not selected' : 'No available sorts'
      }
      error={isError ? 'Something went wrong while fetching' : error}
      {...autocompleteProps}
    />
  );
};

export default ProductSortAutocomplete;
