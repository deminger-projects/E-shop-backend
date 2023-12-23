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
const transform_records_1 = __importDefault(require("../other/transform_records"));
const update_1 = __importDefault(require("../sql/update"));
function handle_status_change(records, record_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var new_data = (0, transform_records_1.default)(records);
        var result = yield (0, update_1.default)(new_data.tables[0], new_data.columns[0], new_data.values[0][0], record_id);
        if (result.affected_rows >= 1) {
            return { status: true, msg: "update done" };
        }
        return { status: false, msg: "update failed" };
    });
}
exports.default = handle_status_change;
