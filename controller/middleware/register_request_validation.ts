import { Request, Response, NextFunction  } from "express";
import select_request from "../../DB/select_request";

const register_request_validation = async(req: Request, res: Response, next: NextFunction) => {

    var email_test_result = await select_request("SELECT * FROM users WHERE email = ? ;", [req.body.transformed_data.email])
   
    if(email_test_result.length > 0){
        return next(new Error("Email is already registered"))
    }
   
    next()
}

export default register_request_validation