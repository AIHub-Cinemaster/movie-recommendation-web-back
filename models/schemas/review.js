const { Schema } = require("mongoose");
const shortId = require("./type/short-id");

// 빈 String 값 허용
Schema.Types.String.checkRequired((v) => typeof v === "string");

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
