import hash  from 'object-hash';


export const queryHash = (qdef) => {
    const ordered = {};
    Object.keys(qdef).sort().forEach(function(key) {
        ordered[key] = qdef[key];
    });
    return hash(ordered);
}

export const log = (group, logs) => {
    console.group(group);
    for (const [label, entry] of Object.entries(logs)) {
        console.log(label, entry)
    }
    console.groupEnd()
}

export const queryIsInCache = (queryCache, queryDef) => (
  Object.keys(queryCache).includes(queryHash(queryDef))
)

export const getCachedResults = (queryCache, queryDef) => {
  return (
    queryCache[queryHash(queryDef)]
  )
}

