"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function error_handler(error, req, res, next) {
    console.log(error.message);
    console.log(error);
    return res.send({ msg: error.message, next_status: false });
}
exports.default = error_handler;
