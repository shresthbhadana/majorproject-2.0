
if(process.env.NODE_ENV != "production"){
require('dotenv').config()};
console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local"); 

const User = require("./models/user.js");
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;
main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
mongoUrl : dbUrl,
crypto :{
    secret :  "mysupersecretcode"
},
touchAfter : 24 * 3600
})

store.on("error",() =>{
    console.log("error in mongo session",err)
})
const sessionOption = {
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute); 

app.use("/", userRoute);


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";


// app.get("/", (req, res) => {
//     res.send("hii,i am root");
// });

app.use((req, res) => {
    res.status(404).render("includes/error.ejs", { message: "Page Not Found", statusCode: 404 });
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message } = err;
    res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening at port 8080");
});