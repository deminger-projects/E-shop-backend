"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_files = void 0;
const rimraf_1 = __importDefault(require("rimraf"));
function delete_files(path) {
    rimraf_1.default.sync(path);
}
exports.delete_files = delete_files;
//module.exports = {delete_files}
