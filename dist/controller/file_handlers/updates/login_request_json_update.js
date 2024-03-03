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
const get_avaible_returns_js_1 = __importDefault(require("../gettets/get_avaible_returns.js"));
const get_login_data_js_1 = __importDefault(require("../gettets/get_login_data.js"));
const get_user_data_js_1 = __importDefault(require("../gettets/get_user_data.js"));
const get_user_orders_js_1 = __importDefault(require("../gettets/get_user_orders.js"));
const get_user_refunds_js_1 = __importDefault(require("../gettets/get_user_refunds.js"));
function login_request_json_update(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, get_user_data_js_1.default)(id);
        yield (0, get_user_orders_js_1.default)(id);
        yield (0, get_login_data_js_1.default)(id);
        yield (0, get_user_refunds_js_1.default)(id);
        yield (0, get_avaible_returns_js_1.default)(id);
    });
}
exports.default = login_request_json_update;
