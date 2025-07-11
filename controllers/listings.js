const Listing = require("../models/listing");




module.exports.index = (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})

module.exports.renderNewform = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing You Requsted Does Not Exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
})


module.exports.createRenderform = (async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;





    const newListing = new Listing(req.body.listing);
    console.log("Form Data:", req.body);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();


    req.flash("success", "new listing created!")
    res.redirect("/listings"); // Redirect to index page

}
);


module.exports.renderEditroute = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You Requsted Does Not Exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl });

});


module.exports.updatelisting = (async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });



if(typeof req.file  !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    
}
await listing.save();

    req.flash("success", "Listings Updated!");
    res.redirect(`/listings/${id}`);
});



module.exports.destroyDeleteRoute = (async (req, res) => {
    let { id } = req.params;
    let deletelistings = await Listing.findByIdAndDelete(id);
    console.log(deletelistings);
    req.flash("success", "Listings Deleted")
    res.redirect("/listings");

});
