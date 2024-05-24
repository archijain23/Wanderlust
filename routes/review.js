const express= require("express");
const router =express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");

const Review= require("../modelss/review.js");
const Listing= require("../modelss/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} =require("../middleware.js");
const reviewController= require("../controller/review.js")






//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

//delete Rview route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;