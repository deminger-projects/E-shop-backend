import insert_request from "../../DB/insert_request";

export default async function insert_records(tables: Array<string>, columns: Array<Array<string>>, values: Array<Array<Array<string>>>){

    var sql_inserts: Array<string> = []

    for (let table_index = 0; table_index < tables.length; table_index++) {

        var columns_string = ""

        for (let columns_index = 0; columns_index < columns[table_index].length; columns_index++) {

            if(columns_index === columns[table_index].length - 1){
                columns_string += columns[table_index][columns_index]
            }else{
                columns_string += columns[table_index][columns_index] + ", "

            }
        }

        var sql = "INSERT INTO " + tables[table_index] + " (" + columns_string + ") VALUES ?"

        sql_inserts.push(sql)
        
    }

    var record_id!: number

    for (let query_index = 0; query_index < tables.length; query_index++) {
        if(query_index === 0){

            const result = await insert_request(sql_inserts[query_index], [values[query_index]])
            record_id = result.last_inseted_id

        }else{
            for (let values_index = 0; values_index < values[query_index].length; values_index++) {
                for (let values_content_index = 0; values_content_index < values[query_index][values_index].length; values_content_index++) {
                    if(values[query_index][values_index][values_content_index] === null){
                        values[query_index][values_index][values_content_index] = record_id.toString()
                    }
                } 
            }

            await insert_request(sql_inserts[query_index], [values[query_index]])
        }       
    }

    return record_id
  }
  