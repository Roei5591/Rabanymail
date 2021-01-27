const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const messagesController = require('../controllers/messagesController');
const bodyParser = require('body-parser');
const multer  = require('multer');

router.get("/", (req, res) => res.send("hello world"));

router.post("/", multer().any(),  catchErrors(userController.getUsername) , messagesController.createMessage);

router.post('/register',
  //userController.validateRegister,
  // we need to know about errors if 
  // validation will be passed, but registration 
  // will be failed in some reasons, e.g. second 
  // registration with same email
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

  router.post('/m',  messagesController.sendMessage);


  

module.exports = router;