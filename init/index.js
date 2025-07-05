const mongoose = require("mongoose");
const initData =require("./data.js");
const Listing = require("../models/listing.js");

const   MONGO_URL = "mongodb://127.0.0.1:27017/RENTRICH";

main()
.then(() =>{
console.log("mongodb is connected to DB");
})
.catch((err) =>{
    console.log(err);
    
})
async function main() {
    await mongoose.connect(MONGO_URL)
};

const initdb = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((Obj) =>({
        ...Obj,
        owner:"68505d7b133fb1d27c820203"

    }))
    await Listing.insertMany(initData.data)
    console.log("data was initialized");
    
};
initdb();


