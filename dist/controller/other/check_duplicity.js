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
function check_duplicity(data, record_id, type) {
    return __awaiter(this, void 0, void 0, function* () {
        var values = [];
        if (data.wheres.columns.length === 0) {
            return new Promise((resolve, reject) => { resolve({ msg: "duplicity check did not run", status: false }); });
        }
        else if (!record_id) {
            if (type === "login") {
                var sql = "SELECT * FROM " + data.tables[0] + " WHERE login_status = 'Inactive'";
            }
            else if (type === "register") {
                var sql = "SELECT * FROM " + data.tables[0] + " WHERE (login_status = 'Inactive' OR login_status = 'Active')";
            }
            else {
                var sql = "SELECT * FROM " + data.tables[0] + " WHERE status = 'Active'";
            }
        }
        else {
            var sql = "SELECT * FROM " + data.tables[0] + " WHERE id != " + record_id;
        }
        for (let index = 0; index < data.wheres.columns.length; index++) {
            if (index === data.wheres.columns.length - 1) {
                sql += " AND " + data.wheres.columns[index] + " = ?";
            }
            else {
                sql += " AND " + data.wheres.columns[index] + " = ?";
            }
            values.push(data.wheres.values[index]);
        }
        return new Promise((resolve, reject) => {
            pool_1.pool.getConnection((conn_err, conn) => {
                if (conn_err) {
                    console.log("🚀 ~ file: sql_select.ts:22 ~ pool.getConnection ~ conn_err:", conn_err.message);
                }
                else {
                    conn.query(sql, values, (err, result) => {
                        conn.release();
                        if (err) {
                            console.log("🚀 ~ file: sql_select.ts:21 ~ pool.query ~ err:", err.message);
                        }
                        else {
                            if (result.length === 0) {
                                resolve({ msg: "no duplicit value", status: false });
                            }
                            else {
                                resolve({ msg: "record is in db allready", status: true, record_id: result[0].id });
                            }
                        }
                    });
                }
            });
        });
    });
}
exports.default = check_duplicity;
