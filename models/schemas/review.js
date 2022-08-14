const { Schema } = require("mongoose");
Schema.Types.String.checkRequired((v) => typeof v === "string");

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
    likeCount: {
      type: Number,
    },
    likeUsers: [
      {
        user: String,
        like: Boolean,
      },
    ],
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
