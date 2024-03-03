import write_json from "../../write_json";

export default async function get_user_refunds(id: number){
    
    await Promise.all([write_json(["SELECT refunds.id, orders.id as order_id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode,DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, refunds.status FROM refunds JOIN orders on refunds.order_id = orders.id WHERE (refunds.status = 'Done' OR refunds.status = 'Proccesing') AND orders.user_id = " + id + " ;", 
    
    "SELECT order_products.size, order_products.amount, order_products.prize, product_images.image_url, products.name, products.id as product_id, refunds.id FROM order_products JOIN products ON products.id = order_products.product_id JOIN product_images ON product_images.product_id = order_products.product_id JOIN refunds ON refunds.order_id = order_products.order_id WHERE product_images.image_url LIKE '%_main%' AND refunds.id = $;"], 
    
    "../client/src/data/user_refunds.json")])
}