const stripe = require("stripe")("sk_test_51OHsB9C2agLPKl6uq4bSJh45m0Jl4tVzcdIFxiednewjV17crrnvGYoslGSfS4dBwH1OjNJpc3I3TS6ZCboS5tiN00xHXbm7Oy")

export default async function stripe_payment(items: Array<{name: string, prize: number, amount: number}>, tables: object, callback: Function){

    try{

        // await stripe.customers.create({
        //     description: JSON.stringify(tables)

        //   }, async (err: any, customer: any) => {
        //     if(err){
        //         console.log("🚀 ~ file: stripe.ts:14 ~ stripe_payment ~ err:", err.msg)
        //     }else{
        //         console.log("🚀 ~ file: stripe.ts:13 ~ stripe_payment ~ customer:", customer)

        //         const session = await stripe.checkout.sessions.create({
        //             payment_method_types: ["card"],
        //             mode: "payment",
        //             metadata: {a: "pes"},
        //             line_items: items.map((item) => {return {price_data: {currency: "usd", product_data: {name: item.name}, unit_amount: item.prize * 100}, quantity: item.amount}}),
        //             success_url: "http://nike.com",
        //             cancel_url: "http://nike.com"
        //         }) 
                    
        //         // callback(session)  
        //     }
        //   });


          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            metadata: {tables: JSON.stringify(tables)},
            customer: stripe.customers.create({
                metadata: {a: "penis"}}),
            line_items: items.map((item) => {return {price_data: {currency: "usd", product_data: {name: item.name}, unit_amount: item.prize * 100}, quantity: item.amount}}),
            success_url: "http://nike.com",
            cancel_url: "http://nike.com"
        }) 

        callback(session)
    
    } catch(err) {
        if(err){
            console.log("🚀 ~ file: stripe.ts:17 ~ stripe_payment ~ err:", err)
        }
    } 

}
  