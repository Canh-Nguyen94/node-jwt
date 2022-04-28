const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const {isEmail} = require("validator")

const userSchema = new Schema({
    email:{
        type:String,
        require: [true, "please enter an email"],
        unique: true,
        lowercase:true,
        validate: [isEmail, "email is not valid"]
    },
    password:{
        type:String,
        require: [true, "please enter a password"],
        minlength:[6, "minimum password is at least 6 characters"]
    },
})

const User = mongoose.model("user", userSchema)

module.exports = User