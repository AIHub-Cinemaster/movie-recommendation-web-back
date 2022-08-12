const { Schema } = require("mongoose");
const shortId = require("./type/short-id");

module.exports = new Schema(
  {
    shortId,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String, // local, kakao, naver
      required: true,
    },
    profileImg: {
      type: String,
      required: false,
      default: "./uploads/default_profile.png", //굳이..? 고민해보자
    },
  },
  {
    timestamps: true,
  },
);
