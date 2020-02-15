

import { updateObject } from '../utils';


const staticDataReducer = (state, action) => {

    const updateStaticData = (state, action) => {
        return updateObject(
            state,
            {[action.label]: action.data.map(d => Object.assign({title: d[action.displayField]}, d))}
        );
    }

    const failedStaticData = (state, action) => {
        console.log('FAILED DATA LOAD', action);
        return state;
    }

    const staticDataHandlers = {
        STATICDATA_LOADED: updateStaticData,
        STATICDATA_LOADFAILED: failedStaticData,
        DEFAULT: (state, action) => (state)
    }

    return (staticDataHandlers[action.type] || staticDataHandlers['DEFAULT'])(state, action);
}

export default staticDataReducer;
