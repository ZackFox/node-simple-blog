const mongoose = require("mongoose"); // const passport = require('passport');
const User = require("../model/user");
const Post = require("../model/post");
const Subscriber = require("../model/subscriber");

const profileController = {};

/**
 *
 * route handler for /profile/:nickname
 * get user profile data and his posts
 * GET method
 */
profileController.getProfilePage = (req, res, next) => {
  const userId = req.session.user ? req.session.user._id : null;
  // const  = req.session.user ? req.session.user._id : null;

  User.findOne({ nickname: req.params.nickname })
    .populate({
      path: "posts",
      select: "author preview title comments createTime",
    })
    .then(profile => {
      if (!profile) return next();
      if (
        req.session.user &&
        req.session.user.nickname === req.params.nickname
      ) {
        res.locals.isOwn = true;
      }

      return Promise.all([
        profile,
        Post.find({ author: profile._id })
          .sort({ createTime: -1 })
          .populate({
            path: "author",
            select: "username nickname avatar",
          }),
        Subscriber.findOne({
          $and: [{ author: profile._id }, { subscriber: userId }],
        }),
      ]);
    })
    .then(data => {
      const isSubscribe = data[2] ? true : false;
      res.render("pages/profile", {
        token: req.csrfToken(),
        user: data[0],
        isSubscribe,
        posts: data[1],
        isOwn: res.locals.isOwn,
      });
    })
    .catch(err => next(err));
};

/**
 *
 * route handler for /profile/:nickname/subscribe
 * subscribe on profile
 * POST method
 */
profileController.subscribe = (req, res, next) => {
  const profileName = req.params.nickname;
  const subscriberId = req.session.user._id;

  User.findOneAndUpdate({ nickname: profileName }, { $inc: { subsCount: 1 } })
    .then(user => {
      const newSubs = new Subscriber({
        author: mongoose.Types.ObjectId(user._id),
        subscriber: mongoose.Types.ObjectId(subscriberId),
      });
      return newSubs.save();
    })
    .then(() => {
      res.json({ msg: "subscribe" });
    })
    .catch(err => next(err));
};

/**
 *
 * route handler for /profile/:nickname/subscribe
 * unsubscribe on profile
 * DELETE method
 */
profileController.unsubscribe = (req, res, next) => {
  const profileName = req.params.nickname;
  const subscriberId = req.session.user._id;

  User.findOneAndUpdate({ nickname: profileName }, { $inc: { subsCount: -1 } })
    .then(user => {
      return Subscriber.findOneAndRemove({
        $and: [{ author: user._id }, { subscriber: subscriberId }],
      }).exec();
    })
    .then(() => {
      res.json({ msg: "unsubscribe" });
    })
    .catch(err => next(err));
};

/**
 *
 * route handler for /profile/:nickname/post
 * open new post page
 * GET method
 */
profileController.getPostPage = (req, res, next) => {
  res.render("pages/createpost", { token: req.csrfToken() });
};

module.exports = profileController;
