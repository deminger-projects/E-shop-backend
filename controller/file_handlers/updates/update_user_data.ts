import get_avaible_user_returns from "../gettets/refunds/get_avaible_returns.js";
import get_login_data from "../gettets/get_login_data.js";
import get_user_data from "../gettets/get_user_data.js";
import get_user_orders from "../gettets/get_user_orders.js";
import get_user_refunds from "../gettets/refunds/get_user_refunds.js";
import get_refunds_for_user_place_refunds from "../gettets/refunds/get_refunds_for_user_place_refund.js";

export default async function udpade_user_data(id: number){

    await get_user_data(id)

    await get_user_orders(id)
    
    await get_login_data(id)

    await get_user_refunds(id)

    await get_avaible_user_returns(id)




    await get_refunds_for_user_place_refunds(id)
}
 
 