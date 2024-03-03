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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function add_item(product, selected_size) {
    var my_data = JSON.parse(fs.readFileSync('../client/src/data/cart.json', "utf-8"));
    var data = {
        product: product,
        size_data: selected_size
    };
    var next = true;
    for (let index = 0; index < my_data.length; index++) {
        if (Number(my_data[index].product.products[0].id) === Number(data.product.products[0].id) && my_data[index].size_data.size === data.size_data.size) {
            my_data[index].size_data.current_amount = my_data[index].size_data.current_amount + selected_size.current_amount;
            next = false;
            break;
        }
    }
    if (my_data.length === 0) {
        fs.writeFileSync('../client/src/data/cart.json', (JSON.stringify([data])));
    }
    else {
        if (next) {
            my_data.push(data);
        }
        fs.writeFileSync("../client/src/data/cart.json", JSON.stringify(my_data));
    }
}
exports.default = add_item;
