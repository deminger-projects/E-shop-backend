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
const check_for_duplicit_record = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (data.wheres.columns.length <= 0) {
        if (req.body.record_id) {
            var sql = "SELECT * FROM " + data.tables[0] + " WHERE id != " + req.body.record_id + ";";
        }
        else {
            var sql = "SELECT * FROM " + data.tables[0] + ";";
        }
    }
    else {
        if (req.body.record_id) {
            var sql = "SELECT * FROM " + data.tables[0] + " WHERE " + where_conditions + " AND id != " + req.body.record_id + ";";
        }
        else {
            var sql = "SELECT * FROM " + data.tables[0] + " WHERE " + where_conditions + ";";
        }
    }
    const result = yield (0, select_request_1.default)(sql, data.wheres.values);
    if (req.body.refund) {
        if (result.length <= 0) {
            return next(new Error("incorect email or order id"));
        }
        else {
            req.body.order_data = result;
            return next();
        }
    }
    else if (req.body.auth_code) {
        if (result.length <= 0) {
            return next(new Error("user not found"));
        }
        else {
            req.body.user_id_auth = result[0].id;
            return next();
        }
    }
    else if (req.body.psw_change || req.body.order) {
        return next();
    }
    else {
        if (result.length > 0) {
            return next(new Error("record already in system"));
        }
    }
    next();
});
exports.default = check_for_duplicit_record;
