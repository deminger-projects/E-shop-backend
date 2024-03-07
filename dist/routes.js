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
const add_item_js_1 = __importDefault(require("./controller/handle_cart/add_item.js"));
const delete_item_js_1 = __importDefault(require("./controller/handle_cart/delete_item.js"));
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
const update_login_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_login_data.js"));
const update_not_user_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_not_user_data.js"));
const update_admin_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_admin_data.js"));
const update_user_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_user_data.js"));
const empty_cart_js_1 = __importDefault(require("./controller/handle_cart/empty_cart.js"));
const refund_request_validation_js_1 = __importDefault(require("./controller/middleware/refund_request_validation.js"));
exports.router = (0, express_1.Router)();
exports.router.post('/login_request', request_data_transformer_js_1.default, login_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, update_records_js_1.default)(["users"], [["login_status"]], [[["Active"]]], req.body.login_request_validation.user_id);
        if (req.body.login_request_validation.user_id == process.env.ADMIN_ID) {
            console.log("admin");
            yield (0, update_admin_data_js_1.default)(req.body.login_request_validation.user_id);
        }
        else {
            yield (0, update_user_data_js_1.default)(req.body.login_request_validation.user_id);
        }
        res.send({ msg: "user loged in", next_status: true, status: true });
    });
}));
exports.router.post('/logoff_request', request_data_transformer_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, update_records_js_1.default)(["users"], [["login_status"]], [[["Inactive"]]], req.body.record_id);
        yield (0, update_login_data_js_1.default)(req.body.user_id);
        res.send({ msg: "user loged off", next_status: true, status: true });
    });
}));
exports.router.post('/register_request', request_data_transformer_js_1.default, register_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        const record_id = yield (0, insert_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values);
        yield (0, update_user_data_js_1.default)(Number(record_id));
        res.send({ msg: "user registred", next_status: true, status: true });
    });
}));
exports.router.post('/add_record', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        var record_id = yield (0, insert_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values);
        if (req.files) {
            yield (0, save_files_js_1.default)("../client/public/images/" + JSON.parse(req.body.folder) + "/" + record_id, req.files);
        }
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_js_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_js_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_js_1.default)();
        }
        if (req.body.order) {
            (0, empty_cart_js_1.default)();
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
        }
        else if (req.body.files_names_to_keep) {
            yield (0, update_files_js_1.default)(JSON.parse(req.body.files_names_to_keep), JSON.parse(req.body.folder), JSON.parse(req.body.record_id));
        }
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_js_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_js_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_js_1.default)();
        }
        if (req.body.psw_change) {
            res.send({ msg: "password changed", next_status: true });
        }
        res.send({ msg: "record edited", next_status: true });
    });
}));
exports.router.post('/change_record_status', request_data_transformer_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        yield (0, update_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values, req.body.record_id);
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_js_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_js_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_js_1.default)();
        }
        res.send({ msg: "status changed", next_status: true, status: true });
    });
}));
exports.router.post('/add_to_cart', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, add_item_js_1.default)(JSON.parse(req.body.product), JSON.parse(req.body.selected_size));
        res.send({ msg: "added to cart" });
    });
}));
exports.router.post('/delete_from_cart', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, delete_item_js_1.default)(req.body.pozition);
        res.send({ msg: "deleted from cart" });
    });
}));
exports.router.post('/refund_request', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, refund_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var code = Math.floor(100000 + Math.random() * 900000).toString();
        (0, send_emails_js_1.default)([req.body.transformed_data.email], code);
        var refund_products = yield (0, select_request_js_1.default)("SELECT products.id, products.name, order_products.size, order_products.amount, order_products.prize FROM order_products JOIN products ON products.id = order_products.product_id WHERE order_id = ?;", req.body.order_data[0].id);
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_js_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_js_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_js_1.default)();
        }
        res.send({ msg: "order found", next_status: true, status: true, code: code, data: { refunds: [req.body.order_data[0]], order_products: refund_products } });
    });
}));
exports.router.post('/test_request', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("test jo");
        res.send({ msg: "test", next_status: true, status: true });
    });
}));
exports.router.post('/send_aut_code', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var code = Math.floor(100000 + Math.random() * 900000).toString();
        (0, send_emails_js_1.default)([req.body.transformed_data.email], code);
        res.send({ msg: "order found", next_status: true, status: true, code: code, record_id: req.body.user_id_auth });
    });
}));
exports.router.use(error_handler_js_1.default);
