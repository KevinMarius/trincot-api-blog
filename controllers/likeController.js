const Like = require('../models/like');
const Post = require('../models/post');
const User = require('../models/user');
const jwtUtils = require('../helpers/jwtUtils');
const asyncLib = require('async');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

const DISLIKED = 0;
const LIKED = 1;

exports.likePost = (req, res) => {
	var headerAuth = req.headers['authorization'];
	var userId = jwtUtils.getUserId(headerAuth);

	const postId = req.params.postId;

	if (userId < 0) {
		return res.status(404).json({ 'error': 'wrong token' });
	}

	asyncLib.waterfall([
		async function (done) {
			await Post.findOne({id: postId }).then((postFound) => {
					done(null, postFound);
			}).catch((err) => {
				throw new HttpError('unable to verify post', 500);
			});
		},
		async function (postFound, done) {
			if (postFound) {
				await User.findOne({id: userId }).then((userFound) => {
					done(null, postFound, userFound);
				}).catch((err) => {
					throw new HttpError('unable to verify user', 500);
				});
			} else {
				throw new HttpError('post already like', 404);
			}
		},
		async function (postFound, userFound, done) {
			if (userFound) {
				await Like.findOne({ 
					user: userId, 
					post: postId 
				}).then((userAlreadyLike) => {
					done(null, postFound, userFound, userAlreadyLike);
				}).catch((err) => {
					return res.status(500).json({'error': 'unable to verify is user already liked'});
				});
			} else {
				throw new HttpError('user not exist', 404);
			}
		},
		async function (postFound, userFound, userAlreadyLikedFound, done) {
			if (!userAlreadyLikedFound) {
				const like = new Like();
				like.post = mongoose.Types.ObjectId(postFound._id);
				like.user = mongoose.Types.ObjectId(userFound._id);
				like.isLike = LIKED;
				await like.save().then((alreadyLikeFound) => {
					done(null, postFound, userFound);
				})
				.catch((err) => {
					throw new HttpError('unable to set user reaction', 500);
				});
			} else {
				if (userAlreadyLikedFound.isLike === DISLIKED) {
					await userAlreadyLikedFound.update({
						isLike: LIKED,
					}).then(() => {
						done(null, productFound, userFound);
					})
					.catch((err) => {
						throw new HttpError('cannot update user reaction', 500);
					});
				} else {
					throw new HttpError('product already liked', 500);
				}
			}
		},
		async function (postFound, userFound, done) {
			await postFound.update({
				likes: postFound.likes + 1,
			}).then(() => {
				done(postFound);
			})
			.catch(function (err) {
				throw new HttpError('cannot update product like counter', 500);
			});
		},
	], async function (postFound) {
		if (postFound) {
			return res.status(201).json(postFound);
		} else {
			throw new HttpError('cannot update product', 500);
		}
	});
}

exports.disLikePost = (req, res) => {

}