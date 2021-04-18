const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const { body, validationResult } = require('express-validator');



exports.validateRegister = async (req, res, next) => {
    req.body.username += "@rabanymail.com";

    const validations = [
     body('username').custom(username => {
      if(username.length < 18 || username.length > 35) return Promise.reject('User name should be between 3 and 20 characters');
      username = username.split("@")[0];
      return  User.findOne({ username }).then(user => {
        if (user) {
          return Promise.reject('User name is already exist');
        }
      })
     }) ,
     body('username', 'invalid username').isEmail() ,
     body('password').custom(password => {
      if(password.length < 4 || password.length > 10) return Promise.reject('password should be between 4 and 10 characters');
      return  Promise.resolve();
     }),
     body('passwordConfirm', 'Oops! Your passwords do not match').equals(req.body.password),
    ]

    //run all the validators
    await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(errors.errors)
    return; 
  }
  req.body.username = req.body.username.split("@")[0];

  next(); // there were no errors!
};


exports.register = async (req, res) => {
  const user = new User({ username: req.body.username });
  await User.register(user, req.body.password);
  //return empty error array
  res.send([]);
};


exports.login =  (req, res, next) => { 
  
  return passport.authenticate("local", (err, user, info) => {
  if (err) throw err;
  if (!user){
    res.send(""); }
  else {
    req.logIn(user, (err) => {
      if (err) throw err;
      res.send({username : user.username , firstChar:  user.username[0]}); 
    });
  }
} )(req, res, next)

};

exports.logout = (req, res) => {
  
  req.logout();
  res.send("logout");
};

exports.getUsername = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    res.send({username : req.user.username , firstChar:  req.user.username[0]}); 
  } else {
    res.send({username : "" , firstChar:  ""});
  }
};


exports.getUser = async (req, res , next) => {

  const usernames = req.body.to.split(',').map( mail => mail.split('@')[0].trim());
 
  const users = await User.find({ username: usernames });

  if(users.length == 0){
    res.status(400).send("nop");
    throw new Error("User do not Exist!");
  } else {
  res.locals.users = users;
  next();
  }
};


