const db = require("../models");

exports.createMessage = async function(req, res, next) {
  try {
    let message = await db.Message.create({
      text: req.body.text,
      user: req.params.id
    });
    let foundUser = await db.User.findById(req.params.id);
    foundUser.messages.push(message.id);
    await foundUser.save();
    let foundMessage = await db.Message.findById(message._id).populate("user", {
      username: true,
      profileImageUrl: true,
      likes: true
    });
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
};

exports.getMessage = async function(req, res, next) {
  try {
    let message = await db.Message.find(req.params.message_id);
    return res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
};

exports.deleteMessage = async function(req, res, next) {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id);
    await foundMessage.remove();
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
};

exports.likeMessage = async function(req, res, next) {
  try {
    const likedMessage = await db.Message.findById(req.params.message_id);
    const currentUser = await db.User.findById(req.body.currentUser);
    if (
      likedMessage.likes.filter(
        like => like.user.toString() === currentUser._id.toString()
      ).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    likedMessage.likes.unshift({ user: currentUser._id });

    await likedMessage.save();

    res.json(likedMessage.likes);
  } catch (err) {
    return next(err);
  }
}

exports.unlikeMessage = async function(req, res, next) {
  try {
    const unlikedMessage = await db.Message.findById(req.params.message_id);
    const currentUser = await db.User.findById(req.body.currentUser);
    if (
      unlikedMessage.likes.filter(
        like => like.user.toString() === currentUser._id.toString()
      ).length === 0
    ) {
      return res.status(400).json({ msg: "You have to like it first" });
    }

    const likeIndex = unlikedMessage.likes
      .map(like => like.user.toString())
      .indexOf(currentUser._id.toString());

    unlikedMessage.likes.splice(likeIndex, 1);

    await unlikedMessage.save();

    res.json(unlikedMessage.likes);
  } catch (err) {
    return next(err);
  }
};
