import * as fs from "fs"
import { FileArray, UploadedFile } from 'express-fileupload'
import sharp from "sharp";

export default async function save_files_to_volume(files: FileArray, folder: string, record_id: number){

    var storage_name = "/test/"

    if(!fs.existsSync(storage_name + folder + "/")){ // funguje takze by melo stacit predelat cesty i react 
        fs.mkdirSync(storage_name + folder + "/")
    }
    
    if(!fs.existsSync(storage_name + folder + "/" + record_id + "/")){
        fs.mkdirSync(storage_name + folder + "/" + record_id + "/")
    }   

    
    var multiple_files = files.multiple_files as UploadedFile[]
    var single_file = files.single_file as UploadedFile


    //sharp.cache(false);

    if(multiple_files){
        for(var file of multiple_files){
            await file.mv(storage_name + folder + "/" + record_id + "/" + file.name)
        }
    }

    if(single_file){
        await single_file.mv(storage_name + folder + "/" + record_id + "/" + single_file.name)
    }



    // if(multiple_files){
    //     for(var file of multiple_files){
    //         await file.mv(storage_name + "/" + file.name)
    //     }
    // }

    // if(single_file){
    //     await single_file.mv(storage_name + "/" + single_file.name)
    // }



    // if(multiple_files){
    //     for(let file of multiple_files){
    //         //sharp(path + file)
    //         sharp("/image_storage/" + folder + "/" + record_id + "/" + file)
    //         .jpeg()
    //         .jpeg({ quality: 100 })
    //         .jpeg({ progressive: true })
    //         .resize(200, 200)  
    //         .toFile("/image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
    //         // .toFile("./image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
    //         //.toFile("/image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
    //             if (err) {
    //             console.error(err);
    //             }else{
    //                 fs.unlinkSync("/image_storage/" + folder + "/" + record_id + "/" + file)
    //             }
    //         }) 
    //     }
    // }

    // if(single_file){
    //     sharp("/image_storage/" + folder + "/" + record_id + "/" + single_file)
    //     .jpeg()
    //     .jpeg({ quality: 100 })
    //     .jpeg({ progressive: true })
    //     .resize(200, 200)  
    //     .toFile("/image_storage/" + folder + "/" + record_id + "/" + single_file, (err: Error, info: any) => {
    //     // .toFile("./image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
    //     //.toFile("/image_storage/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
    //         if (err) {
    //         console.error(err);
    //         }else{
    //             fs.unlinkSync("/image_storage/" + folder + "/" + record_id + "/" + single_file)
    //         }
    //     }) 
    // }

}