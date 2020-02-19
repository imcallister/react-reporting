export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];
        return reducer ? reducer(state, action.payload) : state;
    };
}

export function updateObject(oldObject, newValues, cb) {
    const obj = Object.assign({}, oldObject, newValues)
    if (cb) {
        cb(obj);
    }
    return obj;
}

export function updateItemInArray(array, itemId, updateItemCallback) {
    const getElement = (item) => {
      if (typeof(item[itemId.key]) === 'object') {
        return item[itemId.key]['id']
      } else {
        return item[itemId.key]
      }
    }

    const updatedItems = array.map(item => {
      if (getElement(item) !== itemId.value) {
          return item
        }
        const updatedItem = updateItemCallback(item)
        return updatedItem
    })

    return updatedItems
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export function parseJSON(response) {
    return response.json();
}

export function reportIdentifier(reportParams) {
    if (reportParams.item || reportParams.qstring) {
        return [reportParams.report, reportParams.item, reportParams.qstring];
    } else {
        return reportParams.report;
    }
}

export function chartIdentifier(reportParams) {
    if (reportParams.item || reportParams.qstring) {
        return [reportParams.chart, reportParams.item, reportParams.qstring];
    } else {
        return reportParams.chart;
    }
}