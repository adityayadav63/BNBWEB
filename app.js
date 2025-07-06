if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utills/ExpressError.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const Review = require("./models/review.js"); // ← Confirm this
const passport = require("passport");
const Localstrategy = require("passport-local").Strategy
const user = require("./models/user.js")




const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dburl =process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("ERROR in EXPRESS SESSION STORE",err);
    
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser())


app.get("/", (req, res) => {
    res.send("hey, babe i am root")
});

app.get("/", (req, res) => {
  res.render("home"); // make sure home.ejs exists
});

// this is flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.get("/demouser", async (req, res) => {
    let FakeUser = new user({
        email: "aadi123@gmail.com",
        username: "sigma-boys"
    })

    let ragisteredUser = await user.register(FakeUser, "helloworld")
    res.send(ragisteredUser)
})








// const MONGO_URL = "mongodb://127.0.0.1:27017/RENTRICH";



async function main() {
    await mongoose.connect(dburl);
}


main()
    .then(() => {
        console.log("mongodb is connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));







app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// app.use((err,req,res,next) =>{
//     console.log("err:", err)
//     let {statusCode = 500,message = "do not get found!"} = Error;
// res.status(statusCode).send(message);
// })

app.use((err, req, res, next) => {
    console.log("err:", err);
    let { statusCode = 500, message = "do not get found!" } = err;
    res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("ready for the connection to connect");
});