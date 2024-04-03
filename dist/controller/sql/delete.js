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
const pool_1 = require("../../DB/pool");
function sql_delete(table, column, value) {
    return __awaiter(this, void 0, void 0, function* () {
        var sql = "DELETE FROM " + table + " WHERE " + column + " = ?;";
        return new Promise((resolve, reject) => {
            pool_1.pool.getConnection((conn_err, conn) => {
                if (conn_err) {
                    console.log("🚀 ~ file: sql_select.ts:22 ~ pool.getConnection ~ conn_err:", conn_err.message);
                }
                else {
                    conn.query(sql, [value], (err, result) => {
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
    });
}
exports.default = sql_delete;
