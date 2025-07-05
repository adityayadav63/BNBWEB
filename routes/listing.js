const express  = require("express");
const router =  express.Router();
const wrapAsync = require("../utills/wrapAsync.js")
const Listing  = require("../models/listing.js");
const {isloggedIn,isOwner,validateListing} = require("../middleware.js")
const listingsController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })


router.param("id", (req, res, next, id) => {
    req.params.id = id.trim();
    next();
});

// index route
router
   .route("/")
   .get( wrapAsync(listingsController.index))
   .post( 
    isloggedIn,
    upload.single('image'),
    validateListing,
    wrapAsync(listingsController.createRenderform),(req,res) =>{
    res.send(req.file)

})

// new route
router.get(
    "/new",isloggedIn,listingsController.renderNewform);


// // create route
// router.post("/",
//     isloggedIn,
//     validateListing,
//     wrapAsync(listingsController.createRenderform) 
// );


// show route
router
.route("/:id")
. get(wrapAsync(listingsController.showListing))
.put( 
    isloggedIn,
    isOwner,
    upload.single('image'),
    validateListing,
    wrapAsync (listingsController.updatelisting)
);

// edit route
router.get ("/:id/edit",
    isloggedIn,
    isOwner,
     wrapAsync(listingsController.renderEditroute)
);


// // update route
// router.put(
//     '/:id', 
//     isloggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync (listingsController.updatelisting)
// );


router.delete("/:id",
    isloggedIn,
    isOwner,
    wrapAsync(listingsController.destroyDeleteRoute)
);

module.exports = router;