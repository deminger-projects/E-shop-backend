"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
const routes_js_1 = require("./routes.js");
const update_not_user_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_not_user_data.js"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); //enable the express server to respond to preflight requests
app.use(body_parser_1.default.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data
app.use(body_parser_1.default.json()); // support parsing of application/json type post data
app.use((0, express_fileupload_1.default)()); //file support
app.use('/', routes_js_1.router); // pristupuje k app.post/get requestum
console.log("node js jedo more");
//process.env.PORT
(0, update_not_user_data_js_1.default)().then(result => {
    app.listen(3306, () => {
        console.log("Server running successfully on 8001");
    });
});
