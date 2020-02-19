import React from 'react';

import SemanticDatepicker from 'react-semantic-ui-datepickers';
import moment from 'moment';
import { getRowId } from './utils';

import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

export const DatePickerCell = ({
    row: { values },
    column: { id },
    columns,
    tableDispatch
  }) => {

    const onChange = (d) => {
      tableDispatch({
        type: 'UPDATE_FIELD',
        rowId: getRowId(columns, values.id),
        col: id,
        value: moment(d).format('YYYY-MM-DD')
      })
    }

    return <SemanticDatepicker onDateChange={onChange} />
}

