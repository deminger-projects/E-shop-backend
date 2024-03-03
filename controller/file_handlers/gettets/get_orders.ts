import write_json from "../write_json";

export default async function get_orders(){
    
    await Promise.all([write_json(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders;", 
    
    "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = $ ;"],
    
    "../client/src/data/orders.json")])
}