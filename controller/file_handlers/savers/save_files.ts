import * as fs from "fs"
import { FileArray, UploadedFile } from 'express-fileupload'
import modify_images from "../modify_images"

export default async function save_files(path: string, files: FileArray){

    fs.mkdir(path, (err) => {   // creates folder
      if(err){
        console.log("🚀 ~ file: save_files.ts:8 ~ fs.mkdir ~ err:", err.message)
      }else{
       var multiple_files = files.multiple_files as UploadedFile[]
       var single_file = files.single_file as UploadedFile

       if(multiple_files){
          for (let index = 0; index < multiple_files.length; index++) {
              multiple_files[index].mv(path + "/" + multiple_files[index].name, (err) => { //save files in case of multiple files
                if(err){
                  console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message)
                }else{
                  modify_images(undefined, path)
                }
              })
          }
       }else if(single_file){
          single_file.mv(path + "/" + single_file.name, (err) => { //save files in case of single file
            if(err){
              console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message)
            }else{
              modify_images(single_file, path)
            }
          })
       }
      }
    }) 
  }
 
 