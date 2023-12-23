"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe = require("stripe")("sk_test_51OHsB9C2agLPKl6uq4bSJh45m0Jl4tVzcdIFxiednewjV17crrnvGYoslGSfS4dBwH1OjNJpc3I3TS6ZCboS5tiN00xHXbm7Oy");
function stripe_payment(items, tables, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                metadata: { tables: JSON.stringify(tables) },
                customer: stripe.customers.create({
                    metadata: { a: "penis" }
                }),
                line_items: items.map((item) => { return { price_data: { currency: "usd", product_data: { name: item.name }, unit_amount: item.prize * 100 }, quantity: item.amount }; }),
                success_url: "http://nike.com",
                cancel_url: "http://nike.com"
            });
            callback(session);
        }
        catch (err) {
            if (err) {
                console.log("🚀 ~ file: stripe.ts:17 ~ stripe_payment ~ err:", err);
            }
        }
    });
}
exports.default = stripe_payment;
