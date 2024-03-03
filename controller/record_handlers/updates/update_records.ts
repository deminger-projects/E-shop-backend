import sql_inserts from "../../sql/inserts"
import sql_delete from "../../sql/delete"
import check_duplicity from "../../other/check_duplicity"
import transform_records from "../../other/transform_records"
import sql_update from "../../sql/update"

export default async function update_records(records: object, record_id: number, file_names_to_keep?: Array<string>){

    var new_data = transform_records(records)

    for (let index = 0; index < new_data.tables.length; index++) {
        if(index === 0){
            if(!((await check_duplicity(new_data, record_id)).status)){
                await sql_update(new_data.tables[0], new_data.columns[0], new_data.values[0][0], record_id)
            }else{
                return {status: false, msg: "duplicit value", duplicit_value: true}
            }
        }else{


            if(file_names_to_keep){
                if(new_data.tables[index].includes("image")){
                    for (let my_index = 0; my_index < file_names_to_keep.length; my_index++) {
                        new_data.values[index].push([record_id.toString(), file_names_to_keep[my_index]])
                    }
                }
            }

            await sql_delete(new_data.tables[index], (new_data.tables[index].split("_"))[0] + "_id", record_id)
            await sql_inserts(new_data.tables[index], new_data.columns[index], new_data.values[index])
        }
    }
    
    return {status: true, msg: "records updated", duplicit_value: false}
}