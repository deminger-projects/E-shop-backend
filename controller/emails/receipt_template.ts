export default function receipt_template(products: Array<any>, order_id: number){

    var products_string = "<p>order number: " + order_id + "</p> </br>"

    for(var item of products){
        products_string += "<p>product name: " + item.name + "</p> </br> <p>product price: " + item.prize + "</p> </br> <p>quantity: " + item.amount + "</p>"
    }

    return(
        products_string
    )
}