require("moment-timezone");

const moment = require("moment");

moment.tz.setDefault("Asia/Seoul");

exports.moment = moment;
