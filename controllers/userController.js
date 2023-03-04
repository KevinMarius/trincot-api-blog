const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwtUtils = require('../helpers/jwtUtils');
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const HttpError = require('../models/http-error');
const fs = require('fs');

dotenv.config()

exports.getUsers = async (req, res, next) => {
  var headerAuth = req.headers['authorization']
  var userId = jwtUtils.getUserId(headerAuth)

  if (userId < 0) {
    const error = new HttpError(
      "Wrong token.",
      404
    );
    return next(error);
  }

  await User.find()
    .select()
    .populate('role')
    .then((users) => {
      res.status(200).json({
        users
      });
    })
    .catch((err) => {
      const error = new HttpError(
        err,
        404
      );
      return next(error);
    });
}

exports.login = async (req, res, next) => {

  const { email, password } = req.body

  //if (!emailRegex.test(email)) {
  //  throw new HttpError('email is not valid', 404);
  //}
  //if (!passwordRegex.test(password)) {
  //  throw new HttpError('password is not valid', 404);
  //}
  await User.findOne({
    email: email
  })
    .then((userExist) => {

      if (userExist) {
        const passwordValid = bcrypt.compareSync(password, userExist.password)

        if (passwordValid) {
          res.status(200).json({
            userExist,
            'token': jwtUtils.generateTokenForUser(userExist)
          })
        } else {
          return next(new HttpError("Password isn't correct.", 400));
        }
      } else {
        const error = new HttpError(
          "User is not exist.",
          404
        );
        return next(error);
      }
    })
    .catch((err) => {
      const error = new HttpError(
        err,
        500
      );
      return next(error);
    });
}

exports.getUserProfile = async (req, res, next) => {
  var headerAuth = req.headers['authorization']
  var userId = jwtUtils.getUserId(headerAuth)

  if (userId < 0) {
    const error = new HttpError(
      "Wrong token.",
      404
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId).populate("role");
  } catch (err) {
    const error = new HttpError(
      "User not found.",
      404
    );
    return next(error);
  }

  console.log(user)

  return res.status(201).json({
    user: user
  });
}

exports.getUser = async (req, res, next) => {
  var headerAuth = req.headers['authorization']
  var userId = jwtUtils.getUserId(headerAuth)

  const id = req.params.userId;

  if (userId < 0) {
    const error = new HttpError(
      "Wrong token.",
      404
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findById(id).populate("role");
  } catch (err) {
    const error = new HttpError(
      "User not found.",
      404
    );
    return next(error);
  }

  res.status(201).json({
    user: user
  });
}

exports.changePassword = async (req, res, next) => {
  var headerAuth = req.headers['authorization'];
  var userId = jwtUtils.getUserId(headerAuth);

  const { currentPassword, password1, password2 } = req.body;

  if (userId < 0) {
    const error = new HttpError(
      "Wrong token.",
      404
    );
    return next(error);
  }

  if (password1 !== password2) {
    const error = new HttpError(
      "These passwords are not the same.",
      422
    );
    return next(error);
  }

  if (
    !passwordRegex.test(password1) ||
    !passwordRegex.test(password2) ||
    !passwordRegex.test(currentPassword)
  ) {
    const error = new HttpError(
      "Password is not valid.",
      403
    );
    return next(error);
  }

  let hashPassword;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "User not Found.",
      404
    );
    return next(error);
  }

  try {
    hashPassword = await bcrypt.hash(password1, 10);
  } catch (err) {
    const error = new HttpError(
      "Couldn't hash password please try again.",
      500
    );
    return next(error);
  }
  const result = bcrypt.compareSync(currentPassword, user.password);
  if (result) {
    user.password = hashPassword;
    user.save();
  } else {
    const error = new HttpError(
      "The current password is not correct.",
      403
    );
    return next(error);
  }

  return res.status(200).json({
    user
  });
}

exports.createUser = async (req, res, next) => {
  const { name, surname, dateBorn, email, password1, password, phone, role } = req.body;

  if (!emailRegex.test(email)) {
    const error = new HttpError(
      "Email is not valid.",
      404
    );
    return next(error);
  }
  if (!passwordRegex.test(password1) || !passwordRegex.test(password)) {
    const error = new HttpError(
      "Password is not valid.",
      500
    );
    return next(error);
  }

  if (password1 !== password) {
    const error = new HttpError(
      "The two passwords is not same.",
      404
    );
    return next(error);
  }

  var imageUrl = req.file.path;
  let hashPassword;

  try {
    hashPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    const error = new HttpError(
      "Couldn't hash password please try again.",
      500
    );
    return next(error);
  }

  await User.findOne({ email: email })
    .then((userExist) => {

      if (!userExist) {

        const user = new User({
          name: name,
          surname: surname,
          dateBorn: dateBorn,
          email: email,
          password: hashPassword,
          phone: phone,
          picture: imageUrl,
          role: role
        });

        user.save()
          .then((newUser) => {
            res.status(200).json({
              newUser
            })
          })

      } else {
        const error = new HttpError(
          "User already exist.",
          400
        );
        return next(error);
      }
    })
    .catch((err) => {
      const error = new HttpError(
        err,
        500
      );
      return next(error);
    });
}

exports.updateUserById = async (req, res, next) => {
  var headerAuth = req.headers['authorization']
  var userId = jwtUtils.getUserId(headerAuth)
  var imageUrl;

  const { name, surname, dateBorn, phone, picture } = req.body;
  const Id = req.params.userId;

  if (userId < 0) {
    const error = new HttpError(
      "Wrong token.",
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

  let user;
  try {
    user = User.findById(Id);
  } catch (err) {
    const error = new HttpError(
      "Could not find post.",
      404
    );
    return next(error);
  }

  const imagePath = user.picture;

  user.name = name,
  user.surname = surname,
  user.dateBorn = dateBorn,
  user.phone = phone,
  user.picture = imageUrl

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Could not update post.",
      500
    );
    return next(error);
  }
  
  fs.unlink(imagePath, err => console.log(err));

  res.status(200).json({ message: "User updated", result: result });

}

exports.updateMe = async (req, res, next) => {
  var headerAuth = req.headers['authorization']
  var userId = jwtUtils.getUserId(headerAuth)

  const { name, surname, dateBorn, email, phone, role } = req.body;
  const Id = req.params.userId;

  if (userId < 0) {
    const error = new HttpError(
      "Wrong token.",
      404
    );
    return next(error);
  }

  User.findById(Id)
    .then(user => {
      if (!user) {
        const error = new HttpError(
          "Could not find post.",
          404
        );
        return next(error);
      }
      if (imageUrl !== user.picture) {
        image.clearImage(user.picture);
      }
      user.name = name,
        user.surname = surname,
        user.dateBorn = dateBorn,
        user.email = email,
        user.phone = phone,
        user.role = role

      user.save();
    })
    .then(result => {
      res.status(200).json({ message: "User updated", result: result });
    })
    .catch(err => {
      const error = new HttpError(
        err,
        500
      );
      return next(error);
    })
}

exports.deleteUser = async (req, res, next) => {
  var headerAuth = req.headers['authorization'];
  var userId = jwtUtils.getUserId(headerAuth);

  if (userId < 0) {
    const error = new HttpError(
      "Wrong token.",
      404
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (e) {
    const error = new HttpError(
      "User no found.",
      404
    );
    return next(error);
  }
  const imageUrl = user.picture;

  try {
    await user.delete();
  } catch (err) {
    const error = new HttpError(
      err,
      404
    );
    return next(error);
  }


  fs.unlink(imageUrl, err => {
    console.log(err);
  });

  return res.status(200).json({ message: 'User deleted successful.' });
}