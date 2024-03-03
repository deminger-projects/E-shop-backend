import { pool } from "./pool";

export default function delete_request(sql: string, values: Array<Array<Array<string>>> | Array<string>){

    return new Promise<void>((resolve, reject) => {

        pool.getConnection((conn_err, conn) => {
            if(conn_err){
                console.log("delete_request; 🚀 ~ pool.getConnection ~ conn_err:", conn_err.message)
            }else{
                conn.query(sql, values, (err, result, fiels) => {
                    conn.release();
                    if(err){
                        console.log("delete_request; 🚀 ~ conn.query ~ err:", err.message)
                    }else{ 
                        resolve(result)
                    }
                })
            }
        })
    })

}