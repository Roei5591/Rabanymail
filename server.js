const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
require('./models/User');
require('./models/Message');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const promisify = require('es6-promisify');
require('./handlers/passport');





const cors = require('cors');

 

const app = express();

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });
const port = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//app.use(cors());

app.use(
    cors({
      origin: "http://localhost:3000", // <-- location of the react app were connecting to
      credentials: true,
    })
  );

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }));




mongoose.connect(process.env.DATABASE , {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex:true,
    useUnifiedTopology: true
   });

   mongoose.Promise = global.Promise;

mongoose.connection.on('error', (err) => {
    console.error( err.message);
  });

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);

app.use((req, res, next) => {req.login = promisify(req.login, req);  next();});


app.listen(port, () =>  console.log(`Server started on port ${port}`));


