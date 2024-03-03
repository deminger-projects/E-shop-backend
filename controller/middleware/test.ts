import { Request, Response, NextFunction } from "express";

export default function testovaci_funkce(req: Request, res: Response, next: NextFunction){

    console.log("test")

    console.log("test")

    next()
}