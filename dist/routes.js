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
const handler_add_js_1 = __importDefault(require("./controller/handlers/handler_add.js"));
const update_json_files_js_1 = __importDefault(require("./controller/file_handlers/updates/update_json_files.js"));
const hadle_edit_js_1 = __importDefault(require("./controller/handlers/hadle_edit.js"));
const handle_status_change_js_1 = __importDefault(require("./controller/handlers/handle_status_change.js"));
const handle_login_js_1 = __importDefault(require("./controller/handlers/handle_login.js"));
const handle_register_js_1 = __importDefault(require("./controller/handlers/handle_register.js"));
const update_login_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_login_data.js"));
const add_item_js_1 = __importDefault(require("./controller/handle_cart/add_item.js"));
const delete_item_js_1 = __importDefault(require("./controller/handle_cart/delete_item.js"));
const handle_refund_js_1 = __importDefault(require("./controller/handlers/handle_refund.js"));
const empty_cart_js_1 = __importDefault(require("./controller/handle_cart/empty_cart.js"));
const handle_send_aut_code_js_1 = __importDefault(require("./controller/handlers/handle_send_aut_code.js"));
const stripe_js_1 = __importDefault(require("./controller/apis/stripe.js"));
exports.router = (0, express_1.Router)();
exports.router.post('/stripe_payment_webhook', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚀 ~ file: routes.ts:23 ~ req:", req.body.data.object.metadata);
        //var handle_add_responce = await handle_add(JSON.parse(req.body.data.object.metadata.tables))
        var kokotina = "whsec_b6e67eada329714ee59ea0f0cea0617712dc177e12091c01d5f83e5196c52d49";
        console.log("penis2");
        res.sendStatus(200);
    });
});
exports.router.post('/get_stripe_payment_url', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, stripe_js_1.default)(JSON.parse(req.body.items), JSON.parse(req.body.tables), (session, err) => {
            console.log("🚀 ~ file: routes.ts:33 ~ awaitstripe_payment ~ err:", err);
            console.log("🚀 ~ file: routes.ts:33 ~ awaitstripe_payment ~ session:", session);
            if (err) {
                res.send({ error: err.msg });
            }
            else {
                res.send({ payment_url: session.url });
            }
        });
    });
});
exports.router.post('/add_record', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.files) {
            var handle_add_responce = yield (0, handler_add_js_1.default)(JSON.parse(req.body.tables), req.files, req.body.folder);
            if (handle_add_responce.status === true) {
                if (req.body.order) {
                    (0, empty_cart_js_1.default)();
                }
                if (!req.body.user_id) {
                    yield (0, update_json_files_js_1.default)();
                    console.log("test");
                }
                else {
                    yield (0, update_json_files_js_1.default)(req.body.user_id);
                    console.log("test");
                }
                res.send({ msg: "records saved", status: true, duplicit_value: handle_add_responce.duplicit_value });
            }
            else {
                res.send({ msg: "error ocured", status: false, duplicit_value: handle_add_responce.duplicit_value });
            }
        }
        else {
            var handle_add_responce = yield (0, handler_add_js_1.default)(JSON.parse(req.body.tables));
            if (handle_add_responce.status === true) {
                if (req.body.order) {
                    (0, empty_cart_js_1.default)();
                }
                if (!req.body.user_id) {
                    yield (0, update_json_files_js_1.default)();
                    console.log("test");
                }
                else {
                    yield (0, update_json_files_js_1.default)(req.body.user_id);
                    console.log("test");
                }
                res.send({ msg: "records saved", status: true, duplicit_value: handle_add_responce.duplicit_value });
            }
            else {
                res.send({ msg: "error ocured", status: false, duplicit_value: handle_add_responce.duplicit_value });
            }
        }
    });
});
exports.router.post('/edit_record', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.folder) {
            var hadle_edit_responce = yield (0, hadle_edit_js_1.default)(JSON.parse(req.body.tables), req.body.record_id);
            if (hadle_edit_responce.status === true) {
                if (!req.body.user_id) {
                    yield (0, update_json_files_js_1.default)();
                }
                else {
                    yield (0, update_json_files_js_1.default)(req.body.user_id);
                }
                res.send({ msg: "records updated", status: true, duplicit_value: hadle_edit_responce.duplicit_value });
            }
            else {
                res.send({ msg: "error ocured", status: false, duplicit_value: hadle_edit_responce.duplicit_value });
            }
        }
        else if (!req.files) {
            var hadle_edit_responce = yield (0, hadle_edit_js_1.default)(JSON.parse(req.body.tables), req.body.record_id, JSON.parse(req.body.files_names_to_keep), req.body.folder);
            if (hadle_edit_responce.status === true) {
                if (!req.body.user_id) {
                    yield (0, update_json_files_js_1.default)();
                }
                else {
                    yield (0, update_json_files_js_1.default)(req.body.user_id);
                }
                res.send({ msg: "records updated", status: true, duplicit_value: hadle_edit_responce.duplicit_value });
            }
            else {
                res.send({ msg: "error ocured", status: false, duplicit_value: hadle_edit_responce.duplicit_value });
            }
        }
        else {
            var hadle_edit_responce = yield (0, hadle_edit_js_1.default)(JSON.parse(req.body.tables), req.body.record_id, JSON.parse(req.body.files_names_to_keep), req.body.folder, req.files);
            if (hadle_edit_responce.status === true) {
                if (!req.body.user_id) {
                    yield (0, update_json_files_js_1.default)();
                }
                else {
                    yield (0, update_json_files_js_1.default)(req.body.user_id);
                }
                res.send({ msg: "records updated", status: true, duplicit_value: hadle_edit_responce.duplicit_value });
            }
            else {
                res.send({ msg: "error ocured", status: false, duplicit_value: hadle_edit_responce.duplicit_value });
            }
        }
    });
});
exports.router.post('/change_status', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var change_result = yield (0, handle_status_change_js_1.default)(JSON.parse(req.body.tables), req.body.record_id);
        if (change_result.status) {
            if (!req.body.user_id) {
                yield (0, update_json_files_js_1.default)();
            }
            else {
                yield (0, update_json_files_js_1.default)(req.body.user_id);
            }
        }
        res.send({ status: change_result.status, msg: change_result.msg });
    });
});
exports.router.post('/login_reguest', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var login_result = yield (0, handle_login_js_1.default)(JSON.parse(req.body.tables), req.body.record_id);
        if (login_result.status && login_result.user_id) {
            yield (0, update_login_data_js_1.default)(login_result.user_id);
        }
        res.send({ msg: login_result.msg, status: login_result.status, user_id: login_result.user_id });
    });
});
exports.router.post('/register_request', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var register_result = yield (0, handle_register_js_1.default)(JSON.parse(req.body.tables));
        if (register_result.user_id) {
            (0, update_json_files_js_1.default)(Number(register_result.user_id));
        }
        res.send({ msg: register_result.msg, status: register_result.status, user_id: register_result.user_id });
    });
});
exports.router.post('/add_to_cart', function (req, res) {
    (0, add_item_js_1.default)(JSON.parse(req.body.product), JSON.parse(req.body.selected_size));
    res.send({ msg: "added to cart" });
});
exports.router.post('/delete_from_cart', function (req, res) {
    (0, delete_item_js_1.default)(req.body.pozition);
    res.send({ msg: "deleted from cart" });
});
exports.router.post('/refund_request', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var refund_result = yield (0, handle_refund_js_1.default)(JSON.parse(req.body.tables), req.body.email);
        if (refund_result.code) {
            res.send({ msg: refund_result.msg, status: refund_result.status, code: refund_result.code, data: refund_result.data });
        }
        else {
            res.send({ msg: refund_result.msg, status: refund_result.status });
        }
    });
});
exports.router.post('/send_aut_code', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var send_aut_code_result = yield (0, handle_send_aut_code_js_1.default)(JSON.parse(req.body.tables));
        if (send_aut_code_result.code) {
            res.send({ code: send_aut_code_result.code, status: send_aut_code_result.status, msg: send_aut_code_result.msg, record_id: send_aut_code_result.record_id });
        }
        else {
            res.send({ status: send_aut_code_result.status, msg: send_aut_code_result.msg });
        }
    });
});
