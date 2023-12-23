import * as mysql from "mysql"

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eshop_2022',   
    connectionLimit: 10,
    multipleStatements: false
  })