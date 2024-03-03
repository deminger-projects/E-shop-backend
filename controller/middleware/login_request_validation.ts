import { Request, Response, NextFunction  } from "express";
import select_request from "../../DB/select_request";

const login_request_validation = async(req: Request, res: Response, next: NextFunction) => {

    var email_test_result = await select_request("SELECT * FROM users WHERE email = ? ;", [req.body.transformed_data.email])
   
    if(email_test_result.length <= 0){
        return next(new Error("email not in system"))
    } 

    const data = req.body.transformed_data

    var where_conditions = ""

    for (let index = 0; index < data.wheres.columns.length; index++) {
        if(data.wheres.columns.length - 1 === index){
            where_conditions += data.wheres.columns[index] + " = ?"
        }else{
            where_conditions += data.wheres.columns[index] + " = ? AND "
        }
    }  
    
    var sql = "SELECT * FROM " + data.tables[0] + " WHERE " + where_conditions + ";"

    var psw_test_result = await select_request(sql, data.wheres.values)

    if(psw_test_result.length <= 0){
        return next(new Error("wrong password"))
     }

    req.body.login_request_validation = {msg: "correct data for login", next_status: true, user_id: psw_test_result[0].id}
   
    next()
}

export default login_request_validation