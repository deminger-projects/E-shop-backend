import { pool } from "./pool";

export default function select_request(sql: string, values?: Array<string>){

    return new Promise<Array<{id: number, [index: number]: Array<string>}>>((resolve, reject) => {

        pool.getConnection((conn_err: any, conn: any) => {
            if(conn_err){
                console.log("select_request; 🚀 ~ pool.getConnection ~ conn_err:", conn_err.message)
            }else{
                conn.query(sql, values, (err: any, result: any) => {
                    conn.release();
                    if(err){
                        console.log("select_request; 🚀 ~ conn.query ~ err:", err.message)
                    }else{ 
                        resolve(result)
                    }
                })
            }
        })
    })
}
