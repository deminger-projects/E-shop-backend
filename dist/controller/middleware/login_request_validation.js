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
const bcrypt = require('bcrypt');
const login_request_validation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var email_test_result = yield (0, select_request_1.default)("SELECT * FROM users WHERE email = ? ;", [req.body.transformed_data.email]);
    if (email_test_result.length <= 0) {
        return next(new Error("email not in system"));
    }
    var password_in_db = email_test_result[0].password;
    const data = req.body.transformed_data;
    var is_match = yield bcrypt.compare(data.password, password_in_db);
    if (!is_match) {
        return next(new Error("wrong password"));
    }
    req.body.login_request_validation = { msg: "correct data for login", next_status: true, user_id: email_test_result[0].id, user_data: email_test_result[0] };
    next();
});
exports.default = login_request_validation;
