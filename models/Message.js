const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const messageSchema = new mongoose.Schema({
	from: {
		type: String,
		trim: true,
		required: 'Please enter '
    },
    to: {
		type: [String],
		trim: true,
		required: 'Please enter '
	},
	subject: {
		type: String,
        trim: true,
        default:"(no subject)"
    },
    text: String,
    html:String,
	created: {
		type: Date,
		default: Date.now
	},
	user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply a User'
    },
    isStarred: {
        type:Boolean,
        default: false
    },
    isRead:{
      type:Boolean,
      default: false
  },
    isOutbound: {
        type:Boolean,
        default: false
    },

      
  });

// Define our indexes


function autopopulate(next) {
  this.populate('user');
  next();
}

messageSchema.pre('find', autopopulate);
messageSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Message' , messageSchema );