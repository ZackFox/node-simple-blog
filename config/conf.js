const config = {};

config.mongoUri = "mongodb://mdbadmin:mdbpass@ds155132.mlab.com:55132/mongobase";

config.languages = [
  { name: "en", alias: "English", default: false },
  { name: "ru", alias: "Русский", default: true },
];

config.months = [
  "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля",
  "Августа", "Сентября", "Октября", "Ноября", "Декабря",
];

config.postsLimit = 4;
config.paginationLimit = 10;

module.exports = config;
