import get_collections from "../gettets/get_collections.js";
import get_orders from "../gettets/get_orders.js";
import get_products from "../gettets/get_products.js";
import get_refund_reasons from "../gettets/refunds/get_refund_reasons.js";
import get_refunds from "../gettets/refunds/get_refunds.js";

export default async function update_not_user_data(){

   await get_products()

   await get_collections()

   await get_refunds()

}
