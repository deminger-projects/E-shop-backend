import * as fs from "fs"
import { FileArray, UploadedFile } from 'express-fileupload'

const sharp = require('sharp');


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
                }
              })
          }
       }else if(single_file){

 
    




        let inputFile  = single_file.name;
        let outputFile = single_file.name;
        
        sharp(inputFile).resize({ height: 780 }).toFile(outputFile)
            .then(function(newFileInfo) {
                // newFileInfo holds the output file properties
                console.log("Success")
            })
            .catch(function(err) {
                console.log("Error occured");
            });







          single_file.mv(path + "/" + single_file.name, (err) => { //save files in case of single file
            if(err){
              console.log("🚀 ~ file: save_files.ts:13 ~ file.mv ~ err:", err.message)
            }
          })
       }
      }
    }) 
  }
 
 