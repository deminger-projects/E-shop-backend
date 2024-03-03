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
const select_request_1 = __importDefault(require("../../DB/select_request"));
function refund_request_validation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = "SELECT * FROM refunds WHERE order_id = ?;";
        const result = yield (0, select_request_1.default)(sql, req.body.order_data[0].id);
        if (result.length > 0) {
            return next(new Error("refund allready placed"));
        }
        next();
    });
}
exports.default = refund_request_validation;
