import React from 'react';

import { Checkbox } from 'semantic-ui-react';
import { getRowId } from './utils';


export const RadioCell = ({
    row: { values },
    column: { id },
    columns,
    tableDispatch
  }) => {

    const onChange = (e, d) => {
      tableDispatch({
        type: 'UPDATE_FIELD',
        rowId: getRowId(columns, values.id),
        col: id,
        value: d.checked
      })
    }

    return <Checkbox
      onChange={onChange}
    />
  }
