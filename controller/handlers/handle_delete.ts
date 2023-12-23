import sql_update from "../sql/update"
import transform_records from "../other/transform_records"

export default async function handle_delete(records: object, record_id: number){

    var new_data = transform_records(records)

    await sql_update(new_data.tables[0], new_data.columns[0], new_data.values[0][0], record_id)
}