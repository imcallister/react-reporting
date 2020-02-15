
import matchSorter from 'match-sorter'


const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

const fuzzyLinkFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id].display] })
}

const simpleTextFilter = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue !== undefined
        ? String(rowValue)
            .toLowerCase()
            .includes(String(filterValue).toLowerCase())
        : true
})
}

fuzzyTextFilterFn.autoRemove = val => !val
fuzzyLinkFilterFn.autoRemove = val => !val

export const filters = {
  fuzzyText: fuzzyTextFilterFn,
  fuzzyLink: fuzzyLinkFilterFn,
  text: simpleTextFilter
}
