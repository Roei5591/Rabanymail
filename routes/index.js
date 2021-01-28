const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const messagesController = require('../controllers/messagesController');
const bodyParser = require('body-parser');
const multer  = require('multer');

//router.get("/", (req, res) => res.send("hello world"));

router.post("/", multer().any(),  catchErrors(userController.getUsername) , catchErrors(messagesController.createMessage));

//router.post("/" , catchErrors(messagesController.createMessage));

router.post('/register',
  //userController.validateRegister,
  catchErrors(userController.register),
 // catchErrors(userController.login)
  );

  router.post('/login', userController.login);


  //dev
  router.get("/user", (req, res) => {
    console.log(req.user);
    res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
  });

  router.get('/logout', userController.logout);

  router.post('/messages', catchErrors(messagesController.sendMessage));
  router.get('/messages/inbox/' , catchErrors(messagesController.getInbox));
  router.get('/messages/inbox/:userId' , catchErrors(messagesController.getInbox));

  router.get('/messages/sent/' , catchErrors(messagesController.getSent));
  router.get('/messages/sent/:userId' , catchErrors(messagesController.getSent));

  

module.exports = router;