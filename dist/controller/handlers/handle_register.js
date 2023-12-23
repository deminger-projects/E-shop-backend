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
const inserts_1 = __importDefault(require("../sql/inserts"));
const check_duplicity_1 = __importDefault(require("../other/check_duplicity"));
const transform_records_1 = __importDefault(require("../other/transform_records"));
function handle_register(records) {
    return __awaiter(this, void 0, void 0, function* () {
        var new_data = (0, transform_records_1.default)(records);
        var check_dup_result = yield (0, check_duplicity_1.default)(new_data, undefined, "register");
        if (!check_dup_result.status) {
            for (let index = 0; index < new_data.tables.length; index++) {
                var result = yield (0, inserts_1.default)(new_data.tables[index], new_data.columns[index], new_data.values[index]);
                return { status: check_dup_result.status, msg: check_dup_result.msg, user_id: result };
            }
        }
        return { status: check_dup_result.status, msg: check_dup_result.msg };
    });
}
exports.default = handle_register;
