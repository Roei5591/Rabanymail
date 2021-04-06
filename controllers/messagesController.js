const mongoose = require('mongoose');
const passport = require('passport');
const promisify = require('es6-promisify');
const Message = mongoose.model('Message');
const sendgrid = require('../handlers/sendgrid');
const parser = require('../handlers/parser');


//to delete
const User = mongoose.model('User');

//receiving mail
exports.createMessage = async (req, res) => {
  
  const users = res.locals.users; 
  const msg = parser.parseMessage(req);


  for(const user of users) {
    try {
      msg.to = `${user.username}@rabanymail.com`;
      msg.user = user._id;

      const message = new Message(msg);
      await message.save();

    } catch(error) {
        console.error(error)
    }
  }

    res.send("All good");

  };


  //send mail
  exports.sendMessage = async (req, res) => {

    let msg;


    //const to = req.body.to;

    console.log("send here:")
    
 
    
      try {
      //req.body.to = email;
      req.body.from = `${req.user.username}@rabanymail.com`;
     
      msg = {...req.body};

      await sendgrid.send(msg);
        
      } catch(error) {
        console.error(error.response.body.errors)
      }

     

   // req.body.to = to;
    req.body.isOutbound = true;
    req.body.isRead = true;
    req.body.user = req.user._id;
   
    const message = new Message(req.body);  
         
    await message.save()

    //await Message.deleteMany();

    delete req.body.user;

    res.send(req.body);   
  };


  exports.getInbox = async (req, res) => {

    req.isAuthenticated();
    
    const inbox = await Message.find({user: req.user._id , isOutbound: false});
   
    inbox.forEach(mail => {
      delete mail._doc.user;
      return mail;
    });
  
    res.send(inbox);   
  };

  exports.getAllMail = async (req, res) => {

    //req.isAuthenticated();

    const mailSize = req.body.mailSize;

    const needToUpdate = false
    const allMail = await Message.find({user: req.user._id});
    
    if(allMail.length !== mailSize) {
    allMail.forEach(mail => {
      delete mail._doc.user;
      return mail;
    });

    res.send({allMail , needToUpdate : true});  
  } else {
    res.send({allMail : [] , needToUpdate : false}); 
  }
  };

  exports.getSent = async (req, res) => {

    const username = "rrr";
    req.user = req.user || await User.findOne({ username: username });


    const userId =  req.params.userId || req.user._id;
    
    const inbox = await Message.find({user: userId  , isOutbound: true});

    res.send(inbox);   
  };

  exports.getStarred = async (req, res) => {

    const username = "rrr";
    req.user = req.user || await User.findOne({ username: username });


    const userId =  req.params.userId || req.user._id;
    
    const inbox = await Message.find({user: userId  , isStarred: true});

    res.send(inbox);   
  };

  exports.toggleStarMassage = async (req, res) => {

     
    const messageId = req.body.mailId;
    
    const toggle = !(await Message.findById( messageId)).isStarred;
    await Message.updateMany({_id: messageId},  
      {isStarred: toggle}, function (err, docs) { 
      if (err){ 
        res.send(err); 
      }  
  }); 

    res.send("star");   
  };
  
  exports.deleteMessages = async (req, res) => {

    const messageId = req.body.mailId;
    
  
    await Message.deleteMany({_id: messageId} , function (err) {
       
      if (err){ 
        res.send(err); 
      } 
    }); 


    res.send("remove");   
  };

  exports.toggleIsTrash = async (req, res) => {

    const messageId = req.body.mailId;
    
    const toggle = !(await Message.findById( messageId[0])).isTrash;
    await Message.updateMany({_id: messageId},  
      {isTrash: toggle}, function (err) {
       
      if (err){ 
        res.send(err); 
      }  
  }); 

    res.send("star");   
  };

  exports.markAsRead = async (req, res) => {

    const messageId = req.body.mailId;
    const isRead = req.body.isRead;
    
    await Message.updateMany({_id: messageId},  
      {isRead}, function (err) { 
      if (err){ 
        res.send(err); 
      }  
  }); 

    res.send("star");   
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





  