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
exports.router = void 0;
const express_1 = require("express");
const error_handler_js_1 = __importDefault(require("./controller/middleware/error_handler.js"));
const try_catch_js_1 = __importDefault(require("./controller/utils/try_catch.js"));
const request_data_transformer_js_1 = __importDefault(require("./controller/middleware/request_data_transformer.js"));
const check_for_duplicit_record_js_1 = __importDefault(require("./controller/middleware/check_for_duplicit_record.js"));
const insert_records_js_1 = __importDefault(require("./controller/sql/insert_records.js"));
const update_records_js_1 = __importDefault(require("./controller/sql/update_records.js"));
const login_request_validation_js_1 = __importDefault(require("./controller/middleware/login_request_validation.js"));
const register_request_validation_js_1 = __importDefault(require("./controller/middleware/register_request_validation.js"));
const update_files_js_1 = __importDefault(require("./controller/file_handlers/updates/update_files.js"));
const save_files_js_1 = __importDefault(require("./controller/file_handlers/savers/save_files.js"));
const send_emails_js_1 = __importDefault(require("./controller/other/send_emails.js"));
const select_request_js_1 = __importDefault(require("./DB/select_request.js"));
const refund_request_validation_js_1 = __importDefault(require("./controller/middleware/refund_request_validation.js"));
const write_json_js_1 = __importDefault(require("./controller/file_handlers/write_json.js"));
const modify_images_js_1 = __importDefault(require("./controller/file_handlers/modify_images.js"));
const validate_user_data_js_1 = __importDefault(require("./controller/middleware/validate_user_data.js"));
const validate_cart_data_js_1 = __importDefault(require("./controller/middleware/validate_cart_data.js"));
//const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const stripe = require("stripe")('sk_test_51OHsB9C2agLPKl6uq4bSJh45m0Jl4tVzcdIFxiednewjV17crrnvGYoslGSfS4dBwH1OjNJpc3I3TS6ZCboS5tiN00xHXbm7Oy');
var endpointSecret = undefined;
//const endpointSecret = "whsec_b6e67eada329714ee59ea0f0cea0617712dc177e12091c01d5f83e5196c52d49"; // local test
const express = require('express');
exports.router = (0, express_1.Router)();
//stripe webhook
exports.router.post('/webhook', express.raw({ type: 'application/json' }), (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sig = req.headers['stripe-signature'];
        let data;
        let event_type;
        if (endpointSecret) {
            let event;
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                console.log("webhook verified");
            }
            catch (err) {
                console.log("🚀 ~ router.post ~ err:", err.message);
                console.log("webhook not verified");
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
            data = event.data.object;
            event_type = event.type;
        }
        else {
            data = req.body.data.object;
            event_type = req.body.type;
        }
        // Handle the event
        if (event_type === "checkout.session.completed") {
            var cunstomer_data = yield stripe.customers.retrieve(data.customer);
            var transformed_data = JSON.parse(cunstomer_data.metadata.data);
            console.log("🚀 ~ transformed_data:", transformed_data);
            yield (0, insert_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values);
            (0, send_emails_js_1.default)(transformed_data.email, "pes");
        }
        // Return a 200 response to acknowledge receipt of the event
        res.send().end;
    });
}));
//stripe webhook
exports.router.post('/stripe_create_session', request_data_transformer_js_1.default, validate_cart_data_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var items = JSON.parse(req.body.items);
        const customer = yield stripe.customers.create({
            metadata: {
                data: JSON.stringify(req.body.transformed_data)
            }
        });
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer: customer.id,
            line_items: items.products.map((item) => { return { price_data: { currency: "usd", product_data: { name: item.name }, unit_amount: item.prize * 100 }, quantity: item.amount }; }),
            success_url: process.env.SERVER_URL + "/main",
            cancel_url: process.env.SERVER_URL + "/main"
        });
        res.send({ msg: "melo by vratit url stripu", url: session.url, next_status: undefined });
    });
}));
exports.router.post('/login_request', request_data_transformer_js_1.default, login_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, update_records_js_1.default)(["users"], [["login_status"]], [[["Active"]]], req.body.login_request_validation.user_id);
        const user_data = yield (0, select_request_js_1.default)("SELECT username, email, password, login_status FROM users WHERE id = ?", req.body.login_request_validation.user_id);
        const user_account_data = yield (0, select_request_js_1.default)("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", req.body.login_request_validation.user_id);
        res.send({ msg: "user loged in", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data });
    });
}));
exports.router.post('/logoff_request', validate_user_data_js_1.default, request_data_transformer_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const record_id = req.body.user_data.id;
        yield (0, update_records_js_1.default)(["users"], [["login_status"]], [[["Inactive"]]], record_id);
        const user_data = yield (0, select_request_js_1.default)("SELECT id, username, email, password, login_status FROM users WHERE id = ?", record_id);
        const user_account_data = yield (0, select_request_js_1.default)("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", record_id);
        res.send({ msg: "user loged off", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data });
    });
}));
exports.router.post('/register_request', request_data_transformer_js_1.default, register_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        const record_id = yield (0, insert_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values);
        const user_data = yield (0, select_request_js_1.default)("SELECT id, username, email, password, login_status FROM users WHERE id = ?", [record_id.toString()]);
        const user_account_data = yield (0, select_request_js_1.default)("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", [record_id.toString()]);
        res.send({ msg: "user registred", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data });
    });
}));
exports.router.post('/add_record', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        var record_id = yield (0, insert_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values);
        if (req.files) {
            yield (0, save_files_js_1.default)("./public/images/temp/", req.files);
            (0, modify_images_js_1.default)("./public/images/temp/", record_id, JSON.parse(req.body.folder));
        }
        res.send({ msg: "record added", next_status: true, status: true });
    });
}));
exports.router.post('/edit_record', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        if (req.body.files_names_to_keep) {
            yield (0, update_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values, JSON.parse(req.body.record_id), JSON.parse(req.body.files_names_to_keep));
        }
        else {
            yield (0, update_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values, JSON.parse(req.body.record_id));
        }
        if (req.files) {
            yield (0, update_files_js_1.default)(JSON.parse(req.body.files_names_to_keep), JSON.parse(req.body.folder), JSON.parse(req.body.record_id), req.files);
            (0, modify_images_js_1.default)("./public/images/temp/", JSON.parse(req.body.record_id), JSON.parse(req.body.folder));
        }
        else if (req.body.files_names_to_keep) {
            yield (0, update_files_js_1.default)(JSON.parse(req.body.files_names_to_keep), JSON.parse(req.body.folder), JSON.parse(req.body.record_id));
        }
        if (req.body.psw_change) {
            return res.send({ msg: "password changed", next_status: true });
        }
        res.send({ msg: "record edited", next_status: true });
    });
}));
exports.router.post('/change_record_status', request_data_transformer_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        yield (0, update_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values, req.body.record_id);
        res.send({ msg: "status changed", next_status: true, status: true });
    });
}));
exports.router.post('/refund_request', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, refund_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var code = Math.floor(100000 + Math.random() * 900000).toString();
        (0, send_emails_js_1.default)([req.body.transformed_data.email], code);
        var refund_products = yield (0, select_request_js_1.default)("SELECT products.id, products.name, order_products.size, order_products.amount, order_products.prize FROM order_products JOIN products ON products.id = order_products.product_id WHERE order_id = ?;", req.body.order_data[0].id);
        res.send({ msg: "order found", next_status: true, status: true, code: code, data: { refunds: [req.body.order_data[0]], order_products: refund_products } });
    });
}));
exports.router.post('/send_aut_code', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var code = Math.floor(100000 + Math.random() * 900000).toString();
        (0, send_emails_js_1.default)([req.body.transformed_data.email], code);
        res.send({ msg: "order found", next_status: true, status: true, code: code, record_id: req.body.user_id_auth });
    });
}));
//page data getters
exports.router.post('/get_user_data', validate_user_data_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_data = req.body.user_data;
        res.send(JSON.stringify(user_data));
    });
}));
exports.router.post('/main_page_request', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_product_by_id', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND products.id = " + JSON.parse(req.body.id) + " AND product_images.image_url like '%_main.%';",
                "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_placed_orders', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.user_data.id;
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status, (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status = 'Active') as refund_count FROM orders WHERE user_id = " + id + ";",
                "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_collections', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
                "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_refund_reasons', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT id, reason FROM refund_reasons"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_user_refunds', validate_user_data_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.user_data.id;
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status, (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status = 'Active') as refund_count FROM orders WHERE orders.add_date + INTERVAL -30 DAY <= NOW() && user_id = " + id + ";",
                "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_user_acccount_data', validate_user_data_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.user_data.id;
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT users.id, users.username, users.email, users.password FROM users WHERE users.id = " + id + " ;",
                "SELECT user_data.id, user_data.user_id, user_data.name, user_data.surname, user_data.phone, user_data.adress, user_data.city, user_data.postcode, user_data.status, users.email FROM user_data JOIN users ON users.id = user_data.user_id WHERE user_id = " + id + " AND status = 'Active';"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_user_avaible_returns', validate_user_data_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.user_data.id;
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date FROM orders WHERE orders.user_id = " + id + " && (SELECT COUNT(refunds.id) FROM refunds WHERE orders.id = refunds.order_id && user_id = " + id + ") < 1 && orders.add_date + INTERVAL -30 DAY <= NOW();;",
                "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_user_place_returns', validate_user_data_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.user_data.id;
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders ON orders.id = refunds.order_id WHERE orders.user_id = " + id + ";",
                "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_user_placed_orders', validate_user_data_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.user_data.id;
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status, (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status = 'Active') as refund_count FROM orders WHERE user_id = " + id + ";",
                "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_admin_collections', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
                "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_admin_products', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';",
                "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_admin_orders', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders;",
                "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = $ ;"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_admin_refunds', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT refunds.id, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id;",
                "SELECT refund_products.product_id, refund_products.amount, refund_products.size, products.name, refund_reasons.reason, products.price FROM refund_products JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_reasons.id = refund_products.reason_id JOIN refunds ON refunds.id = refund_products.refund_id WHERE refunds.id = $ ;"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.use(error_handler_js_1.default);
