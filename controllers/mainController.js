
const mainController  = {};

mainController.welcome = function(req, res, next){
    res.render("index",{token: req.csrfToken()});
}

module.exports = mainController;

