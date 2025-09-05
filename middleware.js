const Listing = require("./models/listing");
 const {reviewSchema,}  = require("./schema.js");
 const Review = require("./models/reviews.js");

 

function isLoggedIn(req,res,next) {
    if(!req.isAuthenticated()){
        req.session.RedirectUrl = req.originalUrl;
        req.flash("error", "you must have logged in before creatiing a new listing");
        return res.redirect("/login");
    }
    next();
}

function saveRedirectUrl(req,res,next){
    if( req.session.RedirectUrl ){
        res.locals.RedirectUrl =  req.session.RedirectUrl 
    }
    next();
}

async function isOwner(req,res,next) {
    let {id}  = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    if(!listing.owner){
        req.flash("error","Listing has no owner");
        return res.redirect(`/listings/${id}`);
    }
    if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
async function reviewAuthor(req,res,next) {
    let {id,reviewId}  = req.params;
    let review= await Review.findById(reviewId);
    if(!review){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    if(!review.author ){
        req.flash("error","Listing has no owner");
        return res.redirect(`/listings/${id}`);
    }
    if(res.locals.currUser && !review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
async function validateReview(req,res,next) {
     let{error} = reviewSchema.validate(req.body);
    let  errmsg = "";
   if (error) {
       errmsg = error.details.map((el) => el.message).join(",")
        
        
    }else{
    next();
  }
 console.log(errmsg)
 
}

module.exports = { isLoggedIn, saveRedirectUrl, isOwner ,validateReview,reviewAuthor};