Build on top of [react-table](https://github.com/tannerlinsley/react-table) and [react-semantic-ui](https://react.semantic-ui.com/).

TO - DO:

Documentation around the interface.
An example application

How to export sessionReducer, dispatchMiddleware, SessionContext, queryHash and downloadCSV

queryHash is a utility. Does it belong here?
downloadCSV is an action. Can it be included in an actions export

sessionReducer, dispatchMiddleware, SessionContext all are intertwined and SessionContext is the only one used outside of the basic initialization.
Can it be rolled into just a SessionContext export?
