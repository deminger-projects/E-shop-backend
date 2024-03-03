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
const write_json_1 = __importDefault(require("../../write_json"));
function get_refunds_for_user_place_refunds(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([(0, write_json_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders WHERE orders.add_date + INTERVAL -30 DAY <= NOW() && user_id = " + id + " && (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status != 'Cancled') < 1;",
                "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"], "../client/src/data/refund_test.json")]);
    });
}
exports.default = get_refunds_for_user_place_refunds;
