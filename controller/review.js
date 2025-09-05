const Listing= require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "review posted");
 
    
    res.redirect(`/listings/${listing._id}`);
};
module.exports.deleteReview = async(req,res)=>{
let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

req.flash("success", " review deleted")
res.redirect(`/listings/${id}`);
}
