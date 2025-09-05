const express = require("express");
const router = express.Router({mergeParams: true});



const wrapAsync = require("../utils/wrapAsync.js");
 const ExpressError = require("../utils/ExpressError.js");
 const {reviewSchema,}  = require("../schema.js");
 const Review = require("../models/reviews.js");

const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn,reviewAuthor } = require("../middleware.js");
const reviewcontroller = require("../controller/review.js");













//review
//post

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewcontroller.createReview));
//review deleteroute
router.delete("/:reviewId",isLoggedIn,reviewAuthor,  wrapAsync(reviewcontroller.deleteReview));
module.exports = router;