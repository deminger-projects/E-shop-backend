import write_json from "../../write_json";

export default async function get_refunds(){
    
    await Promise.all([write_json(["SELECT refunds.id, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id;",
    
    "SELECT refund_products.product_id, refund_products.amount, refund_products.size, products.name, refund_reasons.reason, products.price FROM refund_products JOIN products ON products.id = refund_products.product_id JOIN refund_reasons ON refund_reasons.id = refund_products.reason_id JOIN refunds ON refunds.id = refund_products.refund_id WHERE refunds.id = $ ;"],
    
    "../client/src/data/refunds.json")])
}