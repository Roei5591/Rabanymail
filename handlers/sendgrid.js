const sgMail = require('@sendgrid/mail');
require('dotenv').config({ path: 'variables.env' });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = sgMail;

exports.sendMail = (msg) => {
    //console.log(msg)
   return sgMail.send(msg)

  };

exports.sendMail = (msg) => {
    //console.log(msg)
   return sgMail.send(msg)

  };

  exports.sendMail2 = (msg) => {
    //console.log(msg)
    sgMail.send(msg)
    .then(() => {
    //  console.log(`Email sent to ${msg.to}`)
    })
    .catch((error) => {
      console.error(error)
    });
  };