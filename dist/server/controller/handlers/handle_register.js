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
exports.handle_register = void 0;
const sql_inserts_1 = require("../add/sql_inserts");
const check_duplicity_1 = require("../other/check_duplicity");
const transform_records_1 = require("../other/transform_records");
function handle_register(records) {
    return __awaiter(this, void 0, void 0, function* () {
        var new_data = (0, transform_records_1.transform_records)(records);
        var check_dup_result = yield (0, check_duplicity_1.check_duplicity)(new_data, undefined, "register");
        if (!check_dup_result.status) {
            for (let index = 0; index < new_data.tables.length; index++) {
                var result = yield (0, sql_inserts_1.sql_inserts)(new_data.tables[index], new_data.columns[index], new_data.values[index]);
                return { status: check_dup_result.status, msg: check_dup_result.msg, user_id: result.insertId };
            }
        }
        return { status: check_dup_result.status, msg: check_dup_result.msg };
    });
}
exports.handle_register = handle_register;
