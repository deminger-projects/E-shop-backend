import write_json from "../write_json";

export default async function get_user_data(id: number){
    
    await Promise.all([write_json(["SELECT users.id, users.username, users.email, users.password FROM users WHERE users.id = " + id + " ;", 
    
    "SELECT user_data.id, user_data.user_id, user_data.name, user_data.surname, user_data.phone, user_data.adress, user_data.city, user_data.postcode, user_data.status, users.email FROM user_data JOIN users ON users.id = user_data.user_id WHERE user_id = " + id + " AND status = 'Active';"], 
    
    "../client/src/data/user_data.json")])
}