const express = require("express");
const router  = express.Router();

const mainController    = require("../controllers/mainController");
const authController    = require("../controllers/authController");
const profileController = require("../controllers/profileController");

router.get("/", mainController.welcome);

router.get("/signup", authController.getSignUpPage); 

router.post("/signup", authController.signUp); 

router.post("/signin", authController.signIn); 

router.get("/signout", authController.signOut);

router.post("/validate", authController.checkCredentials);

router.get("/profile/:nickname", profileController.getProfilePage);

router.get("/profile/:nickname/post", isLoggedIn, profileController.getPostPage); 

////
router.get('/',function(req,res,next){
    User.find({}).exec(function(error,users){
        if(error) res.send(error);
        res.json(users);
    });
});

module.exports = router;

function isLoggedIn(req, res, next){
    if (req.session.user && req.session.user.nickname == req.params.nickname)
        return next();
    res.redirect("/");
}