"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.write_json = void 0;
const fs = __importStar(require("fs"));
const sql_select_js_1 = require("../../model/sql_select.js");
function write_json(sql_tasks, file) {
    return __awaiter(this, void 0, void 0, function* () {
        var prom_arr = [];
        var results = yield (0, sql_select_js_1.sql_select)(sql_tasks[0]); // creates data formath with side data
        for (var res of results) {
            var task_arr = [];
            for (let index = 1; index <= sql_tasks.length - 1; index++) {
                task_arr.push(yield (0, sql_select_js_1.sql_select)(sql_tasks[index].replace("?", "'" + res.id + "'")));
            }
            var record_side_data_arr = (yield Promise.all(task_arr));
            record_side_data_arr.unshift([res]);
            prom_arr.push(record_side_data_arr);
        }
        fs.writeFile(file, JSON.stringify(prom_arr), { encoding: "utf8" }, (err) => {
            if (err) {
                console.error('file write error: ' + err);
            }
            console.log('Successfully wrote file: ' + file);
        });
    });
}
exports.write_json = write_json;
