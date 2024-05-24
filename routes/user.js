const express= require("express");
const wrapAsync = require("../utils/wrapAsync");
const router =express.Router({mergeParams:true});
const User= require("../modelss/user")
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController= require("../controller/user")

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/Login")
.get(userController.rederLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login)

router.get("/logout",userController.logout)

module.exports=router;