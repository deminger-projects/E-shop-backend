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
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_json_files = void 0;
const write_json_js_1 = require("./write_json.js");
function update_json_files(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id) {
            yield Promise.all([
                //products
                (0, write_json_js_1.write_json)(["SELECT products.id, products.name as product_name, products.price, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';", "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = ? ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = ? ;"], "../client/src/data/products.json"),
                //collections
                (0, write_json_js_1.write_json)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = ? ;"], "../client/src/data/collections.json"),
                //orders
                (0, write_json_js_1.write_json)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date, orders.status FROM orders;", "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = ? ;"], "../client/src/data/orders.json"),
                //refunds
                (0, write_json_js_1.write_json)(["SELECT refunds.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE refunds.status = 'Active' OR refunds.status = 'Accepted' ;", "SELECT refund_products.product_id, refunds.id, refund_products.amount, refund_products.size, order_products.prize, products.name, refund_reasons.reason FROM refund_products JOIN refunds ON refunds.id = refund_products.refund_id JOIN orders ON orders.id = refunds.order_id JOIN order_products ON order_products.order_id = orders.id JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_products.reason_id = refund_reasons.id WHERE refunds.id = ? GROUP BY refund_products.product_id, refund_products.amount, refund_products.size, order_products.prize, products.name;"], "../client/src/data/refunds.json"),
                //refund reasons
                (0, write_json_js_1.write_json)(["SELECT refund_reasons.id, refund_reasons.reason from refund_reasons"], "../client/src/data/reasons.json"),
                //collections (with products)
                (0, write_json_js_1.write_json)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%' AND (SELECT COUNT(products.id) FROM products WHERE products.collection_id = collections.id AND products.status = 'Active');", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = ? ;"], "../client/src/data/collections_NN.json"),
                //user data
                (0, write_json_js_1.write_json)(["SELECT users.id, users.username, users.email, users.password FROM users WHERE users.id = " + id + ";", "SELECT user_data.id, user_data.user_id, user_data.name, user_data.surname, user_data.phone, user_data.adress, user_data.city, user_data.postcode, user_data.status FROM user_data WHERE user_id = " + id + " AND status = 'Active';"], "../client/src/data/user_data.json"),
                //user orders
                (0, write_json_js_1.write_json)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date, CASE WHEN (SELECT COUNT(refunds.id) FROM refunds WHERE (refunds.status = 'Active') AND refunds.order_id = orders.id) >= 1 THEN (SELECT refunds.id FROM refunds WHERE refunds.status = 'Active' AND refunds.order_id = orders.id) WHEN (SELECT COUNT(refunds.id) FROM refunds WHERE (refunds.status = 'Accepted') AND refunds.order_id = orders.id) >= 1 THEN 'cancel' ELSE 'null'END as refund_status FROM orders LEFT JOIN refunds ON refunds.order_id = orders.id WHERE user_id = " + id + " GROUP BY orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date;", "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize FROM order_products JOIN products on order_products.product_id = products.id WHERE order_id = ?"], "../client/src/data/user_orders.json"),
                //login_data
                (0, write_json_js_1.write_json)(["SELECT users.id, users.username, users.password, users.login_status from users WHERE users.id = " + id + ";"], "../client/src/data/login_data.json"),
                //user_refunds
                (0, write_json_js_1.write_json)(["SELECT orders.id, refunds.id as refund_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date, CASE WHEN (SELECT COUNT(refunds.id) FROM refunds WHERE refunds.status = 'Active' AND refunds.order_id = orders.id) >= 1 THEN (SELECT refunds.id FROM refunds WHERE refunds.status = 'Active' AND refunds.order_id = orders.id) WHEN (SELECT COUNT(refunds.id) FROM refunds WHERE (refunds.status = 'Accepted') AND refunds.order_id = orders.id) >= 1 THEN 'cancel' ELSE 'null' END as refund_status FROM refunds JOIN orders WHERE orders.user_id = " + id + " AND (refunds.status = 'Active' OR refunds.status = 'Accepted') AND refunds.order_id = orders.id GROUP BY orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date;", "SELECT refund_products.id, products.name, refund_products.amount, refund_reasons.reason, order_products.prize, refund_products.size FROM refund_products JOIN refunds ON refunds.id = refund_products.refund_id JOIN orders ON refunds.order_id = orders.id JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_reasons.id = refund_products.reason_id JOIN order_products ON order_products.order_id = refunds.order_id WHERE orders.id = ? GROUP BY refund_products.id, products.name, refund_products.amount, refund_reasons.reason;"], "../client/src/data/user_refunds.json"),
            ]);
        }
        else {
            yield Promise.all([
                //products
                (0, write_json_js_1.write_json)(["SELECT products.id, products.name as product_name, products.price, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';", "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = ? ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = ? ;"], "../client/src/data/products.json"),
                //collections
                (0, write_json_js_1.write_json)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = ? ;"], "../client/src/data/collections.json"),
                //orders
                (0, write_json_js_1.write_json)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date, orders.status FROM orders;", "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = ? ;"], "../client/src/data/orders.json"),
                //refunds
                (0, write_json_js_1.write_json)(["SELECT refunds.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE refunds.status = 'Active' OR refunds.status = 'Accepted' ;", "SELECT refund_products.product_id, refunds.id, refund_products.amount, refund_products.size, order_products.prize, products.name, refund_reasons.reason FROM refund_products JOIN refunds ON refunds.id = refund_products.refund_id JOIN orders ON orders.id = refunds.order_id JOIN order_products ON order_products.order_id = orders.id JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_products.reason_id = refund_reasons.id WHERE refunds.id = ? GROUP BY refund_products.product_id, refund_products.amount, refund_products.size, order_products.prize, products.name;"], "../client/src/data/refunds.json"),
                //refund reasons
                (0, write_json_js_1.write_json)(["SELECT refund_reasons.id, refund_reasons.reason from refund_reasons"], "../client/src/data/reasons.json"),
                //collections (with products)
                (0, write_json_js_1.write_json)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%' AND (SELECT COUNT(products.id) FROM products WHERE products.collection_id = collections.id AND products.status = 'Active');", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = ? ;"], "../client/src/data/collections_NN.json"),
            ]);
        }
    });
}
exports.update_json_files = update_json_files;
// module.exports = {update_json_files}
