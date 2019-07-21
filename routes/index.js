const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//Root Route
router.get("/", (req, res) => {
    res.render("landing");
});

//register form route 
router.get('/register', (req, res) => {
    res.render('register');
});

//handel sign up logic 
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            return res.redirect('/register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username );
            res.redirect('/campgrounds');
        });
    });
});

//show login form route
router.get('/login', (req, res) =>{
    res.render('login');
});

//handel login logic
router.post('/login', passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) =>{
});

//logout out
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash("success", "You are logged out");
    res.redirect('/campgrounds');
});

module.exports = router;