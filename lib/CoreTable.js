import React from 'react'
import { useTable, useFilters, useGroupBy, useExpanded } from 'react-table';

import { filters } from './components/filters';
import { BaseColumnFilter } from './components/ColumnFilter';


const MAX_ROW_DISPLAY = 200;


export const CoreTable = ({ columns, data, groupBy=null, tableDispatch }) => {
    const filterTypes = React.useMemo(() => (filters), []);
    const defaultColumn = React.useMemo(() => ({Filter: BaseColumnFilter,}), []);
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow
    } = useTable(
        {
          columns: columns.filter(c => c.hidden !== true),
          initialState: groupBy ? {groupBy: groupBy} : {},
          data,
          defaultColumn,
          filterTypes,
          tableDispatch
        },
        useFilters,
        useGroupBy,
        useExpanded
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

    const firstPageRows = rows.filter(showRow).slice(0, MAX_ROW_DISPLAY)

    return (
      <div style={{"overflow":"visible", 'minHeight': 500}}>
        <table {...getTableProps()} className="ui table fixed" style={{margin: 0}}>
          <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => {
                        return (
                            <th {...column.getHeaderProps()} style={{width: column.width}}>
                                {column.render('Header')}
                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                            </th>
                        )
                    })}
                </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {firstPageRows.map(renderRow)}
          </tbody>
        </table>
      </div>
  )
}

