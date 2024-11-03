import { useEffect, useState } from 'react';

import { Select, SelectProps } from '@mantine/core';
import { useAuth } from 'contexts/AuthContext';
import { DynamicAutoCompleteValue } from 'types';
// import { BrokerOutput } from 'types/generated';

interface BrokerProductProps
  extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value: string;
  onChange: (value: string | null) => void;
}

const BrokerProductSelect = ({
  value,
  onChange,
  ...autocompleteProps
}: BrokerProductProps) => {
  const { brokerProfile }: { brokerProfile: any } = useAuth();

  const [options, setOptions] = useState<DynamicAutoCompleteValue[]>([]);

  useEffect(() => {
    if (brokerProfile) {
      setOptions(
        brokerProfile.products.map((product: any) => ({
          value: product.id,
          label: product.name,
        })),
      );
    }
  }, [brokerProfile]);

  return (
    <Select
      value={value}
      onChange={onChange}
      data={options}
      {...autocompleteProps}
    />
  );
};

export default BrokerProductSelect;
