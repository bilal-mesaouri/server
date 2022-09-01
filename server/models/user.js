let mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const user = mongoose.model("users", userschema);

module.exports = user;
