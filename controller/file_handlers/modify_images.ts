import * as fs from "fs"
import sharp from "sharp";

export default function modify_images(path: string, record_id: number, folder: string){

    var files = fs.readdirSync(path)

    if(!fs.existsSync("./public/images/" + folder + "/")){
        fs.mkdirSync("./public/images/" + folder + "/")
    }

    if(!fs.existsSync("./public/images/" + folder + "/" + record_id)){
        fs.mkdirSync("./public/images/" + folder + "/" + record_id)
    }

    sharp.cache(false);

    for(let file of files){
        sharp(path + file)
        .jpeg()
        .jpeg({ quality: 100 })
        .jpeg({ progressive: true })
        .resize(200, 200)  
        .toFile("/image_storage/public/images/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
            if (err) {
            console.error(err);
            }else{
                fs.unlinkSync(path + file)
            }
        }) 
    }
} 
