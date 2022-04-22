const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// passport config
require('./config/passport')(passport);


const app = express();

let PORT = process.env.PORT || 3000;

// DB config
const db = require('./config/keys').MongoURI;

//  Connect to mongo
mongoose.connect(db)
    .then(() => {
        console.log('Mongo Connection Open!');
    })
    .catch((err) => {
        console.log('Oh No Connection Errror!!!');
        console.log(err);
    })

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// bodyparser
app.use(express.urlencoded({extended: false}));

// Express Session
app.use(session({
    secret: 'flashblog',
    saveUninitialized: true,
    resave: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`listening on ${PORT}`));