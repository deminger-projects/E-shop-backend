export default function receipt_template(products: Array<any>, order_code: string, customer_obj: any){

    var products_string = ""

    products_string += "<p>Hey,</p>"
    products_string += "<p>thanks for your order. We are very happy to see new customers.</p>"
    products_string += "<p>Your order will come within 30, but most orders are delivered in 10 days.</p>"

    products_string += "<H3>Your order summary</H3>"

    products_string += "<p>order code: " + JSON.parse(order_code) + "</p> </br>"

    products_string += "<table>"

        products_string += "<tr> <th>Product name</th> <th>Price</th> <th>Quantity</th> </tr>"

        for(var item of products){

            products_string += "<tr>"

                products_string += "<td> " + item.name + " </td>"

                products_string += "<td> " + item.prize + " </td>"
                
                products_string += "<td> " + item.amount + " </td>"

            products_string += "</tr>"

        }

    products_string += "</table>"

    products_string += "<H3>Delivery information</H3>"

    products_string += "<table>"

    products_string += "<tr> <th>Name</th> <th>Surname</th> <th>Email</th> <th>Phone number</th> <th>Adress</th <th>City</th> <th>PSČ</th> </tr>"

        products_string += "<tr>"

            products_string += "<td> " + customer_obj.name + " </td>"
            
            products_string += "<td> " + customer_obj.surname + " </td>"

            products_string += "<td> " + customer_obj.email + " </td>"

            products_string += "<td> " + customer_obj.telephone + " </td>"

            products_string += "<td> " + customer_obj.adress + " </td>"

            products_string += "<td> " + customer_obj.city + " </td>"

            products_string += "<td> " + customer_obj.PSC + " </td>"

        products_string += "</tr>"

    products_string += "</table>"

    products_string += "<p>We hope you enjoyed shopping at Joynda.</p>"
    products_string += "<p>If you have any questions contact us at example@gmail.com.</p>"


    return(products_string)
}