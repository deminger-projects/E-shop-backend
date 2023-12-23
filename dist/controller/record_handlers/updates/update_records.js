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
const delete_1 = __importDefault(require("../../sql/delete"));
const check_duplicity_1 = __importDefault(require("../../other/check_duplicity"));
const transform_records_1 = __importDefault(require("../../other/transform_records"));
const update_1 = __importDefault(require("../../sql/update"));
function update_records(records, record_id, file_names_to_keep) {
    return __awaiter(this, void 0, void 0, function* () {
        var new_data = (0, transform_records_1.default)(records);
        for (let index = 0; index < new_data.tables.length; index++) {
            if (index === 0) {
                if (!((yield (0, check_duplicity_1.default)(new_data, record_id)).status)) {
                    (0, update_1.default)(new_data.tables[0], new_data.columns[0], new_data.values[0][0], record_id);
                }
                else {
                    return { status: false, msg: "duplicit value", duplicit_value: true };
                }
            }
            else {
                if (file_names_to_keep) {
                    if (new_data.tables[index].includes("image")) {
                        for (let my_index = 0; my_index < file_names_to_keep.length; my_index++) {
                            new_data.values[index].push([record_id.toString(), file_names_to_keep[my_index]]);
                        }
                    }
                }
                yield (0, delete_1.default)(new_data.tables[index], (new_data.tables[index].split("_"))[0] + "_id", record_id);
                (0, inserts_1.default)(new_data.tables[index], new_data.columns[index], new_data.values[index]);
            }
        }
        return { status: true, msg: "records updated", duplicit_value: false };
    });
}
exports.default = update_records;
