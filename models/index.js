const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");
const CartSchema = require("./schemas/cart");
const StarSchema = require("./schemas/star");

exports.User = mongoose.model("User", UserSchema);
exports.Cart = mongoose.model("Cart", CartSchema);
exports.Star = mongoose.model("Star", StarSchema);
