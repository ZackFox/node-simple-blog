const express = require("express");

const router = express.Router();

const User = require("../model/userModel");

const mainController = require("../controllers/mainController");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

function isLoggedIn(req, res, next) {
  if (req.session.user && req.session.user.nickname === req.params.nickname) { return next(); }
  return res.redirect("/");
}

router.get("/", mainController.welcome);

router.post("/signin", authController.signIn);
router.get("/signup", authController.getSignUpPage);
router.post("/signup", authController.signUp);
router.get("/signout", authController.signOut);
router.post("/validate", authController.checkCredentials);

router.get("/profile/:nickname", profileController.getProfilePage);
router.get("/profile/:nickname/post", isLoggedIn, profileController.getPostPage);

router.get("/profile/:nickname/posts", postController.getPostsByUser);
router.post("/profile/:nickname/post", isLoggedIn, postController.sendPost);
router.get("/profile/:nickname/post/:id", postController.getPostById);

router.post("/profile/:nickname/post/:id/comment", commentController.sendComment);
router.get("/profile/:nickname/post/:id/comment/:cId", commentController.deleteComment);
// router.put("/profile/:nickname/post/:id/comment/:cId", commentController.updateComment);

// router.get('/users', function(req,res,next){
//     User.find({}).exec(function(err,users){
//         if(err) next(err);
//         res.json(users);
//     });
// });

module.exports = router;
