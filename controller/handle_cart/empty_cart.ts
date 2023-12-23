import * as fs from "fs"

export default function empty_cart(){

    fs.writeFileSync("../client/src/data/cart.json", JSON.stringify([]))
}