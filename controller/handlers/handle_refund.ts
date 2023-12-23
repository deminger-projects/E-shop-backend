import sql_select from "../../model/sql/select";
import check_duplicity from "../other/check_duplicity";
import send_emails from "../other/send_emails";
import transform_records from "../other/transform_records";

export default async function handle_refund(records: object, email: string){

    var new_data = transform_records(records)

    var dup_check_result = await check_duplicity(new_data)

    if(dup_check_result.status){
        var order_id = new_data.wheres.values[0]
        var res = await sql_select("SELECT refunds.id FROM refunds WHERE status = 'Active' AND order_id = " + order_id + ";")
        if(res.length === 0){
            var code = Math.floor(100000 + Math.random() * 900000).toString()
            send_emails([email], code)
            var data = await sql_select("SELECT products.id, products.name, order_products.size, order_products.amount, order_products.prize FROM order_products JOIN products ON products.id = order_products.product_id WHERE order_id = " + order_id + ";")
            return {msg: "order does exist", status: true, code: code, data: data}
        }else{
            return {msg: "refund already placed", status: false}
        }        
    }
    
    return {msg: "order does not exists", status: false}

}