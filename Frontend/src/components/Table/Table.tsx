import {
  Table,
  ScrollArea,
  ScrollAreaProps,
  Avatar,
  Stack,
  Skeleton,
} from '@mantine/core';
import { IconFileAlert } from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import { Column, useSortBy, useTable } from 'react-table';

import TableHeader from './components/TableHeader.tsx';

export interface TableProps extends ScrollAreaProps {
  data: any[];
  columns: Column<any>[];
  isLoading?: boolean;
  isError?: boolean;
  onRowClick?: (row: any) => void;
  EmptyState: JSX.Element;
}

const TableSelection = ({
  columns,
  data,
  isLoading,
  isError,
  EmptyState: PropsEmptyState,
  ...props
}: TableProps): JSX.Element => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
  );

  return (
    <>
      <ScrollArea {...props}>
        <Table verticalSpacing='sm' {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <TableHeader
                  key={headerGroup.id}
                  columns={headerGroup.headers}
                />
              </tr>
            ))}
          </thead>
          <tbody>
            {!isLoading &&
              rows.map((row: any) => {
                prepareRow(row);
                return (
                  <tr
                    key={row.index}
                    {...row.getRowProps()}
                    onClick={() => {
                      if (props.onRowClick) {
                        props.onRowClick(row.original); // Call the onRowClick with the original row data
                      }
                    }}
                    style={{ cursor: 'pointer' }} // Change the cursor to indicate it's clickable
                  >
                    {row.cells.map((cell: any) => {
                      return (
                        <td key={cell.value} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </Table>

        {isLoading && (
          <Stack py='md' sx={{ width: '100%', height: '100%' }}>
            {[...Array(10)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={`skeleton-${i}`} radius='md' visible height={26} />
            ))}
          </Stack>
        )}

        {isError && (
          <EmptyState
            mt='xl'
            title='Error'
            description='Something went wrong while fetching data.'
            Icon={
              <Avatar radius='100%' size='xl' variant='light' color='red'>
                <IconFileAlert size={25} />
              </Avatar>
            }
          />
        )}

        {!isLoading && data.length === 0 && (
          <>
            {PropsEmptyState || (
              <EmptyState
                mt='xl'
                title='Table is empty'
                description='There is no data to display.'
              />
            )}
          </>
        )}
      </ScrollArea>
    </>
  );
};

export default TableSelection;
