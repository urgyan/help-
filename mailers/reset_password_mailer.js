const nodeMailer = require('../config/node_mailer');


// this is another way of exporting a method
exports.newToken = (resettoken) => {
    console.log('inside newComment mailer', resettoken);
    let htmlString = nodeMailer.renderTemplate({resettoken:resettoken},'/resettoken/new_reset_token.ejs')
    nodeMailer.transporter.sendMail({
       from: 'vaid77167@gmail.com',
       to: resettoken.user.email,
       subject: "Reset Password token is sent!!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        // console.log('Message sent', info);
        return;
    });
}