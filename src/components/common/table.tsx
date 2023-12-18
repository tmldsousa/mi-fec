import { useEffect, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useDebouncedState } from '../../hooks/useDebouncedState';
import styles from './table.module.css';
import { Input } from './input';

type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

export const Table = <T,>({ data, columns }: TableProps<T>) => {
  const [filter, setFilter] = useState('');

  const tableInstance = useReactTable<T>({
    data,
    columns,
    state: {
      globalFilter: filter,
    },
    getCoreRowModel: getCoreRowModel<T>(),
    getFilteredRowModel: getFilteredRowModel<T>(),
    getSortedRowModel: getSortedRowModel<T>(),
  });

  return (
    <div className={styles.root}>
      <SearchInput onChange={setFilter} />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {tableInstance.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sortDirection = header.column.getIsSorted();
                    return (
                      <th colSpan={header.colSpan} key={header.id} onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {/* Sorting indicator */}
                        {sortDirection === 'asc' ? ' 🔼' : sortDirection === 'desc' ? ' 🔽' : null}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {tableInstance.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SearchInput = ({ onChange }: { onChange: (value: string) => void }) => {
  const [value, setValue] = useState('');
  const [debouncedValue] = useDebouncedState(value);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return <Input onChange={(e) => setValue(e.target.value || '')} placeholder="Search..." />;
};