import React from 'react';

import { Input } from 'semantic-ui-react'
import { getRowId } from './utils';


export const InputCell = (
  {
    cell,
    row: {values},
    column,
    columns,
    tableDispatch
  }) => {

    const handleChange = (e) => {
        tableDispatch({
          type: 'UPDATE_FIELD',
          rowId: getRowId(columns, values.id),
          col: column.id,
          value: e.target.value
        })
    }

    return (
        <Input
            onChange={handleChange}
            placeholder={cell.value}
        />
    )
}
