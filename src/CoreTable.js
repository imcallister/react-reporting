import React from 'react'
import { useTable, useFilters, useGroupBy, useSortBy, useExpanded, usePagination } from 'react-table';

import { filters } from './components/filters';
import { PaginationControl } from './components/PaginationControl';
import { BaseColumnFilter } from './components/ColumnFilter';


export const CoreTable = ({ columns, data, groupBy=null, tableDispatch, paginate }) => {
    const filterTypes = React.useMemo(() => (filters), []);
    const defaultColumn = React.useMemo(() => ({Filter: BaseColumnFilter,}), []);
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      page,
      prepareRow,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize }
    } = useTable(
        {
          columns: columns.filter(c => c.hidden !== true),
          initialState: groupBy ? {groupBy: groupBy, pageIndex: 0} : {pageIndex: 0},
          data,
          defaultColumn,
          filterTypes,
          tableDispatch
        },
        useFilters,
        useGroupBy,
        useSortBy,
        useExpanded,
        usePagination
    )

    const renderGroupedCell = (c, subRowCnt, subRowLength, isSpanningCol) => {
      if (isSpanningCol) {
        if (subRowCnt === 0) {
          return (
            <td {...c.getCellProps()} style={c.column.style} rowSpan={subRowLength}>
                {c.render('Cell')}
            </td>
        )} else {
          return null;
        }
      } else {
        return (
          <td {...c.getCellProps()} style={c.column.style}>
              {c.render('Cell')}
          </td>
      )}
    }

    const showRow = (row) => {
      if (row.isGrouped) {
        return (row.subRows.filter(s => s.original.show).length > 0)
      } else {
        return row.original.show;
      }
    }

    const renderCell = (c) => {
      return (
        <td {...c.getCellProps()} style={c.column.style}>
            {c.render('Cell')}
        </td>
      )
    }

    const renderGroupedRow = (row, spanningColumns) => {
      prepareRow(row);
      return (
        row.subRows.map((s, j) => {
          prepareRow(s);
          return (
            <tr {...s.getRowProps()}>
              {s.cells.map(((c) => renderGroupedCell(c, j, row.subRows.length, spanningColumns.includes(c.column.id))))}
            </tr>
          )
        })
      )
    }

    const renderRow = (row, i) => {
      if (row.isGrouped) {
        return renderGroupedRow(
          row,
          columns.filter(c => c.spanning).map(c => c.accessor)
        )
      } else {
        return (
          prepareRow(row) || (
            <tr {...row.getRowProps()}>
                {row.cells.map(renderCell)}
            </tr>
          )
        )
      }
    }

    return (
      <div style={{"overflow":"visible", 'minHeight': 500}}>
        <table {...getTableProps()} className="ui table fixed" style={{margin: 0}}>
          <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => {
                        return (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{width: column.width}}>
                                {column.render('Header')}
                                <span>
                                  {column.isSorted
                                    ? column.isSortedDesc
                                      ? ' 🔽'
                                      : ' 🔼'
                                    : ''}
                                </span>
                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                            </th>
                        )
                    })}
                </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              paginate
              ?
              page.map(renderRow)
              :
              rows.filter(showRow).map(renderRow)
            }

          </tbody>
        </table>
        {
          paginate
          ?
          <PaginationControl
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            gotoPage={gotoPage}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageOptions={pageOptions}
            setPageSize={setPageSize}
          />
          :
          null
        }

      </div>
  )
}

