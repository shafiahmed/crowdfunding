const express = require('express');
const router = express.Router();
const User = require('../database-models/user-model');
const Admin = require('../database-models/admin-model');
const authGuard = require('../custom-modules/auth-guard/auth-guard');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const secret = require('../config/secret').secret;
const adminSecret = require('../config/secret').adminSecret;




//============================
//       USER REGISTRATION
//============================

//THE authGuard AUTHENTICATES request verifying the token came attached with request.

router.post('/register', (req, res, next) => {
    //creating new user from schema and registering the credentials
    // received from user registration form to the schema defined.
    User.findByEmail(req.body.email, function (err, user) {
        if (user) {
            res.json({ success: false, msg: 'User by this email id already exists' });
        } else {
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            //addUser function defined in user schema to store new registered user to database
            User.addUser(newUser, (err, status) => {
                if (err) {
                    res.json({ success: false, msg: 'Failed to register user' });// in case if user already exists
                }
                else {
                    res.json({ success: true, msg: 'Registered successfully' });
                }
            });
        }
    });

});



//=======================================================
//      USER SIGN IN / AUTHENTICATION (LOCAL SIGN IN)
//======================================================
router.post('/authenticate', function (req, res) {
    //find the user by email in Database
    //findByEmail() method is defined in user-model.js file
    User.findByEmail(req.body.email, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, msg: 'Authentication failed!. User not found' });
        } else if (user) {
            const password = req.body.password;
            //here we  are comparing the password while the user sign in to the password stored in DB
            //password was saved in hash format by using bcrypt.
            User.comparePassword(password, user.password, (err, isMatch) => {
                if (!isMatch) {
                    console.log('not matched')
                    res.json({ success: false, msg: 'Authentication failed!. Invalid email or password.' });
                }
                else {
                    const payload = {
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    };
                    var token = jwt.sign(payload, secret, {
                        expiresIn: 86400 // token expiry time in seconds, currently set at 24 hours
                    });
                    // return the information including token as JSON
                    var authData = {
                        success: true,
                        message: 'Token issued',
                        token: token,  // this token is saved on the clients side and will expire in the defined time.
                        userData: {
                            name: user.name,
                            email: user.email
                        }
                    }
                    res.json(authData);
                }
            });
        }

    });
});

//=========================================
//   passport facebook authentication
//=========================================

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'publish_actions', 'manage_pages'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook',
    // failure Redirect to be changed when deployed in production environment   
    //a separate fb error page will be created to acknowledge user of error.
    { failureRedirect: 'http://localhost:4200' }), (req, res) => {
        //create token
        console.log(req.user);
        if (!req.user.email) { req.user.email = null }//in case when facebook user does not have verified email.
        const payload = {
            _id: req.user._id,
            name: req.user.name,
            photo: req.user.photo,
            fbId: req.user.fbId,
            email: req.user.email
            //Other user details will be added further
        };
        var token = jwt.sign(payload, secret, {
            expiresIn: 86400 // token expiry time in seconds, currently set at 24 hours
        });
        //change in production environment
        res.redirect('http://localhost:4200/profile/' + token);
    });

//=========================================
//   passport google authentication
//=========================================
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', passport.authenticate('google',
    // failure Redirect to be changed when deployed in production environment   
    //a separate fb error page will be created to acknowledge user of error.
    { failureRedirect: 'http://localhost:4200' }), (req, res) => {
        //create token
        //  console.log(req.user);
        const payload = {
            _id: req.user._id,
            name: req.user.name,
            photo: req.user.photo,
            googleId: req.user.googleId,
            email: req.user.email
            //Other user details will be added further
        };
        var token = jwt.sign(payload, secret, {
            expiresIn: 86400 // token expiry time in seconds, currently set at 24 hours
        });
        //change in production environment        
        res.redirect('http://localhost:4200/profile/' + token);
    });

//=========================================
//   passport linkedin authentication
//=========================================
router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin',
    // failure Redirect to be changed when deployed in production environment   
    //a separate fb error page will be created to acknowledge user of error.
    { failureRedirect: 'http://localhost:4200' }), (req, res) => {
        //create token
        //  console.log(req.user);
        if (!req.user.email) { req.user.email = null }//in case when facebook user does not have verified email.
        const payload = {
            _id: req.user._id,
            name: req.user.name,
            photo: req.user.photo,
            linkedinId: req.user.linkedinId,
            email: req.user.email
            //Other user details will be added further
        };
        var token = jwt.sign(payload, secret, {
            expiresIn: 86400 // token expiry time in seconds, currently set at 24 hours
        });
        //change in production environment        
        res.redirect('http://localhost:4200/profile/' + token);

    });



//===============================================================================================
//                               PROTECTED ROUTES WITH TOKEN
//===============================================================================================



//=================================================================================
//      WHEN REGISTERING CAMPAIGNS , USER PHONE IS CHECKED FOR PRESENCE IN DB
//=================================================================================
router.get('/isphoneverified',function (req, res, next) { authGuard(req, res, next) }, (req, res) => {
    User.isPhoneRegistered(req.decoded._id).then((status) => {
        res.json(status)
    }).catch((status) => {
        res.json(status);
    })
})

router.get('/retrieve-campaign-state',function (req, res, next) { authGuard(req, res, next) }, (req, res) => {
    User.findById(req.decoded._id, (err, user) => {
        if (!err) {
            if (user.campaignSaved.isSet === false) {
                res.json({ state: false })
            }
            else {
                res.json({ state: true, campaignSaved: user.campaignSaved })
            }
        }
    })
})
router.post('/save-campaign-state',function (req, res, next) { authGuard(req, res, next) }, (req, res) => {
    let campaignState = req.body;
    campaignState.isSet = true;
    delete campaignState.phone;
    User.findByIdAndUpdate(req.decoded._id, { $set: { campaignSaved: campaignState } }, { new: true }, (err, user) => {
        if (!err) {
            res.json({ success: false, msg: 'cannot save the fundraiser state' })
            console.log(user)
        }
        else {
            res.json({ success: true, msg: 'saved fundraiser state' });
        }
    });
});

router.post('/destroy-campaign-state',function (req, res, next) { authGuard(req, res, next) }, (req, res) => {
    User.destroyCampaignState(req.decoded._id).then((status) => {
        res.json(status);
    })
})

//===========================
//      USER  PROFILE
//===========================
router.get('/profile',function (req, res, next) { authGuard(req, res, next) }, (req, res) => {
    var profileData = { name: req.decoded.name, photo: req.decoded.photo }
    res.json({ success: true, profileData });
});


module.exports = router;
