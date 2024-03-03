import * as fs from "fs"

export default function add_item(product: object, selected_size: object){

    var my_data = JSON.parse(fs.readFileSync('../client/src/data/cart.json', "utf-8"));

    var data = {
        product: product,
        size_data: selected_size
    }

    var next = true

    for (let index = 0; index < my_data.length; index++) {
        
        if(Number(my_data[index].product.products[0].id) === Number(data.product.products[0].id) && my_data[index].size_data.size === data.size_data.size){
            my_data[index].size_data.current_amount = my_data[index].size_data.current_amount + selected_size.current_amount
            next = false
            break
        }
    }

    if(my_data.length === 0){
        fs.writeFileSync('../client/src/data/cart.json', (JSON.stringify([data])))
    }else{
        if(next){
            my_data.push(data)
        }
        fs.writeFileSync("../client/src/data/cart.json", JSON.stringify(my_data))
    }
}