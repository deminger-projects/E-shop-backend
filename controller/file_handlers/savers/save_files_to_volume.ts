import * as fs from "fs"
import { FileArray, UploadedFile } from 'express-fileupload'
import sharp from "sharp";

export default async function save_files_to_volume(files: FileArray, folder: string, record_id: number){

    if(!fs.existsSync("/image_storage/" + folder + "/")){ // funguje takze by melo stacit predelat cesty i react 
        fs.mkdirSync("/image_storage/" + folder + "/")
    }
    
    if(!fs.existsSync("/image_storage/" + folder + "/" + record_id + "/")){ // funguje takze by melo stacit predelat cesty i react 
        fs.mkdirSync("/image_storage/" + folder + "/" + record_id + "/")
    }   

    var multiple_files = files.multiple_files as UploadedFile[]
    var single_file = files.single_file as UploadedFile

    sharp.cache(false);

    if(multiple_files){
        for(let file of multiple_files){
            //sharp(path + file)
            sharp("/image_storage/" + folder + "/" + record_id + "/" + file)
            .jpeg()
            .jpeg({ quality: 100 })
            .jpeg({ progressive: true })
            .resize(200, 200)  
            .toFile("/image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
            // .toFile("./image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
            //.toFile("/image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
                if (err) {
                console.error(err);
                }else{
                    fs.unlinkSync("/image_storage/" + folder + "/" + record_id + "/" + file)
                }
            }) 
        }
    }

    if(single_file){
        sharp("/image_storage/" + folder + "/" + record_id + "/" + single_file)
        .jpeg()
        .jpeg({ quality: 100 })
        .jpeg({ progressive: true })
        .resize(200, 200)  
        .toFile("/image_storage/" + folder + "/" + record_id + "/" + single_file, (err: Error, info: any) => {
        // .toFile("./image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
        //.toFile("/image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
            if (err) {
            console.error(err);
            }else{
                fs.unlinkSync("/image_storage/" + folder + "/" + record_id + "/" + single_file)
            }
        }) 
    }

}