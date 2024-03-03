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
const update_records_1 = __importDefault(require("../record_handlers/updates/update_records"));
const update_files_1 = __importDefault(require("../file_handlers/updates/update_files"));
function handle_edit(records, record_id, file_names_to_keep, folder, files) {
    return __awaiter(this, void 0, void 0, function* () {
        var update_records_responce = yield (0, update_records_1.default)(records, record_id, file_names_to_keep);
        if (update_records_responce.status === false) {
            return { status: false, msg: "records did not updated/duplicit value", duplicit_value: update_records_responce.duplicit_value };
        }
        else if (update_records_responce.status === true && file_names_to_keep && folder && files) {
            yield (0, update_files_1.default)(file_names_to_keep, folder, record_id, files);
            return { status: true, msg: "records updated", duplicit_value: update_records_responce.duplicit_value };
        }
        else if (update_records_responce.status === true) {
            return { status: true, msg: "records update", duplicit_value: update_records_responce.duplicit_value };
        }
        else {
            return { status: false, msg: "records update failed", duplicit_value: update_records_responce.duplicit_value };
        }
    });
}
exports.default = handle_edit;
