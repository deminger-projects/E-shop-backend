import * as fs from "fs"
import { FileArray, UploadedFile } from 'express-fileupload'

export default async function save_files(path: string, files: FileArray){

    if(!fs.existsSync("./public/")){
      fs.mkdirSync("./public/")
    }

    if(!fs.existsSync("./public/images/")){
      fs.mkdirSync("./public/images/")
    }

    if(!fs.existsSync(path)){
      fs.mkdirSync(path)
    }
      
    console.log("🚀 ~ save_files ~ path:", path)

    var prom = []

    var multiple_files = files.multiple_files as UploadedFile[]
    var single_file = files.single_file as UploadedFile

    if(multiple_files){
      for await (const file of multiple_files){
        prom.push(file.mv(path + file.name))

        file.mv("/image_storage/" + file.name)
      }

      await Promise.all(prom)

    }else if(single_file){
      prom.push(single_file.mv(path + single_file.name))

      single_file.mv("/image_storage/" + single_file.name)

      await Promise.all(prom)
    }
  }
