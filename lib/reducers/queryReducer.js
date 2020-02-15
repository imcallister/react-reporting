
import { updateObject } from '../utils';
import { log } from './utils';



const queryReducer = (state, action) => {

    const fetchQuery = (state, action) => {

        if (action.results) {
            const newState = updateObject(
                state,
                {
                    [action.qHash]: {
                        queryDef: action.queryDef,
                        results: action.results
                    }
                }
            );
            log(
                'ACTION: FETCH_QUERY',
                {
                    action: action,
                    oldState: state,
                    newState: newState
                }
            )
            return newState
        } else {
            return state;
        }

    }

    const queryHandlers = {
        FETCH_QUERY: fetchQuery,
        DEFAULT: (state, action) => (state)
    }

    return (queryHandlers[action.type] || queryHandlers['DEFAULT'])(state, action);
}

export default queryReducer;
