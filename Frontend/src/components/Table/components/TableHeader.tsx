import { Group, useMantineTheme } from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react';

const TableHeader = ({ columns }: { columns: any }): JSX.Element => {
  const theme = useMantineTheme();

  const getIconByPayload = ({
    isSorted,
    isSortedDesc,
  }: {
    isSorted: boolean;
    isSortedDesc: boolean;
  }): JSX.Element => {
    if (isSorted) {
      if (isSortedDesc) {
        return <IconChevronDown size={theme.fontSizes.sm} />;
      }
      return <IconChevronUp size={theme.fontSizes.sm} />;
    }
    return <IconSelector size={theme.fontSizes.sm} />;
  };

  return columns.map((column: any) => {
    return (
      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
        <Group noWrap>
          {column.render('Header')}
          {column.canSort &&
            getIconByPayload({
              isSorted: column.isSorted,
              isSortedDesc: column.isSortedDesc,
            })}
        </Group>
      </th>
    );
  });
};

export default TableHeader;
