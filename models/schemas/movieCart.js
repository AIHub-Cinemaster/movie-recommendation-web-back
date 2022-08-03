const { Schema } = require("mongoose");
const shortId = require("./type/short-id");

module.exports = new Schema(
  {
    shortId,
    email: {
      type: String,
      required: true,
    },
    movieList: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
