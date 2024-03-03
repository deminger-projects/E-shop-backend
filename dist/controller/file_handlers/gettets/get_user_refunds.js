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
function get_user_refunds(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([(0, write_json_1.default)(["SELECT refunds.id, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode,DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE (refunds.status = 'Active' OR refunds.status = 'Accepted') AND orders.user_id = " + id + " ;",
                "SELECT order_products.size, order_products.amount, order_products.prize, product_images.image_url, products.name, products.id as product_id, refunds.id FROM order_products JOIN products ON products.id = order_products.product_id JOIN product_images ON product_images.product_id = order_products.product_id JOIN refunds ON refunds.order_id = order_products.order_id WHERE product_images.image_url LIKE '%_main%' AND refunds.status = 'ACTIVE' AND refunds.id = $;"], "../client/src/data/user_refunds.json")]);
    });
}
exports.default = get_user_refunds;
