export default function receipt_template(products: Array<any>, order_code: string){

    

    var products_string = "<p style='height:100px;background:red; color:red;'>order code: " + JSON.parse(order_code) + "</p> </br>"

    for(var item of products){
        products_string += "<p>product name: " + item.name + "</p> </br> <p>product price: " + item.prize + "</p> </br> <p>quantity: " + item.amount + "</p>"
    }

    return(
        products_string
    )
}