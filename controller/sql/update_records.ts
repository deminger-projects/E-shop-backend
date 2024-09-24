import delete_request from "../../DB/delete_request"
import update_request from "../../DB/update_request"
import insert_records from "./insert_records"

export default async function update_records(tables: Array<string>, columns: Array<Array<string>>, values: Array<Array<Array<string>>>, record_id: number, file_names_to_keep?: Array<string>){

    for (let table_index = 0; table_index < tables.length; table_index++) {
        if(table_index === 0){
            var columns_string = ''

            for (let columns_index = 0; columns_index < columns[table_index].length; columns_index++) {
                if(columns_index === columns[table_index].length - 1){
                    columns_string += columns[table_index][columns_index] + " = ? "
                }else{
                    columns_string += columns[table_index][columns_index] + " = ?, "
                }
            }

            var sql = "UPDATE " + tables[table_index] + " SET " + columns_string + "WHERE id = " + record_id + " ;"

            await update_request(sql, values[table_index][0])
        }else{
            
            var sql = "DELETE FROM " + tables[table_index] + " WHERE " + columns[table_index][0] + " = ?;"

            await delete_request(sql, [record_id.toString()])

                                                                                    // vkladalo dvakrat data
            // if(file_names_to_keep && tables[table_index].includes("image")){     
            //     for (let index = 0; index < file_names_to_keep.length; index++) {
            //         values[table_index].push([record_id.toString(), file_names_to_keep[index]])
            //     }
            // }

            await insert_records([tables[table_index]], [columns[table_index]], [values[table_index]])
        }
    }

}
