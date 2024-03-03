import { FileArray, UploadedFile } from 'express-fileupload'
import save_records from '../record_handlers/savers/save_records.js'
import save_files from '../file_handlers/savers/save_files.js'
import update_json_files from '../file_handlers/updates/update_json_files.js'

export default async function handle_add(records: object, files?: FileArray, folder?: string){

    var save_records_responce = await save_records(records)

    if(save_records_responce.status === false){
        return {status: false, msg: "records did not save", duplicit_value: save_records_responce.duplicit_value}
    }else if(save_records_responce.status === true && files){
        await save_files("../client/public/images/" + folder + "/" + save_records_responce.last_inserted_id , files)
        return {status: true, msg: "records saved", duplicit_value: save_records_responce.duplicit_value}   
    }else if(save_records_responce.status === true){
        return {status: true, msg: "records save"}
    }else{
        return {status: false, msg: "records save error"}
    }
    
} 