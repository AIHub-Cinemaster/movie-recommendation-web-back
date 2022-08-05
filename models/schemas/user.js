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
      reauired: true,
    },
    name: {
      type: String,
      reauired: true,
    },
  },
  {
    timestamps: true,
  },
);
