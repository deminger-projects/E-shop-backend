import {pool} from "../../DB/pool"

export default async function sql_inserts(table: string, columns: Array<string>, values: Array<Array<string>>, last_inserted_id?: string){ // gets data from DB and returns promise

    var column_str = ""

    for (let index = 0; index < columns.length; index++) {
      if(index === columns.length - 1){
        column_str += columns[index]
      }else{
        column_str += columns[index] + ", "
      }
    }

    if(last_inserted_id){
      for (let values_index = 0; values_index < values.length; values_index++) {
        for (let index = 0; index < values[values_index].length; index++) {
          if(values[values_index][index] === null){
            values[values_index][index] = last_inserted_id
          }
      }
    }
  }

    var sql = "INSERT INTO " + table + " (" + column_str + ") VALUES ?"
    
    return new Promise<string>((resolve, reject) => {

      pool.getConnection((conn_err, conn) => {
        if(conn_err){
          console.log("🚀 ~ file: sql_select.ts:22 ~ pool.getConnection ~ conn_err:", conn_err.message)
        }else{
          conn.query(sql, [values], (err, result, fiels) => {
            conn.release();
            if(err){
              console.log("🚀 ~ file: sql_select.ts:21 ~ pool.query ~ err:", err.message)
            }else{ 
              resolve(result.insertId)
            }
          })
        }
      })
    })
  }
  