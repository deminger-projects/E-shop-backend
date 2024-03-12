import { Request, Response, NextFunction  } from "express";
import select_request from "../../DB/select_request";

const check_for_duplicit_record = async(req: Request, res: Response, next: NextFunction) => {
   
    const data = req.body.transformed_data

    var where_conditions = ""

    for (let index = 0; index < data.wheres.columns.length; index++) {
        if(data.wheres.columns.length - 1 === index){
            where_conditions += data.wheres.columns[index] + " = ?"
        }else{
            where_conditions += data.wheres.columns[index] + " = ? AND "
        }
    }

    if(data.wheres.columns.length <= 0){
        if(req.body.record_id){
            var sql = "SELECT * FROM " + data.tables[0] + " WHERE id != " + req.body.record_id + " AND status != 'Deleted';"
        }else{
            var sql = "SELECT * FROM " + data.tables[0] + " WHERE status != 'Deleted';"
        }
    }else{
        if(req.body.record_id){
            var sql = "SELECT * FROM " + data.tables[0] + " WHERE " + where_conditions + " AND id != " + req.body.record_id + " AND status != 'Deleted';"
        }else{
            var sql = "SELECT * FROM " + data.tables[0] + " WHERE " + where_conditions + " AND status != 'Deleted';"
        }
    }    

    const result = await select_request(sql, data.wheres.values)

    if(req.body.refund){
        if(result.length <= 0){
            return next(new Error("incorect email or order id"))
        }else{
            req.body.order_data = result
            return next()
        }
    }else if(req.body.auth_code){
        if(result.length <= 0){
            return next(new Error("user not found"))
        }else{
            req.body.user_id_auth = result[0].id
            return next()
        }
    }else if(req.body.psw_change || req.body.order){
        return next()
    }else{
        if(result.length > 0){
            return next(new Error("record already in system"))
        }
    }

    next()
}

export default check_for_duplicit_record