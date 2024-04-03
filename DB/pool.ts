const mysql = require('mysql2')

  export const pool = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: 'kNCTPsadaPxbNEUNROgvqaZjNNkHtIdE',
    database: 'railway',   
    connectionLimit: 10,
    multipleStatements: false, 
    port: 52153
  })
  