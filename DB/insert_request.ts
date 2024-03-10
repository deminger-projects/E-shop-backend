import { pool } from "./pool";

export default function insert_request(sql: string, values: Array<Array<Array<string>>> | Array<string>){
console.log("🚀 ~ insert_request ~ values:", values)
console.log("🚀 ~ insert_request ~ sql:", sql)

    return new Promise<{last_inseted_id: number}>((resolve, reject) => {

        pool.getConnection((conn_err, conn) => {
            if(conn_err){
                console.log("insert_request; 🚀 ~ pool.getConnection ~ conn_err:", conn_err.message)
            }else{
                conn.query(sql, values, (err, result, fiels) => {
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