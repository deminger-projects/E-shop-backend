import { pool } from "../../DB/pool"

export default function sql_update(table: string, columns: Array<string>, values: Array<string>, record_id: number){

    var seter = ""

    for (let index = 0; index < columns.length; index++) {
        if(values[index] === null){
            values.splice(index, 1)
            continue
        }else{
            if(columns.length - 1 === index){
                seter += columns[index] + " = ? "
           }else{
                seter += columns[index] + " = ? , "
           }
        }
    }

    values.push(record_id.toString())

    var sql = "UPDATE " + table + " SET " + seter + "WHERE id = ? ;"
    
    return new Promise<{affected_rows: number, msg: string}>((resolve, reject) => {
      pool.getConnection((conn_err, conn) => {
        if(conn_err){
          console.log("🚀 ~ file: sql_select.ts:22 ~ pool.getConnection ~ conn_err:", conn_err.message)
        }else{
          conn.query(sql, values, (err, result, fiels) => {
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