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
const write_json_js_1 = __importDefault(require("../write_json.js"));
function update_json_files(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id) {
            yield Promise.all([
                //products
                (0, write_json_js_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';", "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"], "../client/src/data/products.json"),
                // //collections
                // write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $ ;"], "../client/src/data/collections.json"),
                //orders
                (0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders;", "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = $ ;"], "../client/src/data/orders.json"),
                //refunds
                (0, write_json_js_1.default)(["SELECT refunds.id, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE refunds.status = 'Active' OR refunds.status = 'Accepted' ;", "SELECT refund_products.product_id, refund_products.amount, refund_products.size, products.name, refund_reasons.reason, products.price FROM refund_products JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_reasons.id = refund_products.reason_id JOIN refunds ON refunds.id = refund_products.refund_id WHERE refunds.id = $ ;"], "../client/src/data/refunds.json"),
                //refund reasons
                (0, write_json_js_1.default)(["SELECT refund_reasons.id, refund_reasons.reason from refund_reasons"], "../client/src/data/reasons.json"),
                //collections (with products)
                (0, write_json_js_1.default)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%' AND (SELECT COUNT(products.id) FROM products WHERE products.collection_id = collections.id AND products.status = 'Active');", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $ ;"], "../client/src/data/collections_NN.json"),
                //user data
                (0, write_json_js_1.default)(["SELECT users.id, users.username, users.email, users.password FROM users WHERE users.id = " + id + " ;", "SELECT user_data.id, user_data.user_id, user_data.name, user_data.surname, user_data.phone, user_data.adress, user_data.city, user_data.postcode, user_data.status, users.email FROM user_data JOIN users ON users.id = user_data.user_id WHERE user_id = " + id + " AND status = 'Active';"], "../client/src/data/user_data.json"),
                //user orders
                (0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status, (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status = 'Active') as refund_count FROM orders WHERE user_id = " + id + ";", "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"], "../client/src/data/user_orders.json"),
                //user orders 30 days old for returns
                (0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status, (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status = 'Active') as refund_count FROM orders WHERE orders.add_date + INTERVAL -30 DAY <= NOW() && user_id = " + id + ";", "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"], "../client/src/data/user_orders_for_returns.json"),
                //login_data
                (0, write_json_js_1.default)(["SELECT users.id, users.username, users.password, users.login_status from users WHERE users.id = " + id + " ;"], "../client/src/data/login_data.json"),
                //user_refunds
                (0, write_json_js_1.default)(["SELECT refunds.id, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode,DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE (refunds.status = 'Active' OR refunds.status = 'Accepted') AND orders.user_id = " + id + " ;", "SELECT order_products.size, order_products.amount, order_products.prize, product_images.image_url, products.name, products.id as product_id, refunds.id FROM order_products JOIN products ON products.id = order_products.product_id JOIN product_images ON product_images.product_id = order_products.product_id JOIN refunds ON refunds.order_id = order_products.order_id WHERE product_images.image_url LIKE '%_main%' AND refunds.status = 'ACTIVE' AND refunds.id = $;"], "../client/src/data/user_refunds.json"),
                // new collections
                (0, write_json_js_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"], "../client/src/data/new_collections.json")
            ]);
        }
        else {
            yield Promise.all([
                //products
                (0, write_json_js_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';", "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"], "../client/src/data/products.json"),
                //collections
                (0, write_json_js_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $ ;"], "../client/src/data/collections.json"),
                //orders
                (0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders;", "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = $ ;"], "../client/src/data/orders.json"),
                //refunds
                (0, write_json_js_1.default)(["SELECT refunds.id, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE refunds.status = 'Active' OR refunds.status = 'Accepted' ;", "SELECT refund_products.product_id, refund_products.amount, refund_products.size, products.name, refund_reasons.reason, products.price FROM refund_products JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_reasons.id = refund_products.reason_id JOIN refunds ON refunds.id = refund_products.refund_id WHERE refunds.id = $ ;"], "../client/src/data/refunds.json"),
                //refund reasons
                (0, write_json_js_1.default)(["SELECT refund_reasons.id, refund_reasons.reason from refund_reasons"], "../client/src/data/reasons.json"),
                //collections (with products)
                (0, write_json_js_1.default)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%' AND (SELECT COUNT(products.id) FROM products WHERE products.collection_id = collections.id AND products.status = 'Active');", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $ ;"], "../client/src/data/collections_NN.json"),
                // new collections
                (0, write_json_js_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"], "../client/src/data/new_collections.json")
            ]);
        }
    });
}
exports.default = update_json_files;
