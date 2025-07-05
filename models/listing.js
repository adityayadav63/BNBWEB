const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
        title: {
            type: String,
            required: [true, 'Title is required']
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        },
        image: {
            url:String,
            filename:String,
    
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be a positive number']
        },
        location: {
            type: String,
            required: [true, 'Location is required']
        },
        country: {
            type: String,
            required: [true, 'Country is required']
        },
        reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review",
            
        }],
        owner: {
            type: Schema.Types.ObjectId,
            ref:"User",
        },

        // category: {
        //     type:String,
        //     anum:["Trending","Rooms","Amazing viwes","iconic cities","Castles","Amazing pools","Camping","Forms","Arctic"]
        // }

    });
   
    listingSchema.post("findByIdAndDelete",async (listing) =>{
        if(listing){
            await review.deleteMany({_id:{$in: listing.reviews}})
        }
    })

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;