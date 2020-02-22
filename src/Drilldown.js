import React, { useReducer, useEffect, useContext, useState } from 'react';
import { Button, Icon, Dimmer, Loader, Segment, Menu } from 'semantic-ui-react'

import {tableMiddleware} from './reducers/tableReducer';
import { CoreTable } from './CoreTable';
import { BaseCellRenderer } from './CellRenderers'
import { SearchCell } from './components/SearchCell';
import {SessionContext} from './reducers/contexts';
import { queryHash } from './reducers/utils'
import { downloadCSV } from './downloads';



export const Drilldown = ({ reportParams, searchField }) => {
    const {staticData, sessionDispatch, queryCache} = useContext(SessionContext);
    const [tableState, tableDispatch] = useReducer(tableMiddleware(null), {rows: [], columns: [], isLoading: false});
    const { rows, columns, isLoading } = tableState;
    const [filterValue, setFilterValue] = useState();

    useEffect(() => {

        if (filterValue) {
            const qdef = {
                type:'report',
                name: reportParams.reportName,
                item: filterValue.id,
                qstring: reportParams.qstring ? reportParams.qstring :null
            }
            const qHash = queryHash(qdef)

            if (!Object.keys(queryCache).includes(qHash)) {
                sessionDispatch({
                    type: 'FETCH_QUERY',
                    queryDef: qdef
                })
            }
        }
    },[reportParams, filterValue]);

    useEffect(() => {
        const qdef = {
            type:'report',
            name: reportParams.reportName,
            item: filterValue ? filterValue.id : null,
            qstring: reportParams.qstring ? reportParams.qstring :null
        }
        const qHash = queryHash(qdef)
        const cached = queryCache[qHash];

        if (cached) {
            tableDispatch(
                {
                    type: 'RECEIVE_REPORT',
                    rows: cached.results.data,
                    columns: cached.results.meta.columns,
                    columnDefs: []
                }
            )
        }
    }, [queryCache])


    const searchOptions = (search_options) => {
        if (staticData[search_options]) {
            return staticData[search_options].slice(0)
        } else {
            return []
        }
    }


    const downloadReport = () => {
        downloadCSV(
            columns,
            rows,
            'drilldown',
            'csv'
        )
    };

    const extraHeaderContent = () => {
        return (
            <Menu style={{width: '100%'}}>
                <Menu.Item>
                    <SearchCell
                        initValue=''
                        options={searchOptions(searchField)}
                        updater={(v) => {setFilterValue(v)}}
                    />
                </Menu.Item>
                <Menu.Item>
                    <Button icon basic size='small' onClick={downloadReport}>
                        <Icon name='download'/>
                    </Button>
                </Menu.Item>
            </Menu>
        )
    }

    const loadingContent = () => (
        <Segment style={{"height": "700px"}}>
            <Dimmer active>
                <Loader size='massive'>Loading report</Loader>
            </Dimmer>
        </Segment>
    )

    return (
        <div style={{"overflowX":"auto", "fontSize": "0.75em"}}>
            {extraHeaderContent()}
            {!isLoading && (rows.length === 0) &&
                <Segment style={{height: '700px'}}/>
            }
            {isLoading && loadingContent()}
            {!isLoading && (rows.length > 0) &&
                <CoreTable
                    columns={columns.map(BaseCellRenderer({staticData}))}
                    data={rows}
                />

            }
        </div>
    )
};


