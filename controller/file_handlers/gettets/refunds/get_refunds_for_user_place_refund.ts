import write_json from "../../write_json";

export default async function get_refunds_for_user_place_refunds(id: number){
    
    await Promise.all([write_json(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders WHERE orders.add_date + INTERVAL -30 DAY <= NOW() && user_id = " + id + " && (SELECT count(refunds.id) FROM refunds WHERE orders.id = refunds.order_id AND refunds.status != 'Cancled') < 1;",
    
    "SELECT order_products.id, order_products.product_id, products.name, order_products.size, order_products.amount, order_products.prize, product_images.image_url FROM order_products JOIN products on order_products.product_id = products.id JOIN product_images on product_images.product_id = order_products.product_id WHERE order_id = $ AND product_images.image_url LIKE '%_main%';"], 
    
    "../client/src/data/refund_test.json")])
}