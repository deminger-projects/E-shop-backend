import write_json from "../write_json";

export default async function get_collections(){
    
    await Promise.all([write_json(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
        "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"],
        "../client/src/data/new_collections.json")])
}