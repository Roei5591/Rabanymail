const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose.Promise = global.Promise;
//const md5 = require('md5');
//const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    //validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please Supply an email address'
  },

  //resetPasswordToken: String,
  //resetPasswordExpires: Date,
});


userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
