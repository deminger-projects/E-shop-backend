import {pool} from "../../DB/pool"

export default async function sql_select(sql: string){
  return new Promise<Array<{[key: string]: string|number|null|Array<string>|Array<number>}>>((resolve, reject) => {
      pool.getConnection((conn_err, conn) => {
        if(conn_err){
          console.log("🚀 ~ file: sql_select.ts:22 ~ pool.getConnection ~ conn_err:", conn_err.message)
        }else{
          conn.query(sql, (err, result, fiels) => {
            conn.release();
            if(err){
              console.log("🚀 ~ file: sql_select.ts:21 ~ pool.query ~ err:", err.message)
            }else{ 
              resolve(result)
            }
          })
        }
      })
  })
}