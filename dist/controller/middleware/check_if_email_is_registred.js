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
const query_request_1 = __importDefault(require("../../DB/query_request"));
const check_if_email_is_registred = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var result = yield (0, query_request_1.default)("SELECT * FROM users WHERE email = ? ;", [req.body.transformed_data.email]);
    if (result.length > 0) {
        req.body.is_email_registred = { is_registred: true, msg: "email already registred" };
    }
    else {
        req.body.is_email_registred = { is_registred: false, msg: "email not registred" };
    }
    next();
});
exports.default = check_if_email_is_registred;
