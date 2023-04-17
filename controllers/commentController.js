const Comment = require("../models/comment")
const jwtUtils = require('../helpers/jwtUtils')
const HttpError = require('../models/http-error')

exports.getComments = async (req, res, next) => {
	await Comment.find({ post: req.params.postId })
		.populate("post")
		.sort({createdAt: 'asc'})
		.select()
		.then(comments => {
			res.status(200).json({
				comments
			});
		})
		.catch(err => {
			const error = new HttpError(
				err,
				404
			);
			return next(error);
		})
};

exports.countCommentsByPost = async (req, res, next) => {
	const postId = req.params.postId;
	  await Comment.count({post: postId})
	  .then((nbr) => {
		  res.status(200).json({
			nbr
		  });
		}).catch(err => {
		  const error = new HttpError(
			'Could not find post.',
			500
		  );
		  return next(error);
		});
  }  

exports.createComment = async (req, res, next) => {
	console.log(req.params.postId)
	const comment = new Comment({
		name: req.body.name,
		content: req.body.content,
		post: req.params.postId
	});
	await comment.save().then(result => {
		res.status(200).json({
			comment: result
		});
	});

}

exports.deleteCategory = (req, res) => {
	var headerAuth = req.headers['authorization']
	var userId = jwtUtils.getUserId(headerAuth)

	if (userId < 0) {
		throw new HttpError('wrong token', 404);
	}

	Comment.findOneAndDelete({ _id: req.params.commentId }).then(() => {
		res.status(200).json("Comment deleted successful")
	})
}