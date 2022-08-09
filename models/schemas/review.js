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
    likeRef: {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
    commentRef: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  },
);

/*
? 스키마 디자인 고민
review: [
      {
        userRef: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title: String,
        content: String,
      },
    ]
*/
