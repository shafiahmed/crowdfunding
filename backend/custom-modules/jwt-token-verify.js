const secret = require('../config/secret').secret
const jwt = require('jsonwebtoken');

module.exports.verifyToken = function (token) {

    return new Promise((resolve, reject) => {

        // verifies secret and checks exp
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                console.log('error')
                reject({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                resolve(decoded._id)
            }
        });


    })


}
