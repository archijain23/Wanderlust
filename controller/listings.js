const Listing= require("../modelss/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/inddex.ejs",{allListings});
};

module.exports.renderNewForm= (req,res)=>{
    res.render("./listings/new.ejs")
};

module.exports.showListing=async (req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing});


};

module.exports.createListing=async (req, res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    
    
    let url=req.file.path;
     let filename=req.file.filename;
    
    let newListing=   new Listing({
        title: req.body.listing.title,
        description: req.body.listing.description,
        image: {  url,filename }, // Save the image URL
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country,
        owner:req.user._id,
        
    });

    console.log(response.body.features[0].geometry);
    newListing.geometry = response.body.features[0].geometry;

      let savedListing = await newListing.save();
    
    req.flash("success","new listing created");
console.log(newListing);
    res.redirect("/listings");

};

module.exports.renderEditForm=async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings")
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
};



module.exports.updateListing=async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
   let {id} = req.params;

    
    let updatedlisting=await Listing.findByIdAndUpdate(id,{
        title: req.body.listing.title,
        description: req.body.listing.description,
        // image: { url,filename }, // Save the image URL
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country,
        geometry : response.body.features[0].geometry});
        if(typeof req.file!=="undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            updatedlisting.image={url,filename};
            await updatedlisting.save();
        }
        

        req.flash("success","listing updated");
    res.redirect(`/listings/${id}`)
};


module.exports.destroyListing=async(req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}