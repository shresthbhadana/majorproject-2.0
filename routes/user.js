const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router = express.Router();
const usercontroller = require("../controller/user.js");

router.get("/signup",(req,res) => {
    res.render("users/signup.ejs");
});
router.post("/signup",
     wrapAsync(usercontroller.signup ));

router.get("/login",
    (req,res) => {
res.render("users/login.ejs")
});
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}),usercontroller.login)

   router.get("/logout",usercontroller.logout ) 

module.exports = router;

