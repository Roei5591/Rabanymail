const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const promisify = require('es6-promisify');





exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};


exports.register = async (req, res, next) => {
  const user = new User({ username: req.body.username });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); 
};

exports.login =  (req, res, next) => { 
  passport.authenticate("local", (err, user, info) => {
  if (err) throw err;
  if (!user) res.send("No User Exists");
  else {
    req.logIn(user, (err) => {
      if (err) throw err;
      res.send("Successfully Authenticated");
      console.log(req.user);
    });
  }
})(req, res, next)

};

exports.logout = (req, res) => {
  //const name = req.user.username
  req.logout();
  res.send("logout");
};

exports.isLoggedIn = (req, res, next) => {
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


  //console.log(req.body);
  
  const username = req.body.to.split(',').map( mail => mail.split('@')[0].trim());
 
  //console.log("NAME: " + username);
  const user = await User.find({ username: username });
  //console.log(user);
  if(user.length == 0){
    console.log("No user"); 
    res.status(400).send("nop");
    //throw new Error("User do not Exist!");
  } else {
  res.locals.user = user;
  next();
  }
};

