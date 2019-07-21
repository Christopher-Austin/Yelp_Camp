const express        = require("express"),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
passport       = require('passport'),
LocalStragatey = require('passport-local'),
port           = 3000,
flash          = require("connect-flash"),
Campground     = require("./models/campground"),
Comment        = require("./models/comment"),
User           = require('./models/user'),
methodOverride = require('method-override'),
app            = express(),
seedDB         = require("./seeds")

//requiring routes
const commentRoutes    = require('./routes/comments'),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed the database
// seedDB();      

//Passport config
app.use(require('express-session')({
    secret: "This is what I use to encrypt",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStragatey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, () => console.log("Yelp Camp v12 is running!"));