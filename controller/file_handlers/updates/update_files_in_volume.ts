import * as fs from "fs"
import { FileArray, UploadedFile } from 'express-fileupload'
import sharp from "sharp";
import save_files_to_volume from "../savers/save_files_to_volume";

export default async function update_files_in_volume(folder: string, record_id:number, file_names_to_keep: Array<string>, files?: FileArray){

    var path = "/image_storage/" + folder + "/" + record_id

    var data = fs.readdirSync(path)

    var files_to_delete = []

    for(var saved_file_name of data){
        var keep = false
        for(var file_name_to_keep of file_names_to_keep){
            if(saved_file_name === file_name_to_keep){
                keep = true
                break
            } 
        }
        if(keep === false){
            files_to_delete.push(saved_file_name)
        } 
    }


    for(var file_name of files_to_delete){
        fs.unlinkSync(path + "/" + file_name)
    }

    if(files){
        await save_files_to_volume(files, folder, record_id)
    }

}
