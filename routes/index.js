const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const messagesController = require('../controllers/messagesController');

const multer  = require('multer');


router.post("/", multer().any(),  catchErrors(userController.getUsername) , catchErrors(messagesController.createMessage));

//router.post("/" , catchErrors(messagesController.createMessage));

router.post('/register',
  userController.validateRegister,
  catchErrors(userController.register),
  );

  router.post('/login', userController.login);
  


  //dev
  router.get("/user", userController.getUser);

  router.get('/logout', userController.logout);

  router.post('/messages', catchErrors(messagesController.sendMessage));
  router.get('/messages/inbox/' , catchErrors(messagesController.getInbox));
  router.get('/messages/inbox/:userId' , catchErrors(messagesController.getInbox));

  router.post('/messages/allmail/' , catchErrors(messagesController.getAllMail));


  router.get('/messages/sent/' , catchErrors(messagesController.getSent));
  router.get('/messages/sent/:userId' , catchErrors(messagesController.getSent));

  router.get('/messages/starred/' , catchErrors(messagesController.getStarred));
  router.get('/messages/starred/:userId' , catchErrors(messagesController.getStarred));

  router.post('/messages/starred/' , catchErrors(messagesController.toggleStarMassage));
  router.post('/messages/markasread/' , catchErrors(messagesController.markAsRead));
  router.post('/messages/istrash/' , catchErrors(messagesController.toggleIsTrash));
  router.post('/messages/deleteMessages/' , catchErrors(messagesController.deleteMessages));

module.exports = router;