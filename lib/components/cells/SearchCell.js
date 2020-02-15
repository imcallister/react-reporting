import React, { useState, } from 'react';
import _ from 'lodash'

import { Search } from 'semantic-ui-react'
import { getRowId } from './utils';


export const SearchCell =
  ({
    row: {values},
    column,
    columns,
    tableDispatch,
    initValue=''
  }) => {
    const [searchLoading, setSearchLoading]  = useState(false);
    const [searchValue, setSearchValue] = useState(initValue);
    const [results, setResults] = useState([]);

    const handleResultSelect = async (e, {result}) => {
        const rowId =  await getRowId(columns, values.id);
        setSearchValue(result.title);
        tableDispatch({
          type: 'UPDATE_FIELD',
          rowId: rowId,
          col: column.id,
          value: result.label || result.id
        })
    }

    const handleSearchChange = (e, {value}) => {
        setSearchLoading(true);
        setSearchValue(
            value
        );

        setTimeout(() => {
            const re = new RegExp(_.escapeRegExp(searchValue), 'i')
            const isMatch = r => (re.test(r.id) || re.test(r.title))

            setSearchLoading(false);
            setResults(_.filter(column.options, isMatch));
        }, 300)
    }

    return (
        <Search
            loading={searchLoading}
            onResultSelect={handleResultSelect}
            onSearchChange={_.debounce(handleSearchChange, 500, {leading: true})}
            results={results}
            value={searchValue}
            placeholder={'Search'}
        />
    )
  }
