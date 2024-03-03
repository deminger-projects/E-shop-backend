import get_login_data from "../gettets/get_login_data";

export default async function update_login_data(id: number){

    await get_login_data(id)

}