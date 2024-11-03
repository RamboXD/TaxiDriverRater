import { Select, SelectProps } from '@mantine/core';

const statuses = [
  'created',
  'confirmed',
  'paid',
  'collected',
  'checked',
  'delivered',
  'finished',
  'canceled',
];

type OrderItemStatusFieldProps = Omit<SelectProps, 'data'>;

const OrderItemStatusSelect = ({
  ...autocompleteProps
}: OrderItemStatusFieldProps) => {
  return <Select data={statuses} {...autocompleteProps} />;
};

export default OrderItemStatusSelect;
