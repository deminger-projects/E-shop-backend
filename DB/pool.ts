const mysql = require('mysql2')
require('dotenv').config()

  console.log(process.env.DB_HOST)
  console.log(process.env.DB_USER)
  console.log(process.env.DB_PASSWORD)
  console.log(process.env.DB_NAME)
  console.log(process.env.DB_PORT)


  export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,   
    connectionLimit: 10,
    multipleStatements: false, 
    port: process.env.DB_PORT
  })

  
  