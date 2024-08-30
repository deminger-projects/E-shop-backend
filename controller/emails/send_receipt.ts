import * as nodemailer from "nodemailer"
import receipt_template from "./receipt_template";

export default function send_receipt(email: string, products: any, order_code: string){

    var transporter = nodemailer.createTransport({
        host: 'smtp.seznam.cz',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.COMPANY_EMAIL,
            pass: process.env.COMPANY_EMAIL_PSW
        }
        });

        var html_template = receipt_template(products, order_code)
        
        var mailOptions = {
          from: process.env.COMPANY_EMAIL,
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
