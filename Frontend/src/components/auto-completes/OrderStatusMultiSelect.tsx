import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { Order } from 'types/generated';

const options: { value: Order['status']; label: string }[] = [
  {
    value: 'approved',
    label: 'Approved',
  },
  {
    value: 'finished',
    label: 'Finished',
  },
  {
    value: 'canceled',
    label: 'Canceled',
  },
  {
    value: 'created',
    label: 'Created',
  },
  {
    value: 'declined',
    label: 'Declined',
  },
  {
    value: 'packaging',
    label: 'Packaging',
  },
  {
    value: 'delivery',
    label: 'Delivery',
  },
];

interface OrderStatusMultiSelectProps extends Omit<MultiSelectProps, 'data'> {
  isOwner?: boolean;
  statuses?: Partial<Order['status'][]>;
}

const OrderStatusMultiSelect = ({
  isOwner,
  statuses,
  ...multiSelectProps
}: OrderStatusMultiSelectProps): JSX.Element => {
  if (!isOwner) {
    options.push({
      value: 'created',
      label: 'Created',
    });
  }

  if (statuses) {
    options.filter((option) => statuses.includes(option.value));
  }

  return <MultiSelect data={options} {...multiSelectProps} />;
};

export default OrderStatusMultiSelect;
