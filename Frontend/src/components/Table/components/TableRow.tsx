import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export interface TableProps {
  selection: string[];
  item: Record<string, any>;
  columns: string[];
  toggleRow: (id: string) => void;
}

const TableRow = ({
  selection,
  item,
  columns,
  toggleRow,
}: TableProps): JSX.Element => {
  const { classes, cx } = useStyles();
  const selected = selection.includes(item.id);

  return (
    <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
      <td>
        <Checkbox
          checked={selected}
          onChange={() => toggleRow(item.id)}
          transitionDuration={0}
        />
      </td>
      {columns.map((column: any) => (
        <td key={`${item.id}-${column}`}>{item[column.toLowerCase()]}</td>
      ))}
    </tr>
  );
};

export default TableRow;
