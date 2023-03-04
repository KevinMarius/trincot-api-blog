const jwtUtils = require('../helpers/jwtUtils');
const User = require('../models/user');
const HttpError = require('../models/http-error');

module.exports = authorize;

function authorize(roles = []) {

  return [
    // authorize based on user role
    (req, res, next) => {
      if (typeof roles === 'string') {
        roles = [roles];
      }
      var headerAuth = req.headers['authorization']
      var userId = jwtUtils.getUserId(headerAuth)

      User.findOne({_id: userId})
        .populate('role')
        .exec(function (err, user) {
          if (err) return err;
          if (roles.length && !roles.includes(user.role.title)) {
            // user's role is not authorized
            const error = new HttpError(
              "Unauthorized.",
              401
            );
            return next(error);
          }
          // authentication and authorization successful
          next();
        })
    }

  ];
}