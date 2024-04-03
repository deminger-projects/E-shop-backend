import { pool } from "./pool";

export default function insert_request(sql: string, values: Array<Array<Array<string>>> | Array<string>){

    return new Promise<{last_inseted_id: number}>((resolve, reject) => {

        pool.getConnection((conn_err: any, conn: any) => {
            if(conn_err){
                console.log("insert_request; 🚀 ~ pool.getConnection ~ conn_err:", conn_err.message)
            }else{
                conn.query(sql, values, (err: any, result: any, fiels: any) => {
                    conn.release();
                    if(err){
                        console.log("insert_request; 🚀 ~ conn.query ~ err:", err.message)
                    }else{ 
                        resolve({last_inseted_id: result.insertId})
                    }
                })
            }
        })
    })

}