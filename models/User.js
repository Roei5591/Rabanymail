const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },

});


userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
