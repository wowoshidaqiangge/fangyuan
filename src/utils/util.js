export function export2Excel(columns, list, excelname) {
    require.ensure([], () => {
        const { export_json_to_excel } = require('../excel/Export2Excel');
        let tHeader = [];
        let filterVal = [];
        console.log(columns);
        if (!columns) {
            return;
        }
        columns.forEach(item => {
            tHeader.push(item.label);
            filterVal.push(item.prop);
        });
        const data = list.map(v => filterVal.map(j => v[j]));
        export_json_to_excel(tHeader, data, excelname);
    });
}

export function sessionSetStore(name, content) {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
}

export function sessionGetStore(name) {
    if (!name) return;
    return window.sessionStorage.getItem(name);
}

export function sessionRemoveStore(name) {
    if (!name) return;
    window.sessionStorage.removeItem(name);
}
