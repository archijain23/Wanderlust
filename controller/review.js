const Listing=require("../modelss/listing");
const Review= require("../modelss/review")

module.exports.createReview=async(req,res)=>{
    let {id} = req.params;
    let listing =await Listing.findById(id);
    let newreview= new Review(req.body.review);
    newreview.author=req.user._id
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    console.log("new review save");
    req.flash("success","new review created");
 
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let { id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted");
  res.redirect(`/listings/${id}`)
};