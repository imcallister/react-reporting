import React, { useState, } from 'react';
import _ from 'lodash'

import { Search } from 'semantic-ui-react'

export const SearchCell = ({initValue, options, updater}) => {
    const [searchLoading, setSearchLoading]  = useState(false);
    const [searchValue, setSearchValue] = useState(initValue);
    const [results, setResults] = useState([]);

    const handleResultSelect = (e, {result}) => {
        updater(result);
        setSearchValue(result.title);
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
            setResults(_.filter(options, isMatch));
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
