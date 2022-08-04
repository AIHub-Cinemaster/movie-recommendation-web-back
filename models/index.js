const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");
const MovieCartSchema = require("./schemas/movieCart");
const StarRatingSchema = require("./schemas/starRating");

exports.User = mongoose.model("User", UserSchema);
exports.MovieCart = mongoose.model("MovieCart", MovieCartSchema);
exports.StarRating = mongoose.model("StarRating", StarRatingSchema);
