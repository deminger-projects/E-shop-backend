import sql_update from "../sql/update";
import check_duplicity from "../other/check_duplicity";
import transform_records from "../other/transform_records";

export default async function handle_login(records: object, record_id: number){

    var new_data = transform_records(records)

    var check_dup_result = await check_duplicity(new_data, undefined, "login")

    if(check_dup_result.status === true && check_dup_result.record_id){
         await sql_update(new_data.tables[0], new_data.columns[0], new_data.values[0][0], check_dup_result.record_id)
         return {status: check_dup_result.status, msg: check_dup_result.msg, user_id: check_dup_result.record_id}
    }

    return {status: check_dup_result.status, msg: check_dup_result.msg}

}