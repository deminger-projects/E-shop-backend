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
const login_request_validation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var email_test_result = yield (0, select_request_1.default)("SELECT * FROM users WHERE email = ? ;", [req.body.transformed_data.email]);
    if (email_test_result.length <= 0) {
        return next(new Error("email not in system"));
    }
    const data = req.body.transformed_data;
    var where_conditions = "";
    for (let index = 0; index < data.wheres.columns.length; index++) {
        if (data.wheres.columns.length - 1 === index) {
            where_conditions += data.wheres.columns[index] + " = ?";
        }
        else {
            where_conditions += data.wheres.columns[index] + " = ? AND ";
        }
    }
    var sql = "SELECT * FROM " + data.tables[0] + " WHERE " + where_conditions + ";";
    var psw_test_result = yield (0, select_request_1.default)(sql, data.wheres.values);
    if (psw_test_result.length <= 0) {
        return next(new Error("wrong password"));
    }
    req.body.login_request_validation = { msg: "correct data for login", next_status: true, user_id: psw_test_result[0].id, user_data: psw_test_result };
    next();
});
exports.default = login_request_validation;
