const { Schema } = require("mongoose");
const shortId = require("./type/short-id");

module.exports = new Schema(
  {
    shortId,
    stars: {
      type: Schema.Types.ObjectId,
      ref: Star,
      required: true,
    },
    recommendList: [
      {
        movieId: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true },
);
