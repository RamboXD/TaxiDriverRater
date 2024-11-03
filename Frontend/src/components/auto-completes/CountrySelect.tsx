import { Select, SelectProps } from '@mantine/core';

export const countries = ['Spain', 'Germany', 'Belgium'];

type CountryFieldProps = Omit<SelectProps, 'data'>;

const CountrySelect = ({ ...autocompleteProps }: CountryFieldProps) => {
  return <Select data={countries} {...autocompleteProps} />;
};

export default CountrySelect;
