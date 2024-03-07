"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_data_transformer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const records = JSON.parse(req.body.tables);
    var tables = Object.keys(records);
    var columns = [];
    var values = [];
    for (var table_data of Object.values(records)) {
        let data = table_data;
        columns.push(Object.keys(data));
        values.push(Object.values(data));
    }
    var where_cols = [];
    var where_vals = [];
    var email = "";
    for (let table_colunm_index = 0; table_colunm_index < columns.length; table_colunm_index++) { //create where conditions
        for (let column_index = 0; column_index < columns[table_colunm_index].length; column_index++) {
            if (columns[table_colunm_index][column_index] === "email" || columns[table_colunm_index][column_index] === "email$") {
                email = values[table_colunm_index][column_index];
            }
            if (table_colunm_index === 0) {
                if (columns[table_colunm_index][column_index].slice(-1) === "$") {
                    columns[table_colunm_index][column_index] = columns[table_colunm_index][column_index].slice(0, -1);
                    where_cols.push(columns[table_colunm_index][column_index]);
                    where_vals.push(values[table_colunm_index][column_index]);
                }
            }
            else {
                if (columns[table_colunm_index][column_index].slice(-1) === "$") {
                    columns[table_colunm_index][column_index] = columns[table_colunm_index][column_index].slice(0, -1);
                }
            }
        }
    }
    var new_values = [];
    for (let index = 0; index < values.length; index++) { //creates values in preferable format
        var is_arr = false;
        var arr_len = 0;
        for (let val_index = 0; val_index < values[index].length; val_index++) {
            if (typeof values[index][val_index] === "object" && values[index][val_index] !== null) {
                is_arr = true;
                var arr_len = values[index][val_index].length;
                break;
            }
        }
        if (!is_arr) {
            new_values.push([values[index]]);
        }
        else {
            var new_values2 = [];
            for (let index2 = 0; index2 < arr_len; index2++) {
                var temp_arr = [];
                for (let val_index = 0; val_index < values[index].length; val_index++) {
                    if (typeof values[index][val_index] === "object" && values[index][val_index] !== null) {
                        temp_arr.push(values[index][val_index][index2]);
                    }
                    else {
                        temp_arr.push(values[index][val_index]);
                    }
                }
                new_values2.push(temp_arr);
            }
            new_values.push(new_values2);
        }
    }
    req.body.transformed_data = { tables: tables, columns: columns, values: new_values, wheres: { columns: where_cols, values: where_vals }, email: email };
    next();
});
exports.default = request_data_transformer;
