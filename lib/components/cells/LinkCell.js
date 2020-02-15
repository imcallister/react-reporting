import React from 'react';

import { Button } from 'semantic-ui-react';


export const LinkCell = ({cell, column}) => {
  return (

  <Button
    basic
    color='green'
    className="tertiary"
    onClick={() => {column.onClickFunc(cell.value.link);}}
  >
      {cell.value.display}
  </Button>
)}
