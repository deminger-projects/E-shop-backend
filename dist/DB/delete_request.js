"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("./pool");
function delete_request(sql, values) {
    return new Promise((resolve, reject) => {
        pool_1.pool.getConnection((conn_err, conn) => {
            if (conn_err) {
                console.log("delete_request; 🚀 ~ pool.getConnection ~ conn_err:", conn_err.message);
            }
            else {
                conn.query(sql, values, (err, result, fiels) => {
                    conn.release();
                    if (err) {
                        console.log("delete_request; 🚀 ~ conn.query ~ err:", err.message);
                    }
                    else {
                        resolve(result);
                    }
                });
            }
        });
    });
}
exports.default = delete_request;
