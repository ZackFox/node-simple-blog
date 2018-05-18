const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

function isLoggedIn(req, res, next) {
  if (req.session.user && req.session.user.nickname === req.params.nickname) {
    return next();
  }
  return res.redirect("/");
}

router.get("/", postController.getAllPosts);

router.post("/signin", authController.signIn);
router.get("/signup", authController.getSignUpPage);
router.post("/signup", authController.signUp);
router.get("/signout", authController.signOut);
router.post("/validate", authController.checkCredentials);

/**
 * profile routes
 */
router.get("/profile/:nickname", profileController.getProfilePage);
router.get(
  "/profile/:nickname/post",
  isLoggedIn,
  profileController.getPostPage,
);
router.get("/profile/:nickname/posts", postController.getAllPostsByUser);

/**
 * posts routes
 */

router.post("/profile/:nickname/post", isLoggedIn, postController.create);
router.get("/profile/:nickname/post/:id", postController.getOnePost);
router.delete("/profile/:nickname/post/:id", postController.delete);
router.post(
  "/profile/:nickname/post/:id/like",
  isLoggedIn,
  postController.like,
);

/**
 * replies routes
 */
router.post("/profile/:nickname/post/:id/reply", commentController.create);
router.put(
  "/profile/:nickname/post/:id/reply/:replyId",
  commentController.update,
);
router.delete(
  "/profile/:nickname/post/:id/reply/:replyId",
  commentController.delete,
);

module.exports = router;
