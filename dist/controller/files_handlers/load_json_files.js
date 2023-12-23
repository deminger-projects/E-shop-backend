"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.load_json_files = void 0;
const mysql = __importStar(require("mysql"));
const write_json_1 = require("./write_json");
function load_json_files() {
    return __awaiter(this, void 0, void 0, function* () {
        var config = {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'eshop_2022',
            connectionLimit: 10
        };
        var connection = mysql.createConnection(config);
        connection.connect((err) => {
            if (err) {
                console.log("connection connect error: " + err);
                throw err;
            }
            else {
                console.log("connected to DB: " + config.database);
            }
        });
        yield Promise.all([
            //products
            (0, write_json_1.write_json)(["SELECT products.id, products.name as product_name, products.price, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';", "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = ? ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = ? ;"], "../client/src/data/products.json"),
            //collections
            (0, write_json_1.write_json)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%';", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = ? ;"], "../client/src/data/collections.json"),
            //orders
            (0, write_json_1.write_json)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date, orders.status FROM orders;", "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = ? ;"], "../client/src/data/orders.json"),
            //refunds
            (0, write_json_1.write_json)(["SELECT refunds.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, orders.add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE refunds.status = 'Active' OR refunds.status = 'Accepted' ;", "SELECT refund_products.product_id, refunds.id, refund_products.amount, refund_products.size, order_products.prize, products.name, refund_reasons.reason FROM refund_products JOIN refunds ON refunds.id = refund_products.refund_id JOIN orders ON orders.id = refunds.order_id JOIN order_products ON order_products.order_id = orders.id JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_products.reason_id = refund_reasons.id WHERE refunds.id = ? GROUP BY refund_products.product_id, refund_products.amount, refund_products.size, order_products.prize, products.name;"], "../client/src/data/refunds.json"),
            //refund reasons
            (0, write_json_1.write_json)(["SELECT refund_reasons.id, refund_reasons.reason from refund_reasons"], "../client/src/data/reasons.json"),
            //collections (with products)
            (0, write_json_1.write_json)(["SELECT collections.id, collections.name, image_url FROM collections JOIN collection_images on collections.id = collection_images.collection_id WHERE collections.status = 'Active' AND collection_images.image_url LIKE '%_main%' AND (SELECT COUNT(products.id) FROM products WHERE products.collection_id = collections.id AND products.status = 'Active');", "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = ? ;"], "../client/src/data/collections_NN.json"),
        ]);
    });
}
exports.load_json_files = load_json_files;
