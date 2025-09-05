
const User = require("../models/user.js");

module.exports.signup = async(req,res) =>{
    try{
let {username , email ,password} = req.body;
let newUser = new User({email,username});
let registerUser = await  User.register(newUser,password);
console.log(registerUser);
req.logIn(registerUser,(err) =>{
    if(err){
        return next(err);
    }
    
req.flash("success","Welcome to WanderLust!");
res.redirect("/listings");
})
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signup");
    }


}
module.exports.login = async(req,res) =>{
  
    req.flash("success", "welcome back to Wanderlust");
    let RedirectUrl =  res.locals.RedirectUrl || "/listings" ;
    res.redirect(RedirectUrl)
    

};
module.exports.logout = (req,res,next) =>{
   req.logOut((err) =>{
    if(err){
        return next(err)
    }
req.flash("success","you are loggedOut")
res.redirect("/listings")
   })
    
   }
   