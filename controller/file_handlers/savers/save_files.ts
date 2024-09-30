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

    // if(!fs.existsSync("./image_storage/" + folder + "/")){
    //   fs.mkdirSync("/image_storage/" + folder + "/")
    // }

    // if(!fs.existsSync("./image_storage/" + folder + "/" + record_id + "/")){
    //   fs.mkdirSync("./image_storage/" + folder + "/" + record_id + "/")
    // }
      
    //fs.mkdirSync("./image_storage/" + "test/")

  if(!fs.existsSync("/image_storage/products/")){ // funguje takze by melo stacit predelat cesty i react 
    fs.mkdirSync("/image_storage/products/")
  }

  if(!fs.existsSync("/image_storage/products/151/")){ // funguje takze by melo stacit predelat cesty i react 
    fs.mkdirSync("/image_storage/products/151/")
  }

    var prom = []

    var multiple_files = files.multiple_files as UploadedFile[]
    var single_file = files.single_file as UploadedFile

    if(multiple_files){
      for await (const file of multiple_files){
        prom.push(file.mv(path + file.name))

       //var test_name = "products_" + file.name


      await file.mv("/image_storage/products/151" + file.name)
      }

      await Promise.all(prom)

    }else if(single_file){
      prom.push(single_file.mv(path + single_file.name))

      //single_file.mv("/image_storage/" + single_file.name)

      await Promise.all(prom)
    }
  }
