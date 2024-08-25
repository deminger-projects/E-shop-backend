import { Request, Response, NextFunction } from "express";
import select_request from "../../DB/select_request";

export default async function refund_request_validation(req: Request, res: Response, next: NextFunction){

    const sql = "SELECT * FROM refunds WHERE order_id = ?;"

    const sql2 = "SELECT * FROM orders WHERE id = ? && (orders.add_date + INTERVAL +30 DAY - NOW()) >= 0;"

    const result = await select_request(sql, req.body.order_data[0].id)
    console.log("🚀 ~ refund_request_validation ~ result:", result)

    const result2 = await select_request(sql2, req.body.order_data[0].id)
    console.log("🚀 ~ refund_request_validation ~ result2:", result2)

    if(result.length > 0){
       return next(new Error("refund allready placed"))
    }

    if(result2.length <= 0){
        return next(new Error("refund not avalable (expired after 30 days)"))
       }
    
    next()
}