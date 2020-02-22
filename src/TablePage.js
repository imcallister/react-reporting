import React, { useEffect, useContext, useState, useReducer } from 'react';

import { tableMiddleware } from './reducers/tableReducer';
import { CoreTable } from './CoreTable';
import { BaseCellRenderer } from './CellRenderers'

import { TableLoading } from './components/TableLoading';
import { TableModal } from './components/TableModal';
import { TableHeader } from './components/TableHeader';

import { downloader } from './downloads';
import { SessionContext } from './reducers/contexts';
import { queryIsInCache, getCachedResults } from './reducers/utils'

import { Message} from 'semantic-ui-react';


export const TablePage = ({ queryDef, tableTitle, extraHeader, columnDefs, groupBy=null, defaults }) => {
    const {staticData, sessionDispatch, queryCache, serverApi, serverUrl } = useContext(SessionContext);
    const [tableState, tableDispatch] = useReducer(
      tableMiddleware(serverApi),
      {rows: [], columns: [], isLoading: true, errorMessage: null}
    );
    const [modalOpen, setModalOpen] = useState(false)
    const [modalUrl, setModalUrl] = useState()
    const { rows, columns, isLoading, errorMessage } = tableState;

    const usedRowClickHandler = (id) => {
        console.log('Row Click. Not Implemented', id);
    };

    const reportDownload = () => {
      downloader(columns, rows, tableTitle);
    };

    const refreshTable = () => {
      sessionDispatch({
        type: 'FETCH_QUERY',
        queryDef: queryDef
      });
      tableDispatch({
          type: 'IS_LOADING'
      })
    };

    const headerActionButtons = [
      {
          iconName: 'download',
          onClick: reportDownload,
          key: 'reportDownload',
          message: 'Download'
      }
    ];

    const openModal = (url) => {
      setModalUrl(serverUrl + url);
      setModalOpen(true);
    }

    useEffect(() => {
        if (!queryIsInCache(queryCache, queryDef)) {
            sessionDispatch({
                type: 'FETCH_QUERY',
                queryDef: queryDef
            });
            tableDispatch({
                type: 'IS_LOADING'
            })
        } else {
          const cached = getCachedResults(queryCache, queryDef);
            tableDispatch(
                {
                    type: 'RECEIVE_REPORT',
                    rows: cached.results.data,
                    columns: cached.results.meta.columns,
                    columnDefs: columnDefs,
                    defaults: defaults
                }
            )
        }
    }, [queryDef]);

    useEffect(() => {
        const cached = getCachedResults(queryCache, queryDef);
        if (cached) {
          tableDispatch(
              {
                  type: 'RECEIVE_REPORT',
                  rows: cached.results.data,
                  columns: cached.results.meta.columns,
                  columnDefs: columnDefs,
                  defaults: defaults
              }
          )
        }
    }, [queryCache])

    return (
      <div style={{"overflowX":"auto", "fontSize": "0.75em"}}>
          {
              isLoading
              ?
              <TableLoading/>
              :
              <div style={{"overflow":"visible"}}>
                {
                    errorMessage
                    ?
                    <Message
                        onDismiss={() => {
                          tableDispatch({type: 'DISMISS_ERROR_MESSAGE'})
                        }}
                    >
                        <Message.Header>Error</Message.Header>
                        <p>
                            {errorMessage}
                        </p>
                    </Message>
                    :
                    null
                }
                <TableHeader
                  actionButtons={headerActionButtons}
                  tableState={tableState}
                  tableDispatch={tableDispatch}
                  extra={extraHeader}
                  refresh={refreshTable}
                />
                <CoreTable
                    columns={columns.map(BaseCellRenderer({linkClick: openModal, staticData }))}
                    data={rows}
                    handleRowClick={usedRowClickHandler}
                    tableDispatch={tableDispatch}
                    groupBy={groupBy}
                />
                <TableModal
                  modalOpen={modalOpen}
                  setModalOpen={setModalOpen}
                  url={modalUrl}
                />
              </div>
          }
      </div>
    )
};
