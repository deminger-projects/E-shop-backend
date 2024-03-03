"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_request_1 = __importDefault(require("../../DB/delete_request"));
function new_delete_test(table, column, record_id) {
    var sql = "DELETE FROM " + table + " WHERE " + column + " = ? ;";
    var result = (0, delete_request_1.default)(sql, [record_id.toString()]);
}
exports.default = new_delete_test;
