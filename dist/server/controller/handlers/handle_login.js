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
exports.handle_login = void 0;
const sql_update_1 = require("../edit/sql_update");
const check_duplicity_1 = require("../other/check_duplicity");
const transform_records_1 = require("../other/transform_records");
function handle_login(records, record_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var new_data = (0, transform_records_1.transform_records)(records);
        var check_dup_result = yield (0, check_duplicity_1.check_duplicity)(new_data, undefined, "login");
        if (check_dup_result.status === true && check_dup_result.record_id) {
            yield (0, sql_update_1.sql_update)(new_data.tables[0], new_data.columns[0], new_data.values[0][0], check_dup_result.record_id);
            return { status: check_dup_result.status, msg: check_dup_result.msg, user_id: check_dup_result.record_id };
        }
        return { status: check_dup_result.status, msg: check_dup_result.msg };
    });
}
exports.handle_login = handle_login;
