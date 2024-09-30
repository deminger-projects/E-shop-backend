import * as fs from "fs"
import { FileArray, UploadedFile } from 'express-fileupload'

export default async function save_files(path: string, files: FileArray, record_id: number, folder: string){

    if(!fs.existsSync("./public/")){
      fs.mkdirSync("./public/")
    }

    if(!fs.existsSync("./public/images/")){
      fs.mkdirSync("./public/images/")
    }

    if(!fs.existsSync(path)){
      fs.mkdirSync(path)
    }

    // if(!fs.existsSync("./image_storage/" + folder + "/")){
    //   fs.mkdirSync("/image_storage/" + folder + "/")
    // }

    // if(!fs.existsSync("./image_storage/" + folder + "/" + record_id + "/")){
    //   fs.mkdirSync("./image_storage/" + folder + "/" + record_id + "/")
    // }
      

    var prom = []

    var multiple_files = files.multiple_files as UploadedFile[]
    var single_file = files.single_file as UploadedFile

    if(multiple_files){
      for await (const file of multiple_files){
        prom.push(file.mv(path + file.name))

        file.mv("/image_storage/" + folder + "/" + record_id + "/" + file.name)
      }

      await Promise.all(prom)

    }else if(single_file){
      prom.push(single_file.mv(path + single_file.name))

      single_file.mv("/image_storage/" + folder + "/" + record_id + "/" + single_file.name)

      await Promise.all(prom)
    }
  }
