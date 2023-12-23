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
exports.handle_add_records = void 0;
const save_records_js_1 = require("../add/save_records.js");
const save_files_js_1 = require("../files_handlers/save_files.js");
function handle_add_records(records, files, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield (0, save_records_js_1.save_records)(records, (err) => {
            if (err) {
                console.log("sql inserts error: " + err);
            }
        });
        if (files && result.status === true) {
            (0, save_files_js_1.save_files)("../client/public/images/" + folder + "/" + result.last_inserted_id, files, (err) => {
                if (err) {
                    console.log("save_files error: " + err);
                }
            });
        }
    });
}
exports.handle_add_records = handle_add_records;
