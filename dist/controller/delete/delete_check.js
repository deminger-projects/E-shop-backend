"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_check = void 0;
function delete_check(table, id) {
    if (table === "products") {
        var res1 = "SELECT id FROM order_products WHERE product_id = " + id + ";";
        var res2 = "SELECT id FROM refund_products WHERE product_id = " + id + ";";
        console.log("🚀 ~ file: delete_check.js:8 ~ delete_check ~ res1:", res1);
    }
    //select * from order_products where product_id = id
    //select * from refund_products where product_id = id
    //select * from products where collection_id = id
}
exports.delete_check = delete_check;
//module.exports = {delete_check}
