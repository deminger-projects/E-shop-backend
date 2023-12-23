import transform_records from "../other/transform_records";
import sql_update from "../sql/update";

export default async function handle_status_change(records: object, record_id: number){

    var new_data = transform_records(records)

    var result = await sql_update(new_data.tables[0], new_data.columns[0], new_data.values[0][0], record_id)

    if(result.affected_rows >= 1){
        return {status: true, msg: "update done"}
    }    

    return {status: false, msg: "update failed"}
}