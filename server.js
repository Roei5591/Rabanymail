const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
require('./models/User');
require('./models/Message');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
require('./handlers/passport');
const cors = require('cors');

const app = express();

app.use(express.static(__dirname +"/build"));


require('dotenv').config({ path: 'variables.env' });
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
      origin: process.env.CORS ,  
      credentials: true,
   })
  );


app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }));



mongoose.connect(process.env.DATABASE , {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex:true,
    useUnifiedTopology: true
   });

  

mongoose.connection.on('error', (err) => {
    console.error( err.message);
  });


app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);


app.get('*', function (req, res){
  res.sendFile(__dirname + '/build/index.html');
})


app.listen(port, () =>  console.log(`Server started on port ${port}`));

