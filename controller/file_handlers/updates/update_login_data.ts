import write_json from "../write_json";

export default async function update_login_data(id: number){

    //login_data
    await write_json(["SELECT users.id, users.username, users.password, users.login_status from users WHERE users.id = " + id + " ;"], "../client/src/data/login_data.json")

}