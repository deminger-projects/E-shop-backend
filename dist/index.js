"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_js_1 = require("./routes.js");
require("dotenv").config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
// origin: 'https://nodejs-production-ff30.up.railway.app' || 'http://localhost:8001'  
})); //enable the express server to respond to preflight requests
app.use(body_parser_1.default.urlencoded({ extended: true })); //support parsing of application/x-www-form-urlencoded post data
app.use(body_parser_1.default.json()); // support parsing of application/json type post data
app.use((0, express_fileupload_1.default)()); //file support
app.use(express_1.default.static('public')); //udeluje pristup k server public dir
app.use('/', routes_js_1.router); // pristupuje k app.post/get requestum
const port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log("server on port " + port);
});
