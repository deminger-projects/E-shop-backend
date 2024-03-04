import * as mysql from "mysql"

export const pool = mysql.createPool({
    host: 'sql11.freesqldatabase.com	',
    user: 'sql11688724',
    password: 'csKL9csea4',
    database: 'sql11688724',   
    connectionLimit: 10,
    multipleStatements: false
  })

  
// export const pool = mysql.createPool({ //local
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'eshop_2022',   
//   connectionLimit: 10,
//   multipleStatements: false
// })