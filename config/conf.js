let config = {};

config.mongoUri = "mongodb://mdbadmin:mdbpass@ds155132.mlab.com:55132/mongobase";

config.languages = [
    {name: 'en', alias: 'English', default: false},
    {name: 'ru', alias: 'Русский', default: true}
];


module.exports = config;