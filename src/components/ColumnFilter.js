import React from 'react';


export const BaseColumnFilter = ({column: { filterValue, setFilter }}) => {
  return (
      <div className="ui input">
          <input
              value={filterValue || ''}
              onChange={e => {
                setFilter(e.target.value || undefined)
              }}
              placeholder={`Search ...`}
          />
      </div>

  )
}
