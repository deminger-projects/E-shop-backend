import * as fs from "fs"
import sharp from "sharp";
var rimraf = require("rimraf");

export default function modify_images(path: string, record_id: number, folder: string){

    var files = fs.readdirSync(path)
    console.log("🚀 ~ modify_images ~ files:", files)

    fs.mkdirSync("./public/images/" + folder + "/" + record_id)

    for(let file of files){
        sharp(path + file)
        .jpeg()
        .jpeg({ quality: 50 })
        .jpeg({ progressive: true })
        .resize(1280, 720)  //HD pixels
        .toFile("./public/images/collections/" + record_id + "/" + file, (err: Error, info: any) => {
            if (err) {
            console.error(err);
            }
        })
    }

    console.log(path + files[0])

    for(let file of files){
        fs.unlinkSync(path + file)
    }

}