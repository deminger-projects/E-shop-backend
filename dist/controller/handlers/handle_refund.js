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
const select_1 = __importDefault(require("../../model/sql/select"));
const check_duplicity_1 = __importDefault(require("../other/check_duplicity"));
const send_emails_1 = __importDefault(require("../other/send_emails"));
const transform_records_1 = __importDefault(require("../other/transform_records"));
function handle_refund(records, email) {
    return __awaiter(this, void 0, void 0, function* () {
        var new_data = (0, transform_records_1.default)(records);
        var dup_check_result = yield (0, check_duplicity_1.default)(new_data);
        if (dup_check_result.status) {
            var order_id = new_data.wheres.values[0];
            var res = yield (0, select_1.default)("SELECT refunds.id FROM refunds WHERE status = 'Active' AND order_id = " + order_id + ";");
            if (res.length === 0) {
                var code = Math.floor(100000 + Math.random() * 900000).toString();
                (0, send_emails_1.default)([email], code);
                var data = yield (0, select_1.default)("SELECT products.id, products.name, order_products.size, order_products.amount, order_products.prize FROM order_products JOIN products ON products.id = order_products.product_id WHERE order_id = " + order_id + ";");
                return { msg: "order does exist", status: true, code: code, data: data };
            }
            else {
                return { msg: "refund already placed", status: false };
            }
        }
        return { msg: "order does not exists", status: false };
    });
}
exports.default = handle_refund;
