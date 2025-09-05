const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
main().then(()=>{
    console.log("connected to db")
}).catch((err) =>{
    console.log(err)
});
async function main() {
    await mongoose.connect(MONGO_URL)
};
const initDB = async()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,owner:new mongoose.Types.ObjectId ("68ac9f9973f474b36fc43042")}) )

    
    await Listing.insertMany(initData.data);
    console.log("data was saved")
};
initDB();