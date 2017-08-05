const express = require("express");

const router = express.Router();

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

router.post("/profile/:nickname/post/:id/reply", commentController.sendComment);
router.put("/profile/:nickname/post/:id/reply/:replyId", commentController.updateComment);
router.delete("/profile/:nickname/post/:id/reply/:replyId", commentController.deleteComment);

module.exports = router;
