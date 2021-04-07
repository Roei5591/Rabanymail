const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const messagesController = require('../controllers/messagesController');
const multer  = require('multer');


//serve the front-end
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
  })

  //route for incoming messages from sendgrid
router.post("/in", multer().any(),  catchErrors(userController.getUser) , catchErrors(messagesController.createMessage));




router.post('/register',
  userController.validateRegister,
  catchErrors(userController.register),
  );

  router.post('/login', userController.login);
  
  router.get("/user", userController.getUsername);
  router.get('/logout', userController.logout);

  router.post('/messages', catchErrors(messagesController.sendMessage));

  router.get('/messages/inbox' , catchErrors(messagesController.getInbox));


  router.post('/messages/allmail' , catchErrors(messagesController.getAllMail));


  router.get('/messages/sent' , catchErrors(messagesController.getSent));


  router.get('/messages/starred' , catchErrors(messagesController.getStarred));


  router.post('/messages/starred' , catchErrors(messagesController.toggleStarMassage));
  router.post('/messages/markasread' , catchErrors(messagesController.markAsRead));
  router.post('/messages/istrash' , catchErrors(messagesController.toggleIsTrash));
  router.post('/messages/deleteMessages' , catchErrors(messagesController.deleteMessages));

module.exports = router;