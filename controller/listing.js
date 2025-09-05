const Listing = require("../models/listing.js");


module.exports.newlisting = (req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.index = async(req,res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});}

    module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: { path: "author" }
    })
    .populate("owner");
    
    if(!listing){
req.flash("error", "listing does not exists");
 return res.redirect("/listings")

    }
    res.render("listings/show.ejs",{listing});
};
module.exports.createListing = async(req,res,next) => {
  let url = req.file.path;
  let filename = req.file.filename;
 const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id;
 newListing.image = {url,filename}
 await newListing.save();
req.flash("success", "new listing created");
res.redirect("/listings");

};
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);


      if(!listing){
req.flash("error", "listing does not exists");}
  let oringinalImage = listing.image.url;
   originalImage =  oringinalImage.replace("/uploads","/uploads/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImage});
    
};
module.exports.updateListing = async(req,res)=>{
     if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing")
    };
   let {id} = req.params;
     let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
     if( typeof req.file !== "undefined"){
      let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename}
   await listing.save();
}
    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`);
    console.log(req.body);
};
module.exports.deleteListing = async(req,res) =>{
    let {id} = req.params;
   let deletedListing =  await Listing.findByIdAndDelete(id);
   req.flash("success", " listing deleted")
   res.redirect("/listings")
}