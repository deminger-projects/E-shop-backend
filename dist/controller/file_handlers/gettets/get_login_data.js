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
const write_json_1 = __importDefault(require("../write_json"));
function get_login_data(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([(0, write_json_1.default)(["SELECT users.id, users.username, users.password, users.login_status from users WHERE users.id = " + id + " ;"], "../client/src/data/login_data.json")]);
    });
}
exports.default = get_login_data;
