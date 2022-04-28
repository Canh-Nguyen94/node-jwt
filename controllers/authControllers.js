const User = require("../models/User")

//handle errors
const handleErrors = (err)=>{
    let errors = {email: "", password: "",}
    //validate duplicate email addresses
    if(err.code === 11000){
        errors.email ="This email is already in use"
        return errors;
    }
    //validate errors
    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message
        })
    }
    return errors
}
const signup_get = (req,res)=>{
    res.render('signup')
}
const signup_post = async (req,res)=>{
    const {email, password} = req.body;
   try {
    const user =  await User.create({email, password});
    res.status(201).json(user);
   } catch (err) {
       const errors = handleErrors(err)
       
       res.status(400).json({errors});
   }
    
}
const login_get = (req,res)=>{
    res.render("login")
}
const login_post = (req,res)=>{
    const {email, password} = req.body;
    console.log(email, password)
    res.send("user login")
}

module.exports ={signup_get, signup_post, login_get, login_post}