import { Request, Response, NextFunction } from "express";
import select_request from "../../DB/select_request";

export default async function validate_user_data(req: Request, res: Response, next: NextFunction){

    const email = JSON.parse(req.body.email)
    const password = JSON.parse(req.body.password)
    
    const sql = "SELECT * FROM users WHERE email = ? && password = ?;"

    const result = await select_request(sql, [email, password])

    if(result.length < 0){
       return next(new Error("user is not in system"))
    }else{
        req.body.id = result[0].id
    }
      
    next() 
} 