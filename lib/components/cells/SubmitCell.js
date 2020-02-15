import React from 'react';

import { Button } from 'semantic-ui-react';

import {updateObject} from '../../utils';
import { getRowId } from './utils';


export const SubmitCell = (
  {
    column,
    columns,
    row: { values },
    tableDispatch
   }) => {

    const eventListener = (response) => {
      if (response.success === true) {
          tableDispatch({
              type: 'ROW_UPDATED',
              objId: response['object_id']
          })
      } else {
          console.log('Error in TableUpdate Event Listener', response);
      }
    };

    const onSubmit = async () => {
      const rowId =  await getRowId(columns, values.id);
      tableDispatch({
        type: 'PUT_OBJECT',
        objId: rowId,
        actionType: column.action,
        listener: eventListener,
        editedObject: updateObject(values, {id: rowId})
      })
    }

    return (
      <Button className="tertiary" onClick={onSubmit}>
          {column.Header}
      </Button>
    )}