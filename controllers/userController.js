const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const { body, validationResult } = require('express-validator');



exports.validateRegister = async (req, res, next) => {
 
    await body('username', 'You must supply a name!').notEmpty().run(req),
    await body('username').custom(value => {
      return  User.findOne({ username: req.body.username }).then(user => {
        if (user) {
          return Promise.reject('User name is already exist');
        }
      })
     }).run(req)
    await body('password', 'Password Cannot be Blank!').notEmpty().run(req);
    await body('passwordConfirm', 'Confirmed Password cannot be blank!').notEmpty().run(req);
    await body('passwordConfirm', 'Oops! Your passwords do not match').equals(req.body.password).run(req);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.errors)
    res.send(errors.errors)
    return; 
  }
  
  next(); // there were no errors!
};


exports.validateRegister2 = (req, res, next) => {
  req.sanitizeBody('username');
  req.checkBody('username', 'You must supply a name!').notEmpty();
  req.checkBody('username', 'You must supply a name!').notEmpty();
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('passwordConfirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('passwordConfirm', 'Oops! Your passwords do not match').equals(req.body.password);
  console.log("register");
  const errors = req.validationErrors();
  if (errors) {
   // req.flash('error', errors.map(err => err.msg));
   // res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
   console.log(errors)
    return; // stop the fn from running
  }
  res.send("");
 // next(); // there were no errors!
};


exports.register = async (req, res) => {
  const user = new User({ username: req.body.username });
  await User.register(user, req.body.password);
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
})(req, res, next)

};

exports.logout = (req, res) => {
  //const name = req.user.username
  req.logout();
  res.send("logout");
};

exports.getUser = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    res.send({username : req.user.username , firstChar:  req.user.username[0]}); 
  } else {
    res.send({username : "" , firstChar:  ""});
  }
};

exports.isLoggedIn2 = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;
  } else console.log("NO USER A");

  
  res.redirect('/login');
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated the profile!');
  res.redirect('back');
};

exports.getUsername = async (req, res , next) => {

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

exports.getUsername2 = async (EmailAddress) => {


  //console.log(req.body);
  
  const username =  EmailAddress.split('@').trim();
 
  //console.log("NAME: " + username);
  const user = await User.findOne({ username: username });
  //console.log(user);

  return user;
};