import { Request, Response, NextFunction } from "express";
import update_admin_data from "../file_handlers/updates/update_admin_data";
import udpade_user_data from "../file_handlers/updates/update_user_data";
import update_not_user_data from "../file_handlers/updates/update_not_user_data";

export default async function update_data(req: Request, res: Response, next: NextFunction){

    if(req.body.user_id){
        if(req.body.user_id == process.env.ADMIN_ID){
          await update_admin_data(req.body.user_id)
        }else{
          await udpade_user_data(req.body.user_id)
        }
      }else{
        await update_not_user_data()
      }

    next()
}