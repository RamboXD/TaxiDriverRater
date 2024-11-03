import { useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Loader,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import useAutoCompleteProducts from 'hooks/product/useAutoCompleteProducts';
import { DynamicAutoCompleteValue } from 'types';

interface ProductAutocompleteProps
  extends Omit<AutocompleteProps, 'data' | 'value' | 'onChange'> {
  value: DynamicAutoCompleteValue;
  onChange: (item: DynamicAutoCompleteValue | null) => void;
}

const ProductAutocomplete = ({
  icon,
  disabled,
  error,
  value,
  onChange,
  ...autocompleteProps
}: ProductAutocompleteProps) => {
  const [options, setOptions] = useState<AutocompleteItem[]>([]);
  const [search, setSearch] = useState(value.label);
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, isLoading, isSuccess, isError } = useAutoCompleteProducts({
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
        data.data.results.map((product) => ({
          value: product.id,
          label: product.name,
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
      maxDropdownHeight={200}
      limit={1000}
      filter={(_value, _item) =>
        _item.label.toLowerCase().includes(_value.toLowerCase().trim())
      }
      icon={isLoading ? <Loader size='sm' /> : icon}
      disabled={isError || disabled}
      nothingFound={isSuccess ? 'No available products' : null}
      error={isError ? 'Something went wrong while fetching' : error}
      {...autocompleteProps}
    />
  );
};

export default ProductAutocomplete;
