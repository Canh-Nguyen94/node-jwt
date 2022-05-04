const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    require: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "email is not valid"],
  },
  password: {
    type: String,
    require: [true, "please enter a password"],
    minlength: [6, "minimum password is at least 6 characters"],
  },
});
//fire a function after a doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to login user
userSchema.statics.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("password is incorrect");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
