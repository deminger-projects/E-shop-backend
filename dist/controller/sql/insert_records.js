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
const insert_request_1 = __importDefault(require("../../DB/insert_request"));
function insert_records(tables, columns, values) {
    return __awaiter(this, void 0, void 0, function* () {
        var sql_inserts = [];
        for (let table_index = 0; table_index < tables.length; table_index++) {
            var columns_string = "";
            for (let columns_index = 0; columns_index < columns[table_index].length; columns_index++) {
                if (columns_index === columns[table_index].length - 1) {
                    columns_string += columns[table_index][columns_index];
                }
                else {
                    columns_string += columns[table_index][columns_index] + ", ";
                }
            }
            var sql = "INSERT INTO " + tables[table_index] + " (" + columns_string + ") VALUES ?";
            sql_inserts.push(sql);
        }
        var record_id;
        for (let query_index = 0; query_index < tables.length; query_index++) {
            if (query_index === 0) {
                console.log(sql_inserts[query_index], [values[query_index]]);
                const result = yield (0, insert_request_1.default)(sql_inserts[query_index], [values[query_index]]);
                record_id = result.last_inseted_id;
            }
            else {
                for (let values_index = 0; values_index < values[query_index].length; values_index++) {
                    for (let values_content_index = 0; values_content_index < values[query_index][values_index].length; values_content_index++) {
                        if (values[query_index][values_index][values_content_index] === null) {
                            values[query_index][values_index][values_content_index] = record_id.toString();
                        }
                    }
                }
                yield (0, insert_request_1.default)(sql_inserts[query_index], [values[query_index]]);
            }
        }
        return record_id;
    });
}
exports.default = insert_records;
