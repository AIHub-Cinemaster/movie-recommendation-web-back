const { Schema } = require("mongoose");
const shortId = require("./type/short-id");

module.exports = new Schema(
  {
    shortId,
    email: {
      type: String,
      reauired: true,
    },
    password: {
      type: String,
      reauired: true,
    },
    name: {
      type: String,
      reauired: true,
    },
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "MovieCart",
      required: true,
    },
    starId: {
      type: Schema.Types.ObjectId,
      ref: "StarRating",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
