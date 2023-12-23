"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql"));
function sql_update(table, columns, values, record_id) {
    var seter = "";
    for (let index = 0; index < columns.length; index++) {
        if (values[index] === null) {
            continue;
        }
        else {
            if (columns.length - 1 === index) {
                seter += columns[index] + " = '" + values[index] + "' ";
            }
            else {
                seter += columns[index] + " = '" + values[index] + "', ";
            }
        }
    }
    var sql = "UPDATE " + table + " SET " + seter + "WHERE id = '" + record_id + "';";
    var config = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'eshop_2022'
    };
    var connection = mysql.createConnection(config);
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err) {
                console.log("🚀 ~ file: sql_update.ts:34 ~ connection.query ~ err:", err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.default = sql_update;
