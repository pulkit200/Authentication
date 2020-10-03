const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const PORT = process.env.PORT || 5000;

require('./config/passport')(passport);

//db
const db = require('./config/keys').MongoURI;

//mongo
mongoose.connect(db, {useNewUrlParser:true,useUnifiedTopology: true}).then(()=>{
    console.log('MongoDB is connected');
}).catch(err=>{
    console.log(err);
});

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

app.use(express.urlencoded({ extended: true }));

//Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//falsh
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//Routers
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));


app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
})