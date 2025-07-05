const express  = require("express"); 
const router =  express.Router({mergeParams:true});
const wrapAsync = require("../utills/wrapAsync.js")
const ExpressError = require("../utills/ExpressError.js")
const {reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");
const Listing  = require("../models/listing.js");
const { validateReview, isloggedIn, isReviewAuthor } = require("../middleware.js");
const ReviewController = require("../controllers/review.js") 

// reviews 
// post route ye reviews ke liye hai
router.post("/" ,
    isloggedIn,
    validateReview,
    wrapAsync(ReviewController.createReview)

);

//delete review raute
router.delete(
    "/:reviewId",
    isReviewAuthor,
    wrapAsync(ReviewController.destroyReview)
);

module.exports = router;