import * as nodemailer from "nodemailer"

export default function send_emails(email: Array<string>, msg: string){

    var transporter = nodemailer.createTransport({
      host: 'smtp.seznam.cz',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: 'test2584884@seznam.cz',
          pass: 'test.test1'
      }
      });
      
      var mailOptions = {
        from: 'test2584884@seznam.cz',
        to: 'dominikjan1@gmail.com',
        subject: 'Sending Email using Node.js',
        text: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })
}
