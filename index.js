"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseCellRenderer = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _Formatters = require("./Formatters");

var _RadioCell = require("./components/cells/RadioCell");

var _SearchCell = require("./components/cells/SearchCell");

var _LinkCell = require("./components/cells/LinkCell");

var _SubmitCell = require("./components/cells/SubmitCell");

var _InputCell = require("./components/cells/InputCell");

var _DatePickerCell = require("./components/cells/DatePickerCell");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var BaseCellRenderer = function BaseCellRenderer(_ref) {
  var _ref$linkClick = _ref.linkClick,
      linkClick = _ref$linkClick === void 0 ? null : _ref$linkClick,
      staticData = _ref.staticData;
  return function (c) {
    var baseCell = {
      Header: c.label,
      accessor: c.key,
      filter: c.filter,
      width: c.width,
      type: c.fmtr,
      hidden: c.hidden,
      spanning: c.spanning,
      idAccessor: function idAccessor(v) {
        return v;
      },
      valueAccessor: function valueAccessor(v) {
        return v;
      }
    };

    if (c.filter) {
      baseCell.filter = c.filter;
    } else {
      baseCell.disableFilters = true;
    }

    switch (c.fmtr) {
      case 'link':
        baseCell.Cell = _LinkCell.LinkCell;
        baseCell.onClickFunc = linkClick;

        baseCell.idAccessor = function (v) {
          return v.id;
        };

        baseCell.valueAccessor = function (v) {
          return v.display;
        };

        break;

      case 'select':
        baseCell.Cell = _SearchCell.SearchCell;
        baseCell.options = staticData[c.options];
        baseCell.style = {
          overflow: 'visible'
        };
        break;

      case 'checkbox':
        baseCell.Cell = _RadioCell.RadioCell;
        break;

      case 'datepicker':
        baseCell.Cell = _DatePickerCell.DatePickerCell;
        baseCell.style = {
          overflow: 'visible'
        };
        break;

      case 'input':
        baseCell.Cell = _InputCell.InputCell;
        break;

      case 'icon':
        baseCell.Cell = function (_ref2) {
          var cell = _ref2.cell;
          return _react["default"].createElement(_semanticUiReact.Icon, {
            name: c.iconFunc(cell.value)
          });
        };

        break;

      case 'submit':
        baseCell.Cell = _SubmitCell.SubmitCell;
        baseCell.action = c.action;
        break;

      default:
        baseCell.Cell = function (_ref3) {
          var cell = _ref3.cell;
          return (0, _Formatters.formatter)(c['fmtr'])(cell.value) || '';
        };

    }

    return baseCell;
  };
};

exports.BaseCellRenderer = BaseCellRenderer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreTable = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactTable = require("react-table");

var _filters = require("./components/filters");

