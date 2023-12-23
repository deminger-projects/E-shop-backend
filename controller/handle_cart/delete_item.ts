import * as fs from "fs"

export default function delete_item(item_id: number){

    var my_data = fs.readFileSync('../client/src/data/cart.json', "utf-8");

    var json_arr = JSON.parse(my_data)

    json_arr.splice(item_id, 1)

    fs.writeFileSync("../client/src/data/cart.json", JSON.stringify(json_arr))
}
