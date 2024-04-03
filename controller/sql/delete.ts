import {pool} from "../../DB/pool"

export default async function sql_delete(table: string, column: string, value: number){

  var sql = "DELETE FROM " + table + " WHERE " + column + " = ?;"

  return new Promise<object>((resolve, reject) => {

    pool.getConnection((conn_err: any, conn: any) => {
      if(conn_err){
        console.log("🚀 ~ file: sql_select.ts:22 ~ pool.getConnection ~ conn_err:", conn_err.message)
      }else{
        conn.query(sql, [value],(err: any, result: any) => {
          conn.release();
          if(err){
            console.log("🚀 ~ file: sql_select.ts:21 ~ pool.query ~ err:", err.message)
          }else{ 
            resolve({affected_rows: result.affectedRows, msg: "records deleted"})
          }
        })
      }
    })
  })
}