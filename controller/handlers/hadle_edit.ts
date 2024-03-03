import { FileArray } from "express-fileupload";
import update_records from "../record_handlers/updates/update_records";
import update_files from "../file_handlers/updates/update_files";

export default async function handle_edit(records: object, record_id: number, file_names_to_keep?: Array<string>, folder?: string, files?: FileArray){

    var update_records_responce =  await update_records(records, record_id, file_names_to_keep)

    if(update_records_responce.status === false){
        return {status: false, msg: "records did not updated/duplicit value", duplicit_value: update_records_responce.duplicit_value}
    }else if(update_records_responce.status === true && file_names_to_keep && folder && files){
         await update_files(file_names_to_keep, folder, record_id, files)
        return {status: true, msg: "records updated", duplicit_value: update_records_responce.duplicit_value}     
    }else if(update_records_responce.status === true){
        return {status: true, msg: "records update", duplicit_value: update_records_responce.duplicit_value}     
    }else{
        return {status: false, msg: "records update failed", duplicit_value: update_records_responce.duplicit_value}     
    }
}