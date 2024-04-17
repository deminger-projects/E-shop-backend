import * as fs from "fs"
import sharp from "sharp";

export default function modify_images(path: string, record_id: number, folder: string){

    var files = fs.readdirSync(path)

    if(!fs.existsSync("./public/images/" + folder + "/" + record_id)){
        fs.mkdirSync("./public/images/" + folder + "/" + record_id)
    }

    sharp.cache(false);

    for(let file of files){
        sharp(path + file)
        .jpeg()
        .jpeg({ quality: 50 })
        .jpeg({ progressive: true })
        .resize(1920, 1080)  //HD pixels
        .toFile("./public/images/" + folder + "/" + record_id + "/" + file, (err: Error, info: any) => {
            if (err) {
            console.error(err);
            }else{
                fs.unlinkSync(path + file)
            }
        }) 
    }
} 