import write_json from "../write_json";

export default async function get_login_data(id: number){
    
    await Promise.all([write_json(["SELECT users.id, users.username, users.password, users.login_status from users WHERE users.id = " + id + " ;"], 
    
    "../client/src/data/login_data.json")])
}