const User = require("../models/User")
const jwt = require("jsonwebtoken")

//handle errors
const handleErrors = (err)=>{
    console.log(err.message, err.code)
    let errors = {email: "", password: "",}
    //validate duplicate email addresses
    if(err.code === 11000){
        errors.email ="This email is already in use"
        return errors;
    }
    //validate errors
    if(err.message === "incorrect email"){
        errors.email = "that email is not registered"
    }
    if(err.message === "password is incorrect"){
        errors.password = "that password is incorrect"
    }
    return errors
}

const maxAge = 3*24*60*60
const createToken = (id)=>{
    return jwt.sign({id},"kevin secret",{
        expiresIn: maxAge
    } )
}
const signup_get = (req,res)=>{
    res.render('signup')
}
const signup_post = async (req,res)=>{
    const {email, password} = req.body;
   try {
    const user =  await User.create({email, password});
    const token = createToken(user._id);
    res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge*1000});
    res.status(201).json({user:user._id});
   } catch (err) {
       const errors = handleErrors(err)
       
       res.status(400).json({errors});
   }
    
}
const login_get = (req,res)=>{
    res.render("login")
}
const login_post = async (req,res)=>{
    const {email, password} = req.body;
    
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id);
    res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({user: user._id})
    } catch (error) {
        const errors = handleErrors(error)
        
        res.status(400).json({ errors})
        
    }
}

const logout_get = (req, res) => {
    res.cookie("jwt","",{maxAge: 1})
    res.redirect("/")
}

module.exports ={signup_get, signup_post, login_get, login_post, logout_get}