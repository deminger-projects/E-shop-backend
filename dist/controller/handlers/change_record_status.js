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
exports.change_record_status = void 0;
const transform_records_1 = require("../other/transform_records");
const sql_update_1 = require("../edit/sql_update");
function change_record_status(records, record_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var new_data = (0, transform_records_1.transform_records)(records);
        var result = yield (0, sql_update_1.sql_update)(new_data.tables[0], new_data.columns[0], new_data.values[0][0], record_id);
        console.log("🚀 ~ file: change_record_status.ts:9 ~ change_record_status ~ x:", result);
    });
}
exports.change_record_status = change_record_status;
