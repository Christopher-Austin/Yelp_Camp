const express = require('express');
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//index route
router.get("/",(req, res) =>{
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
        }
    });
});

//CREATE route
router.post("/", middleware.isLoggedIn, (req, res) =>{
    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: image, description: desc, author: author};
    console.log(req.user);
    //create new campground and add to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//New form page to add new
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    res.render("campgrounds/new");
});

//SHOW page Gives you info about specific
router.get("/:id", function(req, res){
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edi campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) =>{ 
    Campground.findById (req.params.id,(err, foundCampground) =>{
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) =>{
    //Find and update the correct campgorund
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        //redirect somewhere
        err ? res.redirect("/campgrounds") : res.redirect("/campgrounds/" + updatedCampground.id);
    });
});

//Distroy route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err =>{
        err ? res.redirect("/campgrounds") : res.redirect("/campgrounds");
    });
});

module.exports = router;