export default function receipt_template(products: Array<any>, order_code: string){

    var products_string = ""

    products_string += "<p>Hey,</p>"
    products_string += "<p>thanks for your order. We are very happy to see new customers.</p>"
    products_string += "<p>Your order will come within 30, but most orders are delivered in 10 dasy.</p>"

    products_string += "<H3>Your order summary</H3>"

    products_string = "<p>order code: " + JSON.parse(order_code) + "</p> </br>"

    for(var item of products){
        products_string += "<p>product name: " + item.name + "</p> </br> <p>product price: " + item.prize + "</p> </br> <p>quantity: " + item.amount + "</p>"
    }

    products_string += "<p>We hope you enjoyed shopping at Joynda.</p>"
    products_string += "<p>If you have any questions contact us at example@gmail.com.</p>"



    return(
        products_string
    )
}