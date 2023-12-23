import * as fs from "fs"

export default function add_item(product: object, selected_size: object){

    var my_data = fs.readFileSync('../client/src/data/cart.json', "utf-8");

    var data = {
        product: product,
        size_data: selected_size
    }

    if(my_data.length === 0){
        fs.writeFileSync('../client/src/data/cart.json', (JSON.stringify([data])))
    }else{
        const json = JSON.parse(my_data)
        json.push(data)
        fs.writeFileSync("../client/src/data/cart.json", JSON.stringify(json))
    }
}