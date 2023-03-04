const jwt = require('jsonwebtoken')

const jwtSecretKey = process.env.JWT_KEY;

module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData._id
        },
        jwtSecretKey,
        {
            expiresIn: "1h"
        })
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null
    },
    getUserId: function(authorization) {
        var userId = -1
        var token = module.exports.parseAuthorization(authorization)
        if(token != null) {
            try{
                var jwtToken = jwt.verify(token, jwtSecretKey)
                if(jwtToken != null) {
                    userId = jwtToken.userId
                }
            } catch(err) { }
        }
        return userId
    }
}