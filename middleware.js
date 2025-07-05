const Listing = require("./models/listing")
const Review = require("./models/review.js")

const ExpressError = require("./utills/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const review = require("./models/review.js");

module.exports.isloggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to crate listings");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
        let listing = await Listing.findById(id);

        
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

        if(!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
            console.log("Requested ID:", id);
            req.flash("error","You are not the owner of this listings ");
        return res.redirect(`/listings/${id}`);
}
next();
};

module.exports.validateListing = (req,res,next) =>{
    // console.log("BODY RECEIVED >>> ", req.body); 
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next()
    }
};


module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next()
    }
};

module.exports.isReviewAuthor = async(req,res,next) =>{
    let { id,reviewId } = req.params;
        let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","You are not the Author of this Review ");
       
           return res.redirect(`/listings/${id}`); }
next();
};