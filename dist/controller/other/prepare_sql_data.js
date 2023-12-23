"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare_sql_data = void 0;
function prepare_sql_data(data) {
    var tables = Object.keys(data);
    var collums_values = Object.values(data);
    var collums = [];
    var values = [];
    collums_values.forEach((element) => {
        collums.push(Object.keys(element));
        values.push(Object.values(element));
    });
    return { tables: tables, collums: collums, collums_values: values };
}
exports.prepare_sql_data = prepare_sql_data;
