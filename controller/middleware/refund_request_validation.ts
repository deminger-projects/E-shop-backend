import { Request, Response, NextFunction } from "express";
import select_request from "../../DB/select_request";

export default async function refund_request_validation(req: Request, res: Response, next: NextFunction){

    const sql = "SELECT * FROM refunds WHERE order_id = ?;"

    const result = await select_request(sql, req.body.order_data[0].id)

    if(result.length > 0){
       return next(new Error("refund allready placed"))
    }
    
    next()
}