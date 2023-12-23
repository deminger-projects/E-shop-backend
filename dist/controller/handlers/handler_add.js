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
const save_records_js_1 = __importDefault(require("../record_handlers/savers/save_records.js"));
const save_files_js_1 = __importDefault(require("../file_handlers/savers/save_files.js"));
function handle_add(records, files, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        var save_records_responce = yield (0, save_records_js_1.default)(records);
        if (save_records_responce.status === false) {
            return { status: false, msg: "records did not save", duplicit_value: save_records_responce.duplicit_value };
        }
        else if (save_records_responce.status === true && files) {
            yield (0, save_files_js_1.default)("../client/public/images/" + folder + "/" + save_records_responce.last_inserted_id, files);
            return { status: true, msg: "records saved", duplicit_value: save_records_responce.duplicit_value };
        }
        else {
            return { status: false, msg: "records save error" };
        }
    });
}
exports.default = handle_add;
