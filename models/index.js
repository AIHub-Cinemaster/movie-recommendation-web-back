const mongoose = require("mongoose");
<<<<<<< HEAD
=======

>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb
const UserSchema = require("./schemas/user");
const CartSchema = require("./schemas/cart");
const StarSchema = require("./schemas/star");
const ReviewSchema = require("./schemas/review");
<<<<<<< HEAD
=======
const LikeSchema = require("./schemas/like");
>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb

exports.User = mongoose.model("User", UserSchema);
exports.Cart = mongoose.model("Cart", CartSchema);
exports.Star = mongoose.model("Star", StarSchema);
exports.Review = mongoose.model("Review", ReviewSchema);
<<<<<<< HEAD
=======
exports.Like = mongoose.model("Like", LikeSchema);
>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb
