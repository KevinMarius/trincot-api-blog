const Role = require('../models/role');
const HttpError = require('../models/http-error');

exports.getRoles = (req, res, next) => {
	try {
		Role.find()
			.select()
			.then((roles) => {
				res.status(200).json({
					roles
				});
			})
			.catch((err) => {
				const error = new HttpError(
					'Could not find the role.',
					500
				);
				return next(error);
			});
	} catch (err) {
		console.log(err);
	}
}
