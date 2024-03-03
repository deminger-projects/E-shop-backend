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
const check_duplicity_1 = __importDefault(require("../other/check_duplicity"));
const send_emails_1 = __importDefault(require("../other/send_emails"));
const transform_records_1 = __importDefault(require("../other/transform_records"));
function handle_send_aut_code(records) {
    return __awaiter(this, void 0, void 0, function* () {
        var new_data = (0, transform_records_1.default)(records);
        var dup_check_result = yield (0, check_duplicity_1.default)(new_data, undefined, 'register');
        if (dup_check_result.status) {
            var code = Math.floor(100000 + Math.random() * 900000).toString();
            (0, send_emails_1.default)([new_data.values[0][0][0]], code);
            return { msg: "email is in sytem, code send", status: true, code: code, record_id: dup_check_result.record_id };
        }
        return { msg: "email in not in system", status: false };
    });
}
exports.default = handle_send_aut_code;
