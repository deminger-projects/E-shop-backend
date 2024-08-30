import * as nodemailer from "nodemailer"

export default function send_emails(email: Array<string>, code: string){

    var msg = ""

    msg += "<p>Hey,</p>"
    msg += "<p>lower you can find your authentication code.</p>"

    msg += "<p>Please do not answer to this email.</p>"
    msg += "<p>This email was created automatically.</p>"

    msg += "<H3>Your authentication code</H3>"

    msg += "<p>Authentication code: " + code + "</p>"

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
        to: email,
        subject: 'Your authentication code',
        html: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })
}
