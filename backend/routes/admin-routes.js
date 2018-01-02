const express = require('express');
const router = express.Router();
const AdminModel = require('../database-models/admin-model')
const jwt = require('jsonwebtoken');
const adminSecret = require('../config/secret').adminSecret;
const adminAuthGuard = require('../custom-modules/auth-guard/admin-auth-guard')
const CampaignModel = require('../database-models/campaign-model');




router.post('/admin-login', (req, res, next) => {
    AdminModel.findAdminByEmail(req.body.email).then((admin) => {
        const password = req.body.password;
        //here we  are comparing the password with the admin sign in to the password stored in DB
        //password was saved in hash format by using bcrypt.
        AdminModel.compareAdminPassword(password, admin.password, (err, isMatch) => {
            if (!isMatch) {
                console.log('password not matched')
                res.json({ success: false, msg: 'Authentication failed!. Invalid email or password.' });
            }
            else {
                const payload = {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email
                };
                var token = jwt.sign(payload, adminSecret, {
                    expiresIn: 86400 // token expiry time in seconds, currently set at 24 hours
                });
                // return the information including token as JSON
                var authData = {
                    success: true,
                    message: 'token issued',
                    token: token,  // this token is saved on the clients side and will expire in the defined time.
                    adminData: {
                        isAdmin: true,
                        name: admin.name,
                        email: admin.email
                    }
                }
                res.json(authData);
            }
        });

    }).catch(() => {
        res.json({ success: false, msg: 'No admin matched with the email' })
    })
})

router.post('/zakaat-status', function (req, res, next) {
    adminAuthGuard(req, res, next)
}, function (req, res, next) {
    console.log(req.body.zakaatEligible)
    CampaignModel.findByIdAndUpdate(req.body._id, { $set: { zakaatEligible: req.body.zakaatEligible } }, (err, status) => {
        if (err) {
            console.log(err)
            res.json({ success: false })
        }
        else {
            res.json({ success: true })
        }
    })
})

module.exports = router;