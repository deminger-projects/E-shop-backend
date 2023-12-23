import sql_inserts from "../sql/inserts";
import check_duplicity from "../other/check_duplicity";
import transform_records from "../other/transform_records";

export default async function handle_register(records: object){

    var new_data = transform_records(records)

    var check_dup_result = await check_duplicity(new_data, undefined, "register")

    if(!check_dup_result.status){
        for (let index = 0; index < new_data.tables.length; index++) {
            var result = await sql_inserts(new_data.tables[index], new_data.columns[index], new_data.values[index])
            return {status: check_dup_result.status, msg: check_dup_result.msg, user_id: result}
        }
    }
    
    return {status: check_dup_result.status, msg: check_dup_result.msg}
    
}