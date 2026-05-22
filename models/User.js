import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  photo: {
  type: String,
  default: "",
},
  password: String,
   location: {
    type: String,
    default: "",
  },
   role: {
    type: String,
    default: "user",
  },

});

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;