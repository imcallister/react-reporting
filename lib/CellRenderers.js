import React from 'react';

import { Icon } from 'semantic-ui-react';
import { formatter } from './Formatters';
import { RadioCell } from './components/cells/RadioCell';
import { SearchCell } from './components/cells/SearchCell';
import { LinkCell } from './components/cells/LinkCell';
import { SubmitCell } from './components/cells/SubmitCell';
import { InputCell } from './components/cells/InputCell';
import { DatePickerCell } from './components/cells/DatePickerCell';


export const BaseCellRenderer = ({linkClick=null, staticData }) => (
  (c) => {
    let baseCell = {
        Header: c.label,
        accessor: c.key,
        filter: c.filter,
        width: c.width,
        type: c.fmtr,
        hidden: c.hidden,
        spanning: c.spanning,
        idAccessor: (v) => v,
        valueAccessor: (v) => v
    };

    if (c.filter) {
        baseCell.filter = c.filter;
    } else {
        baseCell.disableFilters = true;
    }

    switch (c.fmtr) {
      case('link'):
        baseCell.Cell = LinkCell;
        baseCell.onClickFunc = linkClick;
        baseCell.idAccessor = (v) => v.id;
        baseCell.valueAccessor = (v) => v.display;
        break;
      case('select'):
        baseCell.Cell = SearchCell;
        baseCell.options = staticData[c.options];
        baseCell.style = {overflow: 'visible'}
        break;
      case('checkbox'):
        baseCell.Cell = RadioCell;
        break;
      case('datepicker'):
        baseCell.Cell = DatePickerCell;
        baseCell.style = {overflow: 'visible'}
        break;
      case('input'):
        baseCell.Cell = InputCell;
        break;
      case('icon'):
        baseCell.Cell = ({cell}) => <Icon name={c.iconFunc(cell.value)}/>;
        break;
      case('submit'):
        baseCell.Cell = SubmitCell;
        baseCell.action = c.action;
        break;
      default:
        baseCell.Cell = ({cell}) =>  (formatter(c['fmtr'])(cell.value) || '');
    }

    return baseCell;
  }
)

