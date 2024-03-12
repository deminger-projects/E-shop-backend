var Jimp = require("jimp");
import * as fs from "fs"


export default function modify_images(file: any, path: string){


    var files = fs.readdirSync(path)

    for(let file of files){
        Jimp.read(path + "/" + file, (err: Error, lenna:any) => {
            if(err){
                console.log("🚀 ~ Jimp.read ~ err:", err)
            }else{
                lenna
                .resize(1000, 1000) // resize
                .quality(50) // set JPEG quality
                .greyscale() // set greyscale
                .write("pes.jpg"); // save
            }
        });
    }
    

































// var files = fs.readdirSync(path)

// for(let file of files){
//     //fs.unlinkSync(path + "/" + file)
// }

// // // Input file
//  const inputFile = path + "/" + files;
// // // Output file

// const outputFile = path + "/test_" + files;
// // Resize the image to fit within a specific width and height

    // for(let file of files){
    //     sharp(path + "/" + file)
    //     .jpeg()
    //     .jpeg({ quality: 50 })
    //     .jpeg({ progressive: true })
    //     .resize(1,280 , 720)  //HD pixels
    //     .toFile(outputFile, (err: Error, info: any) => {
    //         if (err) {
    //         console.error(err);
    //         } else {
    //         console.log(`Resized image to info:` + err);
    //         }
    //     });
    // }


}