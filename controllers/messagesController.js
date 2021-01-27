const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const promisify = require('es6-promisify');
const Message = mongoose.model('Message');
const sendgrid = require('../handlers/sendgrid');



exports.createMessage = async (req, res) => {

    const massage = {

    }
    const user = res.locals.user
    console.log("FETCH");
    console.log(req.body.from);
 
    res.send("G");
  };

  exports.sendMessage = async (req, res) => {

    let msg;
    req.user = { _id: "60099c9b214b1e0860e32d8b", username: "rrr" };
    //console.log("BEFORE SENDING");
    const to = req.body.to;
    //console.log(to);

    //await Message.deleteMany();

    for (const email of to) {
      try {
      req.body.to = email;
      req.body.from = req.user.username + "@rabanymail.com";
     
      msg = {...req.body};

      await sendgrid.send(msg);
      //console.log("email " + req.body.to);
      
      req.body.isStarred = false;
      req.body.isOutbound = true;
      req.body.user = req.user._id;

      const message = new Message(req.body);  
         
      await message.save()
      
        //console.log("Messege saved to DB " +  req.body.to);
        
      } catch(error) {
        console.error(error)
      }

      //console.log("AFTER" + req.body.to);
    }  
    res.send("msg");   
  };



  exports.sendMessage2 = async (req, res) => {

    let msg;
    req.user = { _id: "60099c9b214b1e0860e32d8b", username: "rrr" };
    //console.log("BEFORE SENDING");
    const to = req.body.to;
    //console.log(to);
    for (const email of to) {

      req.body.to = email;
      req.body.from = req.user.username + "@rabanymail.com";
     
      msg = {...req.body};
      console.log("email " + req.body.to);
      
      req.body.isStarred = false;
      req.body.isOutbound = true;
      req.body.user = req.user._id;

      const message = new Message(req.body);   
      message.save().then(() => {
        //console.log("Messege saved to DB " +  req.body.to);
        sendgrid.sendMail(msg);
      }).catch((error) => {
        console.error(error)
      });

      //console.log("AFTER" + req.body.to);
    }  
    res.send("msg");   
  };

  exports.sendMessage3 = async (req, res) => {


    //req.body.to = req.body.to.replace(" ","").split(",");

    //console.log(req.body.to);
    console.log(req.user);
  
    const msgq = {
      to: '	rrr@rabanymail.com', // Change to your recipient
      from: '	rrr@rabanymail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
     
    
    const msg = {
      to: '	rrr@rabanymail.com', // Change to your recipient
      from: '	rrr@rabanymail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    res.send(req.user);
  };




  