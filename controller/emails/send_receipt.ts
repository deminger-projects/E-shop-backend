import * as nodemailer from "nodemailer"
import receipt_template from "./receipt_template";

export default function send_receipt(email: string, products: any, order_id: number){
console.log("🚀 ~ send_receipt ~ products:", products)

    var transporter = nodemailer.createTransport({
        host: 'smtp.seznam.cz',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'test2584884@seznam.cz',
            pass: 'test.test1'
        }
        });

        var html_template = receipt_template(products, order_id)
        
        var mailOptions = {
          from: 'test2584884@seznam.cz',
          to: email,
          subject: 'order receipt',
          html : html_template
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
      })
    
}