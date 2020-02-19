

export function downloadCSV(columns, data, fileName, fileType='csv', useHeaders=true) {
    const responseTypes = {
        'csv': 'text/csv;charset=utf-8;',
        'tsv': 'text/tab-separated-values,'
    }

    const separators = {
        'csv': ',',
        'tsv': '\t'
    }

    const separator = separators[fileType]

    const make_row = (labels, a)=> {
        var out = labels.map(l => a[l]).join(separator) +'\n';
        return out;
    };

    var labels = columns.map(x => x.key);
    var headers = columns.map(x => x.label).join(separator) + '\n';

    var body = data.map(row => make_row(labels, row)).join("");
    var csvData = new Blob(
        [useHeaders ? headers.concat(body) : body],
        {type: responseTypes[fileType]}
    );

    var csvURL =  null;
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




export function downloader(columns, rows, fileName, fileType='csv', useHeaders=true) {
    const responseTypes = {
        'csv': 'text/csv;charset=utf-8;',
        'tsv': 'text/tab-separated-values,'
    }

    const separators = {
        'csv': ',',
        'tsv': '\t'
    }

    const separator = separators[fileType]
    const headers = columns.map(x => x.label).join(separator) + '\n';

    const valueGetter = (c) => {
      if (c.fmtr === 'link') {
          return a => a[c.key].display
      } else {
          return a => a[c.key]
      }
    }

    const getters = columns.map(c => valueGetter(c))

    const make_row = (a)=> {
      var out = getters.map(g => g(a)).join(separator) +'\n';
      return out;
    };

    var body = rows.map(row => make_row(row)).join("");
    var csvData = new Blob(
        [useHeaders === true ? headers.concat(body) : body],
        {type: responseTypes[fileType]}
    );

    var csvURL =  null;
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