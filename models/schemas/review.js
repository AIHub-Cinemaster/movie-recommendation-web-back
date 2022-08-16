const { Schema } = require("mongoose");
const shortId = require("./type/short-id");

// 빈 String 값 허용
Schema.Types.String.checkRequired((v) => typeof v === "string");

module.exports = new Schema(
  {
<<<<<<< HEAD
    shortId,
=======
    reviewId: shortId, // 유저 "shortId"와 헷갈려서 변수명 할당
>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb
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
<<<<<<< HEAD
    likeCount: {
      type: Number,
    },
    likeUsers: [
      {
        user: String,
        like: Boolean,
      },
    ],
=======
    likeRef: {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb
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
