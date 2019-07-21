const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments create
router.post("/", middleware.isLoggedIn, (req, res) =>{
    Campground.findById(req.params.id, (err, campground) =>{
        if(err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) =>{
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(comment);
                } else {
                    //add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        } 
    });
});

//edit route. NOTE: you can not use the same param twice in the route e.i :id/coments/:id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) =>{
    Comment.findById(req.params.comment_id, (err, foundComment) =>{
        err ? res.redirect("back") : res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    });
});

//UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, err =>{
        err ? res.redirect("back") : req.flash("success", "Comment Removed"), res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;