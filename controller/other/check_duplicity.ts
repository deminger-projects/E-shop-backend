import TransformedData from "../../interfaces/Transformed_data"
import DuplicityCheckResult from "../../interfaces/Duplicity_check_result"

import {pool} from "../../DB/pool"

export default async function check_duplicity(data: TransformedData, record_id?: number, type?: string){

  var values: Array<string> = []

  if(data.wheres.columns.length === 0){
    return new Promise<DuplicityCheckResult>((resolve, reject) => {resolve({msg: "duplicity check did not run", status: false})})
  }else if(!record_id){
    if(type === "login"){
      var sql = "SELECT * FROM " + data.tables[0] + " WHERE login_status = 'Inactive'"
    }else if(type === "register"){
      var sql = "SELECT * FROM " + data.tables[0] + " WHERE (login_status = 'Inactive' OR login_status = 'Active')"
    }else{
      var sql = "SELECT * FROM " + data.tables[0] + " WHERE status = 'Active'"
    }
  }else{
    var sql = "SELECT * FROM " + data.tables[0] + " WHERE id != " + record_id
  }

  for (let index = 0; index < data.wheres.columns.length; index++) {
      if(index === data.wheres.columns.length - 1){
          sql += " AND " + data.wheres.columns[index] + " = ?"
      }else{
          sql += " AND " + data.wheres.columns[index] + " = ?"
      }
      values.push(data.wheres.values[index])
  }
    
  return new Promise<DuplicityCheckResult>((resolve, reject) => {
    pool.getConnection((conn_err, conn) => {
      if(conn_err){
        console.log("🚀 ~ file: sql_select.ts:22 ~ pool.getConnection ~ conn_err:", conn_err.message)
      }else{
        conn.query(sql, values, (err, result, fiels) => {
          conn.release();
          if(err){
            console.log("🚀 ~ file: sql_select.ts:21 ~ pool.query ~ err:", err.message)
          }else{ 
            if(result.length === 0){
              resolve({msg: "no duplicit value", status: false})
            }else{
              resolve({msg: "record is in db allready", status: true, record_id: result[0].id})
            }
          }
        })
      }
    })
  })
}