<<<<<<< HEAD
const { nanoid } = require('nanoid');

const shortId = {
    type: String,
    default: () => {
        return nanoid();
    },
    require: true,
    index: true
}

module.exports = shortId;
=======
const { nanoid } = require("nanoid");

const shortId = {
  type: String,
  default: () => {
    return nanoid();
  },
  require: true,
  index: true,
};

module.exports = shortId;
>>>>>>> 4b373c09d8e64ef9675d5b66fc3419f1c58518cb
