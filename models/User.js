import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  photo: String,
  password: String,
   location: {
    type: String,
    default: "",
  },

});

const User = mongoose.model("User", userSchema);

export default User;