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
const delete_request_1 = __importDefault(require("../../DB/delete_request"));
const update_request_1 = __importDefault(require("../../DB/update_request"));
const insert_records_1 = __importDefault(require("./insert_records"));
function update_records(tables, columns, values, record_id, file_names_to_keep) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let table_index = 0; table_index < tables.length; table_index++) {
            if (table_index === 0) {
                var columns_string = '';
                for (let columns_index = 0; columns_index < columns[table_index].length; columns_index++) {
                    if (columns_index === columns[table_index].length - 1) {
                        columns_string += columns[table_index][columns_index] + " = ? ";
                    }
                    else {
                        columns_string += columns[table_index][columns_index] + " = ?, ";
                    }
                }
                var sql = "UPDATE " + tables[table_index] + " SET " + columns_string + "WHERE id = " + record_id + " ;";
                yield (0, update_request_1.default)(sql, values[table_index][0]);
            }
            else {
                var sql = "DELETE FROM " + tables[table_index] + " WHERE " + columns[table_index][0] + " = ?;";
                yield (0, delete_request_1.default)(sql, [record_id.toString()]);
                if (file_names_to_keep && tables[table_index].includes("image")) {
                    for (let index = 0; index < file_names_to_keep.length; index++) {
                        values[table_index].push([record_id.toString(), file_names_to_keep[index]]);
                    }
                }
                yield (0, insert_records_1.default)([tables[table_index]], [columns[table_index]], [values[table_index]]);
            }
        }
    });
}
exports.default = update_records;
