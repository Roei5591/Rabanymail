const mongoose = require('mongoose');
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

      try {
    
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
    
    req.body._id = message._id;
    //await Message.deleteMany();

    delete req.body.user;

    res.send(req.body);   
  };


  exports.getAllMail = async (req, res) => {

    //req.isAuthenticated();

    const mailSize = req.body.mailSize;

    const needToUpdate = false
    
    let allMailCount = 0;
    
    if(mailSize !== 0 ){
    allMailCount = await Message.countDocuments({user: req.user._id});
    }

    if(mailSize === 0 || allMailCount !== mailSize) {
    
    const allMail = await Message.find({user: req.user._id});
   
    allMail.forEach(mail => {
      delete mail._doc.user;
      return mail;
    });

    res.send({allMail , needToUpdate : true});  
  } else {
    res.send({ needToUpdate : false}); 
  }
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








//not in use for now
exports.getInbox = async (req, res) => {

  req.isAuthenticated();
  
  const inbox = await Message.find({user: req.user._id , isOutbound: false});
 
  inbox.forEach(mail => {
    delete mail._doc.user;
    return mail;
  });

  res.send(inbox);   
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









  