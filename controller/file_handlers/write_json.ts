import * as fs from 'fs';

import select_request from '../../DB/select_request.js';

export default async function write_json (sql_tasks: Array<string>, file?: string){ // gets data from DB and imports them to json file
console.log("🚀 ~ write_json ~ sql_tasks:", sql_tasks)

  var table_names: Array<string> = []

  var prom_arr: Array<Array<object>> = []

  var results = await select_request(sql_tasks[0])                            // creates data formath with side data

  for(var res of results){
    var task_arr: Array<object> = []
    for (let index = 1; index <= sql_tasks.length - 1; index++) {
      task_arr.push(await select_request(sql_tasks[index].replace("$", "'" + res.id + "'"))
      )  
    }
    
    var record_side_data_arr = (await Promise.all(task_arr))
    record_side_data_arr.unshift([res])
    prom_arr.push(record_side_data_arr) 
   
  }
 
  for (let index = 0; index < sql_tasks.length; index++) {  //ziska table names, ktere pouziji jako keys
    const a = sql_tasks[index].split("FROM")[1]
    const b = sql_tasks[index].split("from")[1]

    if(b){
      var name = b.trim().split(" ")[0]
      if((name[name.length - 1]) === ";"){
        name = name.slice(0, -1)
      }
      table_names.push(name)
    }

    if(a){
      var name = a.trim().split(" ")[0]
      if((name[name.length - 1]) === ";"){
        name = name.slice(0, -1)
      }
      table_names.push(name)
    }
  }

  var new_data: Array<object> = []

  for (let index = 0; index < prom_arr.length; index++) {   //vytvori object s key table name 
    var temp_arr: {[key: string]: Array<Array<object>>} = {}
    
      for (let index2 = 0; index2 < prom_arr[index].length; index2++) {
        let temp = JSON.stringify(prom_arr[index][index2])
        temp_arr[table_names[index2]] = JSON.parse(temp);
        
      }
    new_data.push(temp_arr)    
  }

  if(file){
    fs.writeFile(file, JSON.stringify(new_data), {encoding: "utf8"}, (err) => { // writes data to file
      if (err) {
        console.log("🚀 ~ file: write_json.ts:25 ~ fs.writeFile ~ err:", err.message)
      } 
      console.log('Successfully wrote file: ' + file)
    })  
  }
    
  return JSON.stringify(new_data)
  
}