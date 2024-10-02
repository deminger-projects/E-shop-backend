import * as fs from "fs"
import { FileArray, UploadedFile } from 'express-fileupload'
import sharp from "sharp";

export default async function save_files_to_volume(files: FileArray, folder: string, record_id: number){

    var storage_name = "/image_storage/"

    var multiple_files = files.multiple_files as UploadedFile[]
    var single_file = files.single_file as UploadedFile

    if(!fs.existsSync(storage_name + folder + "/")){ // funguje takze by melo stacit predelat cesty i react 
        fs.mkdirSync(storage_name + folder + "/")
    }
    
    if(!fs.existsSync(storage_name + folder + "/" + record_id + "/")){
        fs.mkdirSync(storage_name + folder + "/" + record_id + "/")
    }   

    

    if(multiple_files){
        for(var file of multiple_files){
            await file.mv(storage_name + folder + "/" + record_id + "/" + file.name)
        }
    }

    if(single_file){
        await single_file.mv(storage_name + folder + "/" + record_id + "/" + single_file.name)
    }



    sharp.cache(false);



    if(multiple_files){
        for(let file of multiple_files){
            sharp("/image_storage/" + folder + "/" + record_id + "/" + file)
            .jpeg()
            .jpeg({ quality: 80 })
            .jpeg({ progressive: true })
            .resize(150, 150)  
            .toFile("/image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
                if (err) {
                console.error(err);
                }else{
                    console.log("save succesfull")

                    fs.unlinkSync("/image_storage/" + folder + "/" + record_id + "/" + file)
                }
            }) 
        }
    }



    if(single_file){
        sharp("/image_storage/" + folder + "/" + record_id + "/" + single_file)
        .jpeg()
        .jpeg({ quality: 80 })
        .jpeg({ progressive: true })
        .resize(150, 150)  
        .toFile("/image_storage/" + folder + "/" + record_id + "/" + single_file, (err: Error, info: any) => {
            if (err) {
            console.error(err);
            }else{
                console.log("save succesfull")

                fs.unlinkSync("/image_storage/" + folder + "/" + record_id + "/" + single_file)
            }
        }) 
    }

}