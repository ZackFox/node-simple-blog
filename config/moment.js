const moment = require("moment");
const conf = require("./conf");

moment.updateLocale("ru", { months: conf.months });

module.exports = moment;
