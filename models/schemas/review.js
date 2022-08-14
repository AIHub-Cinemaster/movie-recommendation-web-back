const { Schema } = require("mongoose");
const shortId = require("./type/short-id");

module.exports = new Schema(
  {
    shortId,
    userRef: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    movieId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    starRef: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Star",
    },
  },
  {
    timestamps: true,
  },
);
