import { updateObject, updateItemInArray } from '../utils';


export const tableMiddleware = (serverApi) => (
 (state, action) => {

    const putObject = (state, action) => {
        serverApi.PUT(
            action.actionType,
            action.objId,
            action.editedObject,
            (response) => { action.listener(response)},
            (err) => {console.log('ERROR', err)}
        );
        return state;
    }

    const postObject = (state, action) => {
        serverApi.POST(
            action.actionType,
            action.newObject,
            (response) => { action.listener(response)},
            (err) => {console.log('ERROR', err)}
        );
        return state;
    }

    const updateField = (state, action) => {
        const newRows = updateItemInArray(
            state.rows,
            {key: 'id', value: action.rowId},
            row => updateObject(
                row,
                {[action.col]: action.value}
            )
        )

        return updateObject(
            state, {rows: newRows}
        )
    }

    const updateRow = (state, action) => {
      return updateObject(
          state,
          {
            rows: updateItemInArray(
              state.rows,
              {key: 'id', value: Number(action.objId)},
              row => updateObject(row, {show: false})
            )
          }
      );
    }

    const updateRows = (state, action) => {
      return updateObject(
        state,
        {
          rows: state.rows
                  .map(r => action.objIds.includes(r.id) ? updateObject(r, {show: false}) : r)
        }
      );
    }

    const setErrorMessage = (state, action) => {
      return updateObject(
        state,
        {
            errorMessage: action.errorMessage
        }
      )
    }

    const dismissErrorMessage = (state, action) => {
      return updateObject(
        state,
        {
            errorMessage: null
        }
      )
    }

    const reportError = (state, action) => {
        return state;
    }

    const setToLoading = (state, action) => {
        return updateObject(
            state,
            {
                isLoading: true
            }
        )
    }

    const receiveReport = (state, action) => {

        const combineColumns = (colDefs, reportCols, defaults) => {
          return (
          // pull info from colDefs first and then reportCols
          // to allow for reports with dynamic columns list
          colDefs.map(a => ({...a}))
                  .concat(
                    reportCols
                      .filter(c => !colDefs.map(d => d.key).includes(c.key))
                      .map(c => Object.assign({key: c.key, label: c.label}, defaults || {})))

        )};

        const extraColumnValues = (extraColumns) => {
          return (row) => {
            return Object.assign(
              {},
              row,
              Object.fromEntries(
                extraColumns.map((c) => ([c.key, c.default]))
              ),
              {show: true, isExpanded: true}
            );
          }
        };

        return updateObject(
            state,
            {
                isLoading: false,
                rows: action
                        .rows
                        .map(
                          extraColumnValues(
                            action.columnDefs.filter(cd => (!action.columns.map(c => c.key).includes(cd.key)))
                          )
                        ),
                columns: combineColumns(action.columnDefs, action.columns, action.defaults)
            }
        );
    }

    const tableHandlers = {
        ROW_UPDATED: updateRow,
        ROWS_UPDATED: updateRows,
        UPDATE_FIELD: updateField,
        PUT_OBJECT: putObject,
        POST_OBJECT: postObject,
        RECEIVE_REPORT: receiveReport,
        REPORT_ERROR: reportError,
        SET_ERROR_MESSAGE: setErrorMessage,
        DISMISS_ERROR_MESSAGE: dismissErrorMessage,
        IS_LOADING: setToLoading,
        DEFAULT: (state, action) => (state)
    }

    return (tableHandlers[action.type] || tableHandlers['DEFAULT'])(state, action);
  }
)
