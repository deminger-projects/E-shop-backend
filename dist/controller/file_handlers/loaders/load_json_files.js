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
function load_json_files() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            //products
            (0, write_json_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';", "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"], "../client/src/data/products.json"),
            //collections
            (0, write_json_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $ ;"], "../client/src/data/collections.json"),
            //orders
            (0, write_json_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders;", "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = $ ;"], "../client/src/data/orders.json"),
            //refunds
            (0, write_json_1.default)(["SELECT refunds.id, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE refunds.status = 'Active' OR refunds.status = 'Accepted' ;", "SELECT refund_products.product_id, refund_products.amount, refund_products.size, products.name, refund_reasons.reason, products.price FROM refund_products JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_reasons.id = refund_products.reason_id JOIN refunds ON refunds.id = refund_products.refund_id WHERE refunds.id = $ ;"], "../client/src/data/refunds.json"),
            //refund reasons
            (0, write_json_1.default)(["SELECT refund_reasons.id, refund_reasons.reason from refund_reasons"], "../client/src/data/reasons.json"),
            //collections (with products)
            (0, write_json_1.default)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%' AND (SELECT COUNT(products.id) FROM products WHERE products.collection_id = collections.id AND products.status = 'Active');", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $ ;"], "../client/src/data/collections_NN.json"),
            // new collections
            (0, write_json_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"], "../client/src/data/new_collections.json")
        ]);
    });
}
exports.default = load_json_files;
