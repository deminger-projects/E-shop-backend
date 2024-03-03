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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inserts_1 = __importDefault(require("../../sql/inserts"));
const check_duplicity_1 = __importDefault(require("../../other/check_duplicity"));
const transform_records_js_1 = __importDefault(require("../../other/transform_records.js"));
function save_records(records) {
    return __awaiter(this, void 0, void 0, function* () {
        var last_inserted_id = "";
        var dup_check_result;
        var new_data = (0, transform_records_js_1.default)(records);
        for (let table_index = 0; table_index < new_data.tables.length; table_index++) {
            if (table_index === 0) {
                dup_check_result = yield (0, check_duplicity_1.default)(new_data);
                if (!dup_check_result.status) {
                    var last_inserted_id = yield (0, inserts_1.default)(new_data.tables[table_index], new_data.columns[table_index], new_data.values[table_index]);
                }
                else {
                    return ({ status: false, msg: dup_check_result.msg, duplicit_value: true });
                }
            }
            else {
                yield (0, inserts_1.default)(new_data.tables[table_index], new_data.columns[table_index], new_data.values[table_index], last_inserted_id);
            }
        }
        return { status: true, msg: "no duplicit value", last_inserted_id: last_inserted_id, duplicit_value: false };
    });
}
exports.default = save_records;
