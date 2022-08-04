const { Schema } = require("mongoose");
const shortId = require("./type/short-id");

module.exports = new Schema(
  {
    shortId,
    email: {
      type: String,
      required: true,
    },
    starList: [
      {
        movieId: String,
        star: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);
