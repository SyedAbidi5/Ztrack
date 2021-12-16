const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require("passport");
router.get("/", function(req, res){
    res.render("home");
  });
  
router.get("/login", function(req, res){
    res.render("login");
  });
  
router.get("/register", function(req, res){
    res.render("register");
  });
  
router.get("/dashboard", function(req, res){
  res.set('Cache-Control', 'no-store');
    if (req.isAuthenticated()){
      res.render("dashboard");
    } else {
      res.redirect("/login");
    }
  });
  
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });
  
router.post("/register", function(req, res){
  
    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/dashboard");
        });
      }
    });
  
  });
  
router.post("/login", function(req, res){
  
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/dashboard");
        });
      }
    });
  
  });

  module.exports = router;