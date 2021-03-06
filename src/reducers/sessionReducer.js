import staticDataReducer from './staticDataReducer';
import queryReducer from './queryReducer';
import jobReducer from './jobReducer';
import pageReducer from './pageReducer';


import { log, queryHash } from './utils';
import { updateObject } from '../utils';



export const dispatchMiddleware = (dispatch, serverApi) => {

  const query = (dispatch, queryDef, qHash) => {
    const errorHandler = (error) => {
        log(
            'Error: FETCH_QUERY',
            {
                queryDef: queryDef,
                error: error
            }
        );
    }

    const successHandler = (qHash, response) => {
        dispatch(
            {
                type: 'FETCH_QUERY',
                queryDef: queryDef,
                results: response
            }
        );
    }

    serverApi.GET(
        queryDef,
        qHash,
        successHandler,
        errorHandler
    )
  }

  return (action) => {
        switch (action.type) {
            case 'FETCH_QUERY':
                query(
                    dispatch,
                    action.queryDef
                )
                break;
            default:
                return dispatch(action);
      }
    };
}



export const sessionReducer = (state, action) => {

    const environmentReducer = (state, action) => {
        if (action.type === 'SET_PREFERENCES') {
            return updateObject(
                state,
                {sessionLoading: false, mode: 'workspace'}
            )
        }
        else {
            return state
        }
    };

    return {
        sessionEnv: environmentReducer(state.sessionEnv, action),
        isError: state.isError,
        staticData: staticDataReducer(state.staticData, action),
        queryCache: queryReducer(state.queryCache, action),
        jobs: jobReducer(state.jobs, action),
        pages: pageReducer(state.pages, action)
    }
}
