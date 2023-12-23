"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("../../DB/pool");
function sql_update(table, columns, values, record_id) {
    var seter = "";
    for (let index = 0; index < columns.length; index++) {
        if (values[index] === null) {
            values.splice(index, 1);
            continue;
        }
        else {
            if (columns.length - 1 === index) {
                seter += columns[index] + " = ? ";
            }
            else {
                seter += columns[index] + " = ? , ";
            }
        }
    }
    values.push(record_id.toString());
    var sql = "UPDATE " + table + " SET " + seter + "WHERE id = ? ;";
    return new Promise((resolve, reject) => {
        pool_1.pool.getConnection((conn_err, conn) => {
            if (conn_err) {
                console.log("🚀 ~ file: sql_select.ts:22 ~ pool.getConnection ~ conn_err:", conn_err.message);
            }
            else {
                conn.query(sql, values, (err, result, fiels) => {
                    conn.release();
                    if (err) {
                        console.log("🚀 ~ file: sql_select.ts:21 ~ pool.query ~ err:", err.message);
                    }
                    else {
                        resolve({ affected_rows: result.affectedRows, msg: "records deleted" });
                    }
                });
            }
        });
    });
}
exports.default = sql_update;