var _ColumnFilter = require("./components/ColumnFilter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MAX_ROW_DISPLAY = 200;

var CoreTable = function CoreTable(_ref) {
  var columns = _ref.columns,
      data = _ref.data,
      _ref$groupBy = _ref.groupBy,
      groupBy = _ref$groupBy === void 0 ? null : _ref$groupBy,
      tableDispatch = _ref.tableDispatch;

  var filterTypes = _react["default"].useMemo(function () {
    return _filters.filters;
  }, []);

  var defaultColumn = _react["default"].useMemo(function () {
    return {
      Filter: _ColumnFilter.BaseColumnFilter
    };
  }, []);

  var _useTable = (0, _reactTable.useTable)({
    columns: columns.filter(function (c) {
      return c.hidden !== true;
    }),
    initialState: groupBy ? {
      groupBy: groupBy
    } : {},
    data: data,
    defaultColumn: defaultColumn,
    filterTypes: filterTypes,
    tableDispatch: tableDispatch
  }, _reactTable.useFilters, _reactTable.useGroupBy, _reactTable.useExpanded),
      getTableProps = _useTable.getTableProps,
      getTableBodyProps = _useTable.getTableBodyProps,
      headerGroups = _useTable.headerGroups,
      rows = _useTable.rows,
      prepareRow = _useTable.prepareRow;

  var renderGroupedCell = function renderGroupedCell(c, subRowCnt, subRowLength, isSpanningCol) {
    if (isSpanningCol) {
      if (subRowCnt === 0) {
        return _react["default"].createElement("td", _extends({}, c.getCellProps(), {
          style: c.column.style,
          rowSpan: subRowLength
        }), c.render('Cell'));
      } else {
        return null;
      }
    } else {
      return _react["default"].createElement("td", _extends({}, c.getCellProps(), {
        style: c.column.style
      }), c.render('Cell'));
    }
  };

  var showRow = function showRow(row) {
    if (row.isGrouped) {
      return row.subRows.filter(function (s) {
        return s.original.show;
      }).length > 0;
    } else {
      return row.original.show;
    }
  };

  var renderCell = function renderCell(c) {
    return _react["default"].createElement("td", _extends({}, c.getCellProps(), {
      style: c.column.style
    }), c.render('Cell'));
  };

  var renderGroupedRow = function renderGroupedRow(row, spanningColumns) {
    prepareRow(row);
    return row.subRows.map(function (s, j) {
      prepareRow(s);
      return _react["default"].createElement("tr", s.getRowProps(), s.cells.map(function (c) {
        return renderGroupedCell(c, j, row.subRows.length, spanningColumns.includes(c.column.id));
      }));
    });
  };

  var renderRow = function renderRow(row, i) {
    if (row.isGrouped) {
      return renderGroupedRow(row, columns.filter(function (c) {
        return c.spanning;
      }).map(function (c) {
        return c.accessor;
      }));
    } else {
      return prepareRow(row) || _react["default"].createElement("tr", row.getRowProps(), row.cells.map(renderCell));
    }
  };

  var firstPageRows = rows.filter(showRow).slice(0, MAX_ROW_DISPLAY);
  return _react["default"].createElement("div", {
    style: {
      "overflow": "visible",
      'minHeight': 500
    }
  }, _react["default"].createElement("table", _extends({}, getTableProps(), {
    className: "ui table fixed",
    style: {
      margin: 0
    }
  }), _react["default"].createElement("thead", null, headerGroups.map(function (headerGroup) {
    return _react["default"].createElement("tr", headerGroup.getHeaderGroupProps(), headerGroup.headers.map(function (column) {
      return _react["default"].createElement("th", _extends({}, column.getHeaderProps(), {
        style: {
          width: column.width
        }
      }), column.render('Header'), _react["default"].createElement("div", null, column.canFilter ? column.render('Filter') : null));
    }));
  })), _react["default"].createElement("tbody", getTableBodyProps(), firstPageRows.map(renderRow))));
};

exports.CoreTable = CoreTable;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drilldown = void 0;

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _tableReducer = require("./reducers/tableReducer");

var _CoreTable = require("./CoreTable");

var _CellRenderers = require("./CellRenderers");

var _SearchCell = require("./components/SearchCell");

var _contexts = require("./reducers/contexts");

var _utils = require("./reducers/utils");

var _downloads = require("./downloads");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Drilldown = function Drilldown(_ref) {
  var reportParams = _ref.reportParams,
      searchField = _ref.searchField;

  var _useContext = (0, _react.useContext)(_contexts.SessionContext),
      staticData = _useContext.staticData,
      sessionDispatch = _useContext.sessionDispatch,
      queryCache = _useContext.queryCache;

  var _useReducer = (0, _react.useReducer)((0, _tableReducer.tableMiddleware)(null), {
    rows: [],
    columns: [],
    isLoading: false
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      tableState = _useReducer2[0],
      tableDispatch = _useReducer2[1];

  var rows = tableState.rows,
      columns = tableState.columns,
      isLoading = tableState.isLoading;

  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      filterValue = _useState2[0],
      setFilterValue = _useState2[1];

  (0, _react.useEffect)(function () {
    if (filterValue) {
      var qdef = {
        type: 'report',
        name: reportParams.reportName,
        item: filterValue.id,
        qstring: reportParams.qstring ? reportParams.qstring : null
      };
      var qHash = (0, _utils.queryHash)(qdef);

      if (!Object.keys(queryCache).includes(qHash)) {
        sessionDispatch({
          type: 'FETCH_QUERY',
          queryDef: qdef,
          qHash: qHash
        });
      }
    }
  }, [reportParams, filterValue]);
  (0, _react.useEffect)(function () {
    var qdef = {
      type: 'report',
      name: reportParams.reportName,
      item: filterValue ? filterValue.id : null,
      qstring: reportParams.qstring ? reportParams.qstring : null
    };
    var qHash = (0, _utils.queryHash)(qdef);
    var cached = queryCache[qHash];

    if (cached) {
      tableDispatch({
        type: 'RECEIVE_REPORT',
        rows: cached.results.data,
        columns: cached.results.meta.columns,
        columnDefs: []
      });
    }
  }, [queryCache]);

  var searchOptions = function searchOptions(search_options) {
    if (staticData[search_options]) {
      return staticData[search_options].slice(0);
    } else {
      return [];
    }
  };

  var downloadReport = function downloadReport() {
    (0, _downloads.downloadCSV)(columns, rows, 'drilldown', 'csv');
  };

  var extraHeaderContent = function extraHeaderContent() {
    return _react["default"].createElement(_semanticUiReact.Menu, {
      style: {
        width: '100%'
      }
    }, _react["default"].createElement(_semanticUiReact.Menu.Item, null, _react["default"].createElement(_SearchCell.SearchCell, {
      initValue: "",
      options: searchOptions(searchField),
      updater: function updater(v) {
        setFilterValue(v);
      }
    })), _react["default"].createElement(_semanticUiReact.Menu.Item, null, _react["default"].createElement(_semanticUiReact.Button, {
      icon: true,
      basic: true,
      size: "small",
      onClick: downloadReport
    }, _react["default"].createElement(_semanticUiReact.Icon, {
      name: "download"
    }))));
  };

  var loadingContent = function loadingContent() {
    return _react["default"].createElement(_semanticUiReact.Segment, {
      style: {
        "height": "700px"
      }
    }, _react["default"].createElement(_semanticUiReact.Dimmer, {
      active: true
    }, _react["default"].createElement(_semanticUiReact.Loader, {
      size: "massive"
    }, "Loading report")));
  };

  return _react["default"].createElement("div", {
    style: {
      "overflowX": "auto",
      "fontSize": "0.75em"
    }
  }, extraHeaderContent(), !isLoading && rows.length === 0 && _react["default"].createElement(_semanticUiReact.Segment, {
    style: {
      height: '700px'
    }
  }), isLoading && loadingContent(), !isLoading && rows.length > 0 && _react["default"].createElement(_CoreTable.CoreTable, {
    columns: columns.map((0, _CellRenderers.BaseCellRenderer)({
      staticData: staticData
    })),
    data: rows
  }));
};

exports.Drilldown = Drilldown;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatter = void 0;

var _numeral = _interopRequireDefault(require("numeral"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DATE_FORMATS = ['MMM Do, YYYY', 'MMM Do, YYYY H:mm:ss'];
var NUMBER_FORMATS = ['0,0', '0,0.00', '$0,0', '$0,0.00', '($0,0)', '($0,0.00)', '(0,0.00)', '(0,0)'];

var formatter = function formatter(fmt) {
  if (NUMBER_FORMATS.includes(fmt)) {
    return function (value) {
      return (0, _numeral["default"])(value).format(fmt);
    };
  } else if (DATE_FORMATS.includes(fmt)) {
    return function (value) {
      return (0, _moment["default"])(value).format(fmt);
    };
  } else {
    return function (value) {
      return value;
    };
  }
};

exports.formatter = formatter;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TablePage = void 0;

var _react = _interopRequireWildcard(require("react"));

var _tableReducer = require("./reducers/tableReducer");

var _CoreTable = require("./CoreTable");

var _CellRenderers = require("./CellRenderers");

var _TableLoading = require("./components/TableLoading");

var _TableModal = require("./components/TableModal");

var _TableHeader = require("./components/TableHeader");

var _downloads = require("./downloads");

var _contexts = require("./reducers/contexts");

var _utils = require("./reducers/utils");

var _semanticUiReact = require("semantic-ui-react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var TablePage = function TablePage(_ref) {
  var queryDef = _ref.queryDef,
      tableTitle = _ref.tableTitle,
      extraHeader = _ref.extraHeader,
      columnDefs = _ref.columnDefs,
      _ref$groupBy = _ref.groupBy,
      groupBy = _ref$groupBy === void 0 ? null : _ref$groupBy,
      defaults = _ref.defaults;

  var _useContext = (0, _react.useContext)(_contexts.SessionContext),
      staticData = _useContext.staticData,
      sessionDispatch = _useContext.sessionDispatch,
      queryCache = _useContext.queryCache,
      serverApi = _useContext.serverApi,
      serverUrl = _useContext.serverUrl;

  var _useReducer = (0, _react.useReducer)((0, _tableReducer.tableMiddleware)(serverApi), {
    rows: [],
    columns: [],
    isLoading: true,
    errorMessage: null
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      tableState = _useReducer2[0],
      tableDispatch = _useReducer2[1];

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      modalOpen = _useState2[0],
      setModalOpen = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      _useState4 = _slicedToArray(_useState3, 2),
      modalUrl = _useState4[0],
      setModalUrl = _useState4[1];

  var rows = tableState.rows,
      columns = tableState.columns,
      isLoading = tableState.isLoading,
      errorMessage = tableState.errorMessage;
  var qHash = (0, _utils.queryHash)(queryDef);

  var usedRowClickHandler = function usedRowClickHandler(id) {
    console.log('Row Click. Not Implemented', id);
  };

  var reportDownload = function reportDownload() {
    (0, _downloads.downloader)(columns, rows, tableTitle);
  };

  var refreshTable = function refreshTable() {
    sessionDispatch({
      type: 'FETCH_QUERY',
      queryDef: queryDef,
      qHash: qHash
    });
    tableDispatch({
      type: 'IS_LOADING'
    });
  };

  var headerActionButtons = [{
    iconName: 'download',
    onClick: reportDownload,
    key: 'reportDownload',
    message: 'Download'
  }];

  var openModal = function openModal(url) {
    setModalUrl(serverUrl + url);
    setModalOpen(true);
  };

  (0, _react.useEffect)(function () {
    if (!Object.keys(queryCache).includes(qHash)) {
      sessionDispatch({
        type: 'FETCH_QUERY',
        queryDef: queryDef,
        qHash: qHash
      });
      tableDispatch({
        type: 'IS_LOADING'
      });
    } else {
      var cached = queryCache[qHash];
      tableDispatch({
        type: 'RECEIVE_REPORT',
        rows: cached.results.data,
        columns: cached.results.meta.columns,
        columnDefs: columnDefs,
        defaults: defaults
      });
    }
  }, [queryDef]);
  (0, _react.useEffect)(function () {
    var cached = queryCache[qHash];

    if (cached) {
      tableDispatch({
        type: 'RECEIVE_REPORT',
        rows: cached.results.data,
        columns: cached.results.meta.columns,
        columnDefs: columnDefs,
        defaults: defaults
      });
    }
  }, [queryCache]);
  return _react["default"].createElement("div", {
    style: {
      "overflowX": "auto",
      "fontSize": "0.75em"
    }
  }, isLoading ? _react["default"].createElement(_TableLoading.TableLoading, null) : _react["default"].createElement("div", {
    style: {
      "overflow": "visible"
    }
  }, errorMessage ? _react["default"].createElement(_semanticUiReact.Message, {
    onDismiss: function onDismiss() {
      tableDispatch({
        type: 'DISMISS_ERROR_MESSAGE'
      });
    }
  }, _react["default"].createElement(_semanticUiReact.Message.Header, null, "Error"), _react["default"].createElement("p", null, errorMessage)) : null, _react["default"].createElement(_TableHeader.TableHeader, {
    actionButtons: headerActionButtons,
    tableState: tableState,
    tableDispatch: tableDispatch,
    extra: extraHeader,
    refresh: refreshTable
  }), _react["default"].createElement(_CoreTable.CoreTable, {
    columns: columns.map((0, _CellRenderers.BaseCellRenderer)({
      linkClick: openModal,
      staticData: staticData
    })),
    data: rows,
    handleRowClick: usedRowClickHandler,
    tableDispatch: tableDispatch,
    groupBy: groupBy
  }), _react["default"].createElement(_TableModal.TableModal, {
    modalOpen: modalOpen,
    setModalOpen: setModalOpen,
    url: modalUrl
  })));
};

exports.TablePage = TablePage;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseColumnFilter = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var BaseColumnFilter = function BaseColumnFilter(_ref) {
  var _ref$column = _ref.column,
      filterValue = _ref$column.filterValue,
      setFilter = _ref$column.setFilter;
  return _react["default"].createElement("div", {
    className: "ui input"
  }, _react["default"].createElement("input", {
    value: filterValue || '',
    onChange: function onChange(e) {
      setFilter(e.target.value || undefined);
    },
    placeholder: "Search ..."
  }));
};

exports.BaseColumnFilter = BaseColumnFilter;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchCell = void 0;

var _react = _interopRequireWildcard(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var SearchCell = function SearchCell(_ref) {
  var initValue = _ref.initValue,
      options = _ref.options,
      updater = _ref.updater;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      searchLoading = _useState2[0],
      setSearchLoading = _useState2[1];

  var _useState3 = (0, _react.useState)(initValue),
      _useState4 = _slicedToArray(_useState3, 2),
      searchValue = _useState4[0],
      setSearchValue = _useState4[1];

  var _useState5 = (0, _react.useState)([]),
      _useState6 = _slicedToArray(_useState5, 2),
      results = _useState6[0],
      setResults = _useState6[1];

  var handleResultSelect = function handleResultSelect(e, _ref2) {
    var result = _ref2.result;
    updater(result);
    setSearchValue(result.title);
  };

  var handleSearchChange = function handleSearchChange(e, _ref3) {
    var value = _ref3.value;
    setSearchLoading(true);
    setSearchValue(value);
    setTimeout(function () {
      var re = new RegExp(_lodash["default"].escapeRegExp(searchValue), 'i');

      var isMatch = function isMatch(r) {
        return re.test(r.id) || re.test(r.title);
      };

      setSearchLoading(false);
      setResults(_lodash["default"].filter(options, isMatch));
    }, 300);
  };

  return _react["default"].createElement(_semanticUiReact.Search, {
    loading: searchLoading,
    onResultSelect: handleResultSelect,
    onSearchChange: _lodash["default"].debounce(handleSearchChange, 500, {
      leading: true
    }),
    results: results,
    value: searchValue,
    placeholder: 'Search'
  });
};

exports.SearchCell = SearchCell;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableHeader = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var concatButtons = function concatButtons(defaults, extra) {
  var removeDuplicateDefaults = function removeDuplicateDefaults(d) {
    return !extra.map(function (e) {
      return e.iconName;
    }).includes(d.iconName);
  };

  return defaults.filter(removeDuplicateDefaults).concat(extra);
};

var TableHeader = function TableHeader(_ref) {
  var actionButtons = _ref.actionButtons,
      tableState = _ref.tableState,
      tableDispatch = _ref.tableDispatch,
      extra = _ref.extra,
      refresh = _ref.refresh;
  return _react["default"].createElement(_semanticUiReact.Menu, {
    secondary: true,
    style: {
      margin: 0,
      padding: "0,0"
    }
  }, _react["default"].createElement(_semanticUiReact.Menu.Item, {
    style: {
      margin: 0,
      padding: "0"
    }
  }, _react["default"].createElement(_semanticUiReact.Button.Group, null, (extra ? concatButtons(actionButtons, extra.actionButtons || []) : actionButtons).map(function (b) {
    return _react["default"].createElement(_semanticUiReact.Popup, {
      content: b.message,
      key: b.key,
      trigger: _react["default"].createElement(_semanticUiReact.Button, {
        icon: true,
        basic: true,
        size: "large",
        onClick: function onClick() {
          return b.onClick(tableState, tableDispatch);
        }
      }, _react["default"].createElement(_semanticUiReact.Icon, {
        name: b.iconName
      }))
    });
  }))), _react["default"].createElement(_semanticUiReact.Menu.Menu, {
    position: "right"
  }, _react["default"].createElement(_semanticUiReact.Menu.Item, {
    as: "a",
    header: true
  }, _react["default"].createElement(_semanticUiReact.Popup, {
    content: "Refresh Page",
    trigger: _react["default"].createElement(_semanticUiReact.Icon, {
      name: "refresh",
      onClick: refresh
    }),
    position: "bottom right"
  }))));
};

exports.TableHeader = TableHeader;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableLoading = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TableLoading = function TableLoading() {
  return _react["default"].createElement(_semanticUiReact.Segment, {
    style: {
      "height": "700px"
    }
  }, _react["default"].createElement(_semanticUiReact.Dimmer, {
    active: true
  }, _react["default"].createElement(_semanticUiReact.Loader, {
    size: "massive"
  }, "Loading report")));
};

exports.TableLoading = TableLoading;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableModal = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TableModal = function TableModal(_ref) {
  var modalOpen = _ref.modalOpen,
      setModalOpen = _ref.setModalOpen,
      url = _ref.url;
  return _react["default"].createElement(_semanticUiReact.Modal, {
    open: modalOpen,
    onClose: function onClose() {
      return setModalOpen(false);
    },
    closeIcon: true
  }, _react["default"].createElement(_semanticUiReact.Modal.Content, {
    style: {
      height: "700px",
      padding: 0
    }
  }, _react["default"].createElement("iframe", {
    src: url,
    width: "100%",
    height: "100%"
  })));
};

exports.TableModal = TableModal;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatePickerCell = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactSemanticUiDatepickers = _interopRequireDefault(require("react-semantic-ui-datepickers"));

var _moment = _interopRequireDefault(require("moment"));

var _utils = require("./utils");

require("react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DatePickerCell = function DatePickerCell(_ref) {
  var values = _ref.row.values,
      id = _ref.column.id,
      columns = _ref.columns,
      tableDispatch = _ref.tableDispatch;

  var onChange = function onChange(d) {
    tableDispatch({
      type: 'UPDATE_FIELD',
      rowId: (0, _utils.getRowId)(columns, values.id),
      col: id,
      value: (0, _moment["default"])(d).format('YYYY-MM-DD')
    });
  };

  return _react["default"].createElement(_reactSemanticUiDatepickers["default"], {
    onDateChange: onChange
  });
};

exports.DatePickerCell = DatePickerCell;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputCell = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var InputCell = function InputCell(_ref) {
  var cell = _ref.cell,
      values = _ref.row.values,
      column = _ref.column,
      columns = _ref.columns,
      tableDispatch = _ref.tableDispatch;

  var handleChange = function handleChange(e) {
    tableDispatch({
      type: 'UPDATE_FIELD',
      rowId: (0, _utils.getRowId)(columns, values.id),
      col: column.id,
      value: e.target.value
    });
  };

  return _react["default"].createElement(_semanticUiReact.Input, {
    onChange: handleChange,
    placeholder: cell.value
  });
};

exports.InputCell = InputCell;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkCell = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var LinkCell = function LinkCell(_ref) {
  var cell = _ref.cell,
      column = _ref.column;
  return _react["default"].createElement(_semanticUiReact.Button, {
    basic: true,
    color: "green",
    className: "tertiary",
    onClick: function onClick() {
      column.onClickFunc(cell.value.link);
    }
  }, cell.value.display);
};

exports.LinkCell = LinkCell;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioCell = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var RadioCell = function RadioCell(_ref) {
  var values = _ref.row.values,
      id = _ref.column.id,
      columns = _ref.columns,
      tableDispatch = _ref.tableDispatch;

  var onChange = function onChange(e, d) {
    tableDispatch({
      type: 'UPDATE_FIELD',
      rowId: (0, _utils.getRowId)(columns, values.id),
      col: id,
      value: d.checked
    });
  };

  return _react["default"].createElement(_semanticUiReact.Checkbox, {
    onChange: onChange
  });
};

exports.RadioCell = RadioCell;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchCell = void 0;

var _react = _interopRequireWildcard(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _semanticUiReact = require("semantic-ui-react");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var SearchCell = function SearchCell(_ref) {
  var values = _ref.row.values,
      column = _ref.column,
      columns = _ref.columns,
      tableDispatch = _ref.tableDispatch,
      _ref$initValue = _ref.initValue,
      initValue = _ref$initValue === void 0 ? '' : _ref$initValue;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      searchLoading = _useState2[0],
      setSearchLoading = _useState2[1];

  var _useState3 = (0, _react.useState)(initValue),
      _useState4 = _slicedToArray(_useState3, 2),
      searchValue = _useState4[0],
      setSearchValue = _useState4[1];

  var _useState5 = (0, _react.useState)([]),
      _useState6 = _slicedToArray(_useState5, 2),
      results = _useState6[0],
      setResults = _useState6[1];

  var handleResultSelect =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(e, _ref3) {
      var result, rowId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              result = _ref3.result;
              _context.next = 3;
              return (0, _utils.getRowId)(columns, values.id);

            case 3:
              rowId = _context.sent;
              setSearchValue(result.title);
              tableDispatch({
                type: 'UPDATE_FIELD',
                rowId: rowId,
                col: column.id,
                value: result.label || result.id
              });

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function handleResultSelect(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var handleSearchChange = function handleSearchChange(e, _ref4) {
    var value = _ref4.value;
    setSearchLoading(true);
    setSearchValue(value);
    setTimeout(function () {
      var re = new RegExp(_lodash["default"].escapeRegExp(searchValue), 'i');

      var isMatch = function isMatch(r) {
        return re.test(r.id) || re.test(r.title);
      };

      setSearchLoading(false);
      setResults(_lodash["default"].filter(column.options, isMatch));
    }, 300);
  };

  return _react["default"].createElement(_semanticUiReact.Search, {
    loading: searchLoading,
    onResultSelect: handleResultSelect,
    onSearchChange: _lodash["default"].debounce(handleSearchChange, 500, {
      leading: true
    }),
    results: results,
    value: searchValue,
    placeholder: 'Search'
  });
};

exports.SearchCell = SearchCell;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubmitCell = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _utils = require("../../utils");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var SubmitCell = function SubmitCell(_ref) {
  var column = _ref.column,
      columns = _ref.columns,
      values = _ref.row.values,
      tableDispatch = _ref.tableDispatch;

  var eventListener = function eventListener(response) {
    if (response.success === true) {
      tableDispatch({
        type: 'ROW_UPDATED',
        objId: response['object_id']
      });
    } else {
      console.log('Error in TableUpdate Event Listener', response);
    }
  };

  var onSubmit =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var rowId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _utils2.getRowId)(columns, values.id);

            case 2:
              rowId = _context.sent;
              tableDispatch({
                type: 'PUT_OBJECT',
                objId: rowId,
                actionType: column.action,
                listener: eventListener,
                editedObject: (0, _utils.updateObject)(values, {
                  id: rowId
                })
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function onSubmit() {
      return _ref2.apply(this, arguments);
    };
  }();

  return _react["default"].createElement(_semanticUiReact.Button, {
    className: "tertiary",
    onClick: onSubmit
  }, column.Header);
};

exports.SubmitCell = SubmitCell;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRowId = void 0;

var getRowId = function getRowId(columns, id) {
  return columns.find(function (c) {
    return c.id === 'id';
  }).idAccessor(id);
};

exports.getRowId = getRowId;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filters = void 0;

var _matchSorter = _interopRequireDefault(require("match-sorter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fuzzyTextFilterFn = function fuzzyTextFilterFn(rows, id, filterValue) {
  return (0, _matchSorter["default"])(rows, filterValue, {
    keys: [function (row) {
      return row.values[id];
    }]
  });
};

var fuzzyLinkFilterFn = function fuzzyLinkFilterFn(rows, id, filterValue) {
  return (0, _matchSorter["default"])(rows, filterValue, {
    keys: [function (row) {
      return row.values[id].display;
    }]
  });
};

var simpleTextFilter = function simpleTextFilter(rows, id, filterValue) {
  return rows.filter(function (row) {
    var rowValue = row.values[id];
    return rowValue !== undefined ? String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase()) : true;
  });
};

fuzzyTextFilterFn.autoRemove = function (val) {
  return !val;
};

fuzzyLinkFilterFn.autoRemove = function (val) {
  return !val;
};

var filters = {
  fuzzyText: fuzzyTextFilterFn,
  fuzzyLink: fuzzyLinkFilterFn,
  text: simpleTextFilter
};
exports.filters = filters;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadCSV = downloadCSV;
exports.downloader = downloader;

function downloadCSV(columns, data, fileName) {
  var fileType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'csv';
  var useHeaders = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var responseTypes = {
    'csv': 'text/csv;charset=utf-8;',
    'tsv': 'text/tab-separated-values,'
  };
  var separators = {
    'csv': ',',
    'tsv': '\t'
  };
  var separator = separators[fileType];

  var make_row = function make_row(labels, a) {
    var out = labels.map(function (l) {
      return a[l];
    }).join(separator) + '\n';
    return out;
  };

  var labels = columns.map(function (x) {
    return x.key;
  });
  var headers = columns.map(function (x) {
    return x.label;
  }).join(separator) + '\n';
  var body = data.map(function (row) {
    return make_row(labels, row);
  }).join("");
  var csvData = new Blob([useHeaders ? headers.concat(body) : body], {
    type: responseTypes[fileType]
  });
  var csvURL = null;

  if (navigator.msSaveBlob) {
    csvURL = navigator.msSaveBlob(csvData, fileName);
  } else {
    csvURL = window.URL.createObjectURL(csvData);
  }

  var tempLink = document.createElement('a');
  tempLink.href = csvURL;
  tempLink.setAttribute('download', fileName + '.' + fileType);
  tempLink.click();
}

function downloader(columns, rows, fileName) {
  var fileType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'csv';
  var useHeaders = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var responseTypes = {
    'csv': 'text/csv;charset=utf-8;',
    'tsv': 'text/tab-separated-values,'
  };
  var separators = {
    'csv': ',',
    'tsv': '\t'
  };
  var separator = separators[fileType];
  var headers = columns.map(function (x) {
    return x.label;
  }).join(separator) + '\n';

  var valueGetter = function valueGetter(c) {
    if (c.fmtr === 'link') {
      return function (a) {
        return a[c.key].display;
      };
    } else {
      return function (a) {
        return a[c.key];
      };
    }
  };

  var getters = columns.map(function (c) {
    return valueGetter(c);
  });

  var make_row = function make_row(a) {
    var out = getters.map(function (g) {
      return g(a);
    }).join(separator) + '\n';
    return out;
  };

  var body = rows.map(function (row) {
    return make_row(row);
  }).join("");
  var csvData = new Blob([useHeaders === true ? headers.concat(body) : body], {
    type: responseTypes[fileType]
  });
  var csvURL = null;

  if (navigator.msSaveBlob) {
    csvURL = navigator.msSaveBlob(csvData, fileName);
  } else {
    csvURL = window.URL.createObjectURL(csvData);
  }

  var tempLink = document.createElement('a');
  tempLink.href = csvURL;
  tempLink.setAttribute('download', fileName + '.' + fileType);
  tempLink.click();
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionContext = void 0;

var _react = require("react");

var SessionContext = (0, _react.createContext)(null);
exports.SessionContext = SessionContext;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var jobReducer = function jobReducer(state, action) {
  var jobStarted = function jobStarted(state, action) {
    console.log('JOB STARTED', action);
    return state;
  };

  var jobFailed = function jobFailed(state, action) {
    console.log('JOB FAILED', action);
    return state;
  };

  var jobHandlers = {
    START_JOB: jobStarted,
    JOB_FAILED: jobFailed,
    DEFAULT: function DEFAULT(state, action) {
      return state;
    }
  };
  return (jobHandlers[action.type] || jobHandlers['DEFAULT'])(state, action);
};

var _default = jobReducer;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("../utils");

var pageReducer = function pageReducer(state, action) {
  var changePage = function changePage(state, action) {
    return (0, _utils.updateObject)(state, {
      activePage: action.pageId
    });
  };

  var setPages = function setPages(state, action) {
    return (0, _utils.updateObject)(state, {
      activePage: action.pagePermissions.activePage,
      pages: action.pages.filter(function (p) {
        return action.pagePermissions.pages.includes(p.type);
      })
    });
  };

  var refreshPage = function refreshPage(state, action) {
    return state;
  };

  var pageHandlers = {
    CHANGE_PAGE: changePage,
    REFRESH_PAGE: refreshPage,
    SET_PAGES: setPages,
    DEFAULT: function DEFAULT(state, action) {
      return state;
    }
  };
  return (pageHandlers[action.type] || pageHandlers['DEFAULT'])(state, action);
};

var _default = pageReducer;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("../utils");

var _utils2 = require("./utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var queryReducer = function queryReducer(state, action) {
  var fetchQuery = function fetchQuery(state, action) {
    if (action.results) {
      var newState = (0, _utils.updateObject)(state, _defineProperty({}, action.qHash, {
        queryDef: action.queryDef,
        results: action.results
      }));
      (0, _utils2.log)('ACTION: FETCH_QUERY', {
        action: action,
        oldState: state,
        newState: newState
      });
      return newState;
    } else {
      return state;
    }
  };

  var queryHandlers = {
    FETCH_QUERY: fetchQuery,
    DEFAULT: function DEFAULT(state, action) {
      return state;
    }
  };
  return (queryHandlers[action.type] || queryHandlers['DEFAULT'])(state, action);
};

var _default = queryReducer;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.dispatchMiddleware = void 0;

var _staticDataReducer = _interopRequireDefault(require("./staticDataReducer"));

var _queryReducer = _interopRequireDefault(require("./queryReducer"));

var _jobReducer = _interopRequireDefault(require("./jobReducer"));

var _pageReducer = _interopRequireDefault(require("./pageReducer"));

var _utils = require("./utils");

var _utils2 = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dispatchMiddleware = function dispatchMiddleware(dispatch, serverApi) {
  var query = function query(dispatch, queryDef, qHash) {
    var errorHandler = function errorHandler(error) {
      (0, _utils.log)('Error: FETCH_QUERY', {
        queryDef: queryDef,
        qHash: qHash,
        error: error
      });
    };

    var successHandler = function successHandler(qHash, response) {
      dispatch({
        type: 'FETCH_QUERY',
        queryDef: queryDef,
        qHash: qHash,
        results: response
      });
    };

    serverApi.GET(queryDef, qHash, successHandler, errorHandler);
  };

  return function (action) {
    switch (action.type) {
      case 'FETCH_QUERY':
        query(dispatch, action.queryDef, action.qHash);
        break;

      default:
        return dispatch(action);
    }
  };
};

exports.dispatchMiddleware = dispatchMiddleware;

var sessionReducer = function sessionReducer(state, action) {
  var environmentReducer = function environmentReducer(state, action) {
    if (action.type === 'SET_PREFERENCES') {
      return (0, _utils2.updateObject)(state, {
        sessionLoading: false,
        mode: 'workspace'
      });
    } else {
      return state;
    }
  };

  return {
    sessionEnv: environmentReducer(state.sessionEnv, action),
    isError: state.isError,
    staticData: (0, _staticDataReducer["default"])(state.staticData, action),
    queryCache: (0, _queryReducer["default"])(state.queryCache, action),
    jobs: (0, _jobReducer["default"])(state.jobs, action),
    pages: (0, _pageReducer["default"])(state.pages, action)
  };
};

var _default = sessionReducer;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var staticDataReducer = function staticDataReducer(state, action) {
  var updateStaticData = function updateStaticData(state, action) {
    return (0, _utils.updateObject)(state, _defineProperty({}, action.label, action.data.map(function (d) {
      return Object.assign({
        title: d[action.displayField]
      }, d);
    })));
  };

  var failedStaticData = function failedStaticData(state, action) {
    console.log('FAILED DATA LOAD', action);
    return state;
  };

  var staticDataHandlers = {
    STATICDATA_LOADED: updateStaticData,
    STATICDATA_LOADFAILED: failedStaticData,
    DEFAULT: function DEFAULT(state, action) {
      return state;
    }
  };
  return (staticDataHandlers[action.type] || staticDataHandlers['DEFAULT'])(state, action);
};

var _default = staticDataReducer;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tableMiddleware = void 0;

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var tableMiddleware = function tableMiddleware(serverApi) {
  return function (state, action) {
    var putObject = function putObject(state, action) {
      serverApi.PUT(action.actionType, action.objId, action.editedObject, function (response) {
        action.listener(response);
      }, function (err) {
        console.log('ERROR', err);
      });
      return state;
    };

    var postObject = function postObject(state, action) {
      serverApi.POST(action.actionType, action.newObject, function (response) {
        action.listener(response);
      }, function (err) {
        console.log('ERROR', err);
      });
      return state;
    };

    var updateField = function updateField(state, action) {
      var newRows = (0, _utils.updateItemInArray)(state.rows, {
        key: 'id',
        value: action.rowId
      }, function (row) {
        return (0, _utils.updateObject)(row, _defineProperty({}, action.col, action.value));
      });
      return (0, _utils.updateObject)(state, {
        rows: newRows
      });
    };

    var updateRow = function updateRow(state, action) {
      return (0, _utils.updateObject)(state, {
        rows: (0, _utils.updateItemInArray)(state.rows, {
          key: 'id',
          value: Number(action.objId)
        }, function (row) {
          return (0, _utils.updateObject)(row, {
            show: false
          });
        })
      });
    };

    var updateRows = function updateRows(state, action) {
      return (0, _utils.updateObject)(state, {
        rows: state.rows.map(function (r) {
          return action.objIds.includes(r.id) ? (0, _utils.updateObject)(r, {
            show: false
          }) : r;
        })
      });
    };

    var setErrorMessage = function setErrorMessage(state, action) {
      return (0, _utils.updateObject)(state, {
        errorMessage: action.errorMessage
      });
    };

    var dismissErrorMessage = function dismissErrorMessage(state, action) {
      return (0, _utils.updateObject)(state, {
        errorMessage: null
      });
    };

    var reportError = function reportError(state, action) {
      return state;
    };

    var setToLoading = function setToLoading(state, action) {
      return (0, _utils.updateObject)(state, {
        isLoading: true
      });
    };

    var receiveReport = function receiveReport(state, action) {
      var combineColumns = function combineColumns(colDefs, reportCols, defaults) {
        return (// pull info from colDefs first and then reportCols
          // to allow for reports with dynamic columns list
          colDefs.map(function (a) {
            return _objectSpread({}, a);
          }).concat(reportCols.filter(function (c) {
            return !colDefs.map(function (d) {
              return d.key;
            }).includes(c.key);
          }).map(function (c) {
            return Object.assign({
              key: c.key,
              label: c.label
            }, defaults || {});
          }))
        );
      };

      var extraColumnValues = function extraColumnValues(extraColumns) {
        return function (row) {
          return Object.assign({}, row, Object.fromEntries(extraColumns.map(function (c) {
            return [c.key, c["default"]];
          })), {
            show: true,
            isExpanded: true
          });
        };
      };

      return (0, _utils.updateObject)(state, {
        isLoading: false,
        rows: action.rows.map(extraColumnValues(action.columnDefs.filter(function (cd) {
          return !action.columns.map(function (c) {
            return c.key;
          }).includes(cd.key);
        }))),
        columns: combineColumns(action.columnDefs, action.columns, action.defaults)
      });
    };

    var tableHandlers = {
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
      DEFAULT: function DEFAULT(state, action) {
        return state;
      }
    };
    return (tableHandlers[action.type] || tableHandlers['DEFAULT'])(state, action);
  };
};

exports.tableMiddleware = tableMiddleware;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.queryHash = void 0;

var _objectHash = _interopRequireDefault(require("object-hash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var queryHash = function queryHash(qdef) {
  var ordered = {};
  Object.keys(qdef).sort().forEach(function (key) {
    ordered[key] = qdef[key];
  });
  return (0, _objectHash["default"])(ordered);
};

exports.queryHash = queryHash;

var log = function log(group, logs) {
  console.group(group);

  for (var _i = 0, _Object$entries = Object.entries(logs); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        label = _Object$entries$_i[0],
        entry = _Object$entries$_i[1];

    console.log(label, entry);
  }

  console.groupEnd();
};

exports.log = log;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = createReducer;
exports.updateObject = updateObject;
exports.updateItemInArray = updateItemInArray;
exports.checkHttpStatus = checkHttpStatus;
exports.parseJSON = parseJSON;
exports.reportIdentifier = reportIdentifier;
exports.chartIdentifier = chartIdentifier;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function createReducer(initialState, reducerMap) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var reducer = reducerMap[action.type];
    return reducer ? reducer(state, action.payload) : state;
  };
}

function updateObject(oldObject, newValues, cb) {
  var obj = Object.assign({}, oldObject, newValues);

  if (cb) {
    cb(obj);
  }

  return obj;
}

function updateItemInArray(array, itemId, updateItemCallback) {
  var getElement = function getElement(item) {
    if (_typeof(item[itemId.key]) === 'object') {
      return item[itemId.key]['id'];
    } else {
      return item[itemId.key];
    }
  };

  var updatedItems = array.map(function (item) {
    if (getElement(item) !== itemId.value) {
      return item;
    }

    var updatedItem = updateItemCallback(item);
    return updatedItem;
  });
  return updatedItems;
}

function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  var error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function reportIdentifier(reportParams) {
  if (reportParams.item || reportParams.qstring) {
    return [reportParams.report, reportParams.item, reportParams.qstring];
  } else {
    return reportParams.report;
  }
}

function chartIdentifier(reportParams) {
  if (reportParams.item || reportParams.qstring) {
    return [reportParams.chart, reportParams.item, reportParams.qstring];
  } else {
    return reportParams.chart;
  }
}
