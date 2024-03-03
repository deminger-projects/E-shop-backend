import get_avaible_user_returns from "../gettets/refunds/get_avaible_returns.js";
import get_collections from "../gettets/get_collections.js";
import get_login_data from "../gettets/get_login_data.js";
import get_orders from "../gettets/get_orders.js";
import get_products from "../gettets/get_products.js";
import get_refund_reasons from "../gettets/refunds/get_refund_reasons.js";
import get_refunds from "../gettets/refunds/get_refunds.js";
import get_user_data from "../gettets/get_user_data.js";
import get_user_orders from "../gettets/get_user_orders.js";
import get_user_refunds from "../gettets/refunds/get_user_refunds.js";

export default async function update_admin_data(id: number){

   await get_products()

   await get_collections()

   await get_orders()

   await get_refunds()

   await get_refund_reasons()



   await get_user_data(id)

   await get_user_orders(id)
   
   await get_login_data(id)

   await get_user_refunds(id)

   await get_avaible_user_returns(id)

}
