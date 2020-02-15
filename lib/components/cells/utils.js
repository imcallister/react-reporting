export const getRowId = (columns, id) => (
  columns.find(c => c.id === 'id').idAccessor(id)
)
