const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");

exports.User = mongoose.model("User", UserSchema);
