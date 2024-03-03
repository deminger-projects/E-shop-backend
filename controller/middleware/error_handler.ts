import { Request, Response, NextFunction } from "express";

export default function error_handler(error: Error, req: Request, res: Response, next: NextFunction){

    console.log(error.message)

    console.log(error)

    return res.send({msg: error.message, next_status: false})

}