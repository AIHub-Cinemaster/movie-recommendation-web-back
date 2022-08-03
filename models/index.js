const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");
const MovieCartSchema = require("./schemas/movieCart");

exports.User = mongoose.model("User", UserSchema);
exports.MovieCart = mongoose.model("MovieCart", MovieCartSchema);
