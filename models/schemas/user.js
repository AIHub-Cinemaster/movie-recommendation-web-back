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
      reauired: false,
    },
    name: {
      type: String,
      reauired: true,
    },
    type: {
      type: String, // local, kakao, naver
      reauired: true,
    },
  },
  {
    timestamps: true,
  },
);
