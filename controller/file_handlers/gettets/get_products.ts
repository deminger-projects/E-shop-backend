import write_json from "../write_json";

export default async function get_products(){
    
    await Promise.all([write_json(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';", 
    
    "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"],
    
    "../client/src/data/products.json")])

}