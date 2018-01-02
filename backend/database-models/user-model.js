const mongoose = require('mongoose');
const Schema = mongoose.Schema; //database schema for storing a user
const bcrypt = require('bcryptjs');//utilty to generate hash of password defined by user at the time of registration.


//========================
// USER SCHEMA DEFINITION
//========================
const userSchema = Schema({
    role: String ,
    name: { type: String, lowercase: true },
    email: { type: String, lowercase: true, unique: true },
    phone: String,
    password: String,
    facebook: {
        fbId: String,
        name: String,
        photo: String,
        token: String,
        email: String
    },
    google: {
        googleId: { type: String },
        name: { type: String },
        photo: { type: String },
        token: { type: String },
        email: { type: String }
    },
    linkedin: {
        linkedinId: { type: String },
        name: { type: String },
        photo: { type: String },
        token: { type: String },
        email: { type: String }
    },
    campaignSaved: {
        isSet: Boolean,
        phone: String,
        startedBy: String,
        title: String,
        category: String,
        beneficiaryName: String,
        baneficiaryType: String,
        organizationName: String,
        organizationWebsite: String,
        pan: String,
        taxStatus: String,
        fundraiserName: String,
        amountToRaise: String,
        story: String,
        city: String,
        video: String,
        imagePath: [String],
        documentPath: [
            { docPath: String, fileExt: String, docCaption: String }
        ],
    },
    campaignsStarted: [Schema.Types.ObjectId],
    campaignsDonated: [Schema.Types.ObjectId]
});

//exporting the user schema
const User = module.exports = mongoose.model('User', userSchema);



//===========================
//     NEW USER INSERT
//===========================
module.exports.addUser = function (newUser, callback) {
    newUser.campaignSaved.isSet = false;
    // ##### if username or email id exists then we have to show the appropriate response to user.#####
    let password = newUser.password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (!err) {
                newUser.password = hash;
                newUser.role = 'user';
                User.collection.insert(newUser, callback);
            }
        });
    });
}

//============================================
//    ADD PHONE NUMBER
//============================================
module.exports.addPhone = function (phone, id) {
    User.findById(id, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            user.phone = phone;
            user.save((err) => {
                if (!err) {
                    console.log('user phone updated')
                }
            })
        }
    })
}
//============================================
//    IS PHONE NO REGISTERED IN DATABASE
//============================================
module.exports.isPhoneRegistered = function (id) {
    return new Promise((resolve, reject) => {
        User.findById(id, (err, user) => {
            if (err) {
                reject({ success: false, msg: 'no user found' })
            }
            else {
                if (user.phone) {
                    resolve({ success: true, msg: 'user phone registered' })
                }
                else {
                    reject({ success: false, msg: 'phone no not registered' })
                }
            }
        })
    });
}

//=========================================================================
//    DESTROY CAMPAIGN STATE WHEN USER CANCELS THE FILLED FORM
//=========================================================================
module.exports.destroyCampaignState = function (_id) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(_id, { $set: { campaignSaved: { isSet: false } } }, { new: true }, (err, user) => {
            if (err) {
                console.log(err)
                resolve({ success: false, msg: 'some error occured' })
            }
            else {
                resolve({ success: true, msg: 'fundraiser state removed successfully' })
            }
        })
    })
}
//=========================================================================
//     SAVE CREATED FUNDRAISER ID IN USER DATABASE AS campaignsStarted
//=========================================================================
module.exports.saveCampaignId = function (campaign_id, user_id) {
    console.log(campaign_id)
    User.findByIdAndUpdate(user_id, { $push: { campaignsStarted: campaign_id } }, (err) => {
        if (err) {
            console.log(err)
        }
    })
}

//============================================
//     FIND BY EMAIL (used in authentication)
//============================================
module.exports.findByEmail = function (email, callback) {
    const query = { email: email, role: 'user' };
    User.findOne(query, callback);
}


//============================================
//     COMPARE PASSWORD
//============================================
module.exports.comparePassword = function (enteredPassword, hash, callback) {
    bcrypt.compare(enteredPassword, hash, (err, isMatch) => {
        if (err) {
            callback(null, false)
        }
        else {
            callback(null, isMatch);
        }

    });
}
