const Post = require("../models/post");
const State = require("../models/state");
const jwtUtils = require('../helpers/jwtUtils');
const EnumState = require("../models/state");
const fs = require('fs');
const image = require('../helpers/fileUpload');
const HttpError = require('../models/http-error');
const post = require("../models/post");
const mongoose = require('mongoose')

exports.getPosts = async (req, res, next) => {
  await Post.find()
    .populate("author")
    .populate("category")
    .populate("state")
    .limit(10)
    .select()
    .then(posts => {
      res.status(200).json({
        posts
      });
    })
    .catch(err => {
      const error = new HttpError(
        'Could not find posts.',
        500
      );
      return next(error);
    });
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  await Post.findById(postId)
    .populate("author")
    .populate("category")
    .populate("state")
    .limit(10)
    .select()
    .then((post, category) => {
      res.status(200).json({
        post,
        category
      });
    })
    .catch(err => {
      const error = new HttpError(
        'Could not find post.',
        500
      );
      return next(error);
    });
};

exports.createPost = async (req, res, next) => {
  const headerAuth = req.headers['authorization']
  const userId = jwtUtils.getUserId(headerAuth)
  const { title, content, category } = req.body;

  if (userId < 0) {
    const error = new HttpError(
      'Wrong token.',
      404
    );
    return next(error);
  }

  if (!req.file) {
    const error = new HttpError(
      'No image provided.',
      422
    );
    return next(error);
  }

  const state = EnumState.findOne({
    state: "WAITING_VALIDATION"
  });

  const post = new Post({
    title: title,
    content: content,
    picture: req.file.path,
    state: mongoose.Types.ObjectId(state._id),
    category: mongoose.Types.ObjectId(category),
    author: mongoose.Types.ObjectId(userId),
    likes: 0
  });

  await post.save().then(result => {
    res.status(200).json({
      post: result
    });
  });
}

exports.updatePost = async (req, res, next) => {
  const headerAuth = req.headers['authorization']
  const userId = jwtUtils.getUserId(headerAuth)
  const { title, content, picture, state, category } = req.body;
  const postId = req.params.postId;

  if (userId < 0) {
    const error = new HttpError(
      'Wrong token.',
      404
    );
    return next(error);
  }

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!req.file) {
    const error = new HttpError(
      'No image provided.',
      422
    );
    return next(error);
  }

  let post;
  try {
    post = await Post.findById(postId).populate('author');
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, couldn't update Post.",
      500
    );
    return next(error);
  }

  console.log(post.author._id);
  console.log(mongoose.Types.ObjectId(userId));

  if (!post.author._id.equals(mongoose.Types.ObjectId(userId))) {
    const error = new HttpError(
      "This product isn't yours.",
      403
    );
    return next(error);
  }

  const imagePath = post.picture;

  post.title = title;
  post.content = content;
  post.picture = imageUrl;
  post.state = state;
  post.category = category;

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError(
      "Couldn't update Post.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => console.log(err));

  return res.status(200).json({ message: "Post updated" });

}

exports.deletePost = async (req, res, next) => {
  var headerAuth = req.headers['authorization']
  var userId = jwtUtils.getUserId(headerAuth)
  const postId = req.params.postId;

  if (userId < 0) {
    const error = new HttpError(
      "Wrong token.",
      404
    );
    return next(error);
  }

  let post;
  try {
    post = await Post.findById(postId);
  } catch (e) {
    const error = new HttpError(
      "Could not find post.",
      404
    );
    return next(error);
  }
  const imageUrl = post.picture;

  try {
    await post.delete();
  } catch (err) {
    const error = new HttpError(
      "Could not delete post.",
      500
    );
    return next(error);
  }
  

  fs.unlink(imageUrl, err => {
    console.log(err);
  });

  return res.status(200).json({ message: 'Post deleted successful.' });

}

exports.changeStatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const state = req.body.state;
  await Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new HttpError(
          "Could not find post.",
          404
        );
        return next(error);
      }
      State.findById(state)
        .then(state => {
          if (!state) {
            const error = new HttpError(
              "Could not find state.",
              404
            );
            return next(error);
          }
          post.state = state;
          return post.save();
        })
    })
    .then(() => {
      res.status(200).json({ message: 'Post updated successful.' });
    })
    .catch(err => { 
      const error = new HttpError(
        "Post not updated.",
        500
      );
      return next(error);
    });
}

