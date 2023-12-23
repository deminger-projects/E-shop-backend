import * as fs from 'fs';
import { FileArray, UploadedFile } from "express-fileupload";

export default async function update_files(file_names_to_keep: Array<string>, folder: string, record_id:number, files?: FileArray){
    
    var path = "../client/public/images/" + JSON.parse(folder) + "/" + record_id

    fs.readdir(path, (err, data) => {
        if(err){
            console.log("🚀 ~ file: update_files.ts:10 ~ fs.readdir ~ err:", err.message)
        }else{
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
                fs.unlink(path + "/" + file_name, (err) => {
                    if(err){
                        console.log("🚀 ~ file: update_files.ts:28 ~ fs.unlink ~ err:", err.message)
                    }else{
                        console.log("🚀 ~ file: update_files.ts:28 ~ fs.unlink ~ deleted file:", file_name)
                    }
                })
            }

            if(files){
                var multiple_files = files.multiple_files as UploadedFile[]
                var single_file = files.single_file as UploadedFile
         
                if(multiple_files){
                   for (let index = 0; index < multiple_files.length; index++) {
                       multiple_files[index].mv(path + "/" + multiple_files[index].name, (err) => {
                         if(err){
                           console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message)
                         }else{
                            console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ file saved:", multiple_files[index].name)
                         }
                       })
                   }
                }else if(single_file){
                   single_file.mv(path + "/" + single_file.name, (err) => {
                     if(err){
                       console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message)
                     }else{
                        console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ file saved:", single_file.name)
                     }
                   })
                }
            }
        }
    })
}