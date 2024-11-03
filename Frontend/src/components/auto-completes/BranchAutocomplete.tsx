import { useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Loader,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import useAutoCompleteBranch from 'hooks/branch/useAutoCompleteBranch';
import { DynamicAutoCompleteValue } from 'types';

interface BranchAutocompleteProps
  extends Omit<AutocompleteProps, 'data' | 'value' | 'onChange'> {
  value: DynamicAutoCompleteValue;
  onChange: (item: DynamicAutoCompleteValue | null) => void;
}

const BranchAutocomplete = ({
  icon,
  disabled,
  error,
  value,
  onChange,
  ...autocompleteProps
}: BranchAutocompleteProps) => {
  const [options, setOptions] = useState<AutocompleteItem[]>([]);
  const [search, setSearch] = useState(value.label);
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, isLoading, isSuccess, isError } = useAutoCompleteBranch({
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
        data.data.results.map((branch) => ({
          value: branch.id,
          label: branch.name,
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
          ? 'Branches are loading'
          : `Branches with name "${search}" are not found`
      }
      {...autocompleteProps}
    />
  );
};

export default BranchAutocomplete;
