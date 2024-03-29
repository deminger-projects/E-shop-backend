import { Request, Response, NextFunction  } from "express";
import select_request from "../../DB/select_request";

const bcrypt = require('bcrypt');

const login_request_validation = async(req: Request, res: Response, next: NextFunction) => {

    var email_test_result: any = await select_request("SELECT * FROM users WHERE email = ? ;", [req.body.transformed_data.email])
   
    if(email_test_result.length <= 0){
        return next(new Error("email not in system"))
    } 

    var password_in_db = email_test_result[0].password

    const data = req.body.transformed_data

    var is_match = await bcrypt.compare(data.password, password_in_db)

    if(!is_match){
        return next(new Error("wrong password"))
    }

    req.body.login_request_validation = {msg: "correct data for login", next_status: true, user_id: email_test_result[0].id, user_data: email_test_result[0]}
   
    next()
}

export default login_request_validation