import sql_inserts from "../../sql/inserts"
import check_duplicity from "../../other/check_duplicity"
import transform_records from "../../other/transform_records.js"

import DuplicityCheckResult from "../../../interfaces/Duplicity_check_result"

export default async function save_records(records: object){

    var last_inserted_id = ""
    var dup_check_result: DuplicityCheckResult

    var new_data = transform_records(records)

    for (let table_index = 0; table_index < new_data.tables.length; table_index++) {
        if(table_index === 0){
            dup_check_result = await check_duplicity(new_data)
            if(!dup_check_result.status){
                var last_inserted_id = await sql_inserts(new_data.tables[table_index], new_data.columns[table_index], new_data.values[table_index])
            }else{
                return ({status: false, msg: dup_check_result.msg, duplicit_value: true})
            }
        }else{
            await sql_inserts(new_data.tables[table_index], new_data.columns[table_index], new_data.values[table_index], last_inserted_id)
        }
    }
    return {status: true, msg: "no duplicit value", last_inserted_id: last_inserted_id, duplicit_value: false}
}