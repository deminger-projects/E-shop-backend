import { Request, Response, NextFunction } from "express";
import select_request from "../../DB/select_request";

export default async function validate_cart_data(req: Request, res: Response, next: NextFunction){

    if(req.body.cart){

        const cart = JSON.parse(req.body.cart)

        var sql = "SELECT * FROM products WHERE id = ? && name = ? && price = ?;"
    
        for(let item of cart){
            var result = await select_request(sql, [ item.id, item.name, item.prize])
            if(result.length <= 0){
                return next(new Error("item not found in system, potencial cookies treath"))
            }
        }
    }
      
    next() 
}  