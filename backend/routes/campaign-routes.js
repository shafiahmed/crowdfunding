const express = require('express');
const router = express.Router();
const fs = require('fs');
const authGuard = require('../custom-modules/auth-guard/auth-guard');
const adminAuthGuard = require('../custom-modules/auth-guard/admin-auth-guard')
const Campaign = require('../database-models/campaign-model');
const fundraiserNameModel = require('../database-models/fundraiser-unique-name-model')
const User = require('../database-models/user-model');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerImageUpload = require('../custom-modules/file-upload/image-upload-multer')
const multerDocUpload = require('../custom-modules/file-upload/doc-upload-multer')
const secret = require('../config/secret').secret;
const path = require('path');





//==========================================================================================================
//                                             FUNDRAISER REGISTER     
//=========================================================================================================
router.post('/register', function (req, res, next) { authGuard(req, res, next) }, function (req, res, next) {
    var fundraiserData = req.body;
    //storing the credentials of the person registered who started the campaign fetched from decoded token.
    var registeredUserData = { email: req.decoded.email, name: req.decoded.name, _id: req.decoded._id }
    fundraiserData['registeredUserData'] = registeredUserData;
    fundraiserData['amountRaised'] = 0;
    //checking for null values from from end
    fundraiserData.fundraiserName = fundraiserData.fundraiserName.toLowerCase().replace(/\s/g, '-');
    //move the images from upload folder to images folder  
    moveUploadedImageFile(fundraiserData.imagePath[0], fundraiserData.fundraiserName).then((imageUrl) => {
        fundraiserData.imagePath[0] = imageUrl; // when image is finally uploaded to fundraisers/images folder
        moveUploadedDocFiles(fundraiserData.documentPath, fundraiserData.fundraiserName).then((docsUrlArray) => {
            fundraiserData.documentPath = docsUrlArray;
            let newCampaign = new Campaign(fundraiserData);
            //execute insert register mongoose query
            Campaign.registerCampaign(newCampaign, (err, fundraiser) => {
                if (err) {
                    console.log(err)
                    res.json({ success: false, msg: 'Some error occured!.fundraiser could not be saved' });
                }
                else {
                    //add new url fundraisername to its database.
                    fundraiserNameModel.addNewFundraiserName(fundraiserData.fundraiserName);
                    let fundraiserId = fundraiser.ops[0]._id;
                    //save fundraiser _id to user database by passing fundraiser _id and user_id resp. to saveCampaignId()
                    User.saveCampaignId(fundraiserId, req.decoded._id);
                    // deleting/nulling temporary campaignSaved from user database
                    User.destroyCampaignState(req.decoded._id).then((status) => {
                        console.log(status)
                    })
                    console.log('campaign added to db')
                    res.json({ success: true, msg: 'Fundraiser successfully created' });
                }
            });

        })


    })


});


router.post('/upload-image', function (req, res, next) {
    authGuard(req, res, next)// middleware for auth guard
}, function (req, res, next) {
    multerImageUpload.uploadImage(req, res, (err) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err });
        } else {
            if (req.file == undefined) {
                res.json({ success: false, msg: 'Error: No file selected!' });
            } else {
                //if file is uploaded to upload directory, then we move it to proper directory of fundraiser
                //  res.json({ success: true, msg: 'File uploaded!', file: `uploads/${req.file.filename}` });
                var uploadedFilePath = `uploads/${req.file.filename}`;
                var fileName = req.file.filename;
                /*  moveUploadedImageFile(uploadedFilePath, fileName).then((filePathDB) => {
                      res.json({ success: true, filePath: filePathDB });
                      console.log(filePathDB)
                  })*/
                //save uploaded image path to user database to prevent unnecessary no of image upload
                User.findByIdAndUpdate(req.decoded._id, { $set: { "campaignSaved.imagePath": uploadedFilePath } },
                    (err) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log('image file path saved');
                        }
                    })
                console.log(fileName)
                console.log('uploadedFilePath:' + uploadedFilePath)
                res.json({ success: true, filePath: uploadedFilePath });
            }
        }
    });
});


router.post('/delete-image', function (req, res, next) {
    authGuard(req, res, next)// middleware for auth guard
}, (req, res, next) => {
    console.log('reached')
    let pathImage = path.join(__dirname, '.././public/' + req.body.imagePath)
    console.log(pathImage)
    fs.unlink(pathImage, (err) => {
        if (!err) {
            User.findByIdAndUpdate(req.decoded._id, { $set: { 'campaignSaved.imagePath': [] } }, (err) => {
                console.log(err)
                if (!err) {
                    res.json({ success: true })
                }
            })
        }
    });
}
)

/*
//======================================
//          MULTER CONFIGURATION
//======================================
// Set Storage Engine, used in upload() function
const storageConf = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// ==================== Upload() method called in router.post('/upload')
const upload = multer({
    storage: storageConf,
    limits: { fileSize: 10000000000000000000 },
    fileFilter: function (req, file, callback) {
        checkFileTypeForImage(file, callback);
    }
}).single('fundraiser-image');// same as frontend formData input name appended

// ===================Check IMAGE File Type Used in upload() method
function checkFileTypeForImage(file, callback) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback('Error: Only images with extension as jpeg, jpg, png, gif are allowed.');
    }
}*/



//=================  MOVE IMAGE FILE TO FUNDRAISER DIRECTORY==========
moveUploadedImageFile = function (uploadedFilePath, customfileName) {
    let uploadedFileName = uploadedFilePath.split('/');
    return new Promise((resolve, reject) => {
        //full path will change in case of linux
        var exactUploadedFilePath = path.join(__dirname, '.././public/' + uploadedFilePath);//uploaded file OS file system path
        var routeUrl = 'http://localhost:3000/public/fundraisers/images/' + customfileName + '-' + uploadedFileName[1]; //url file path
        var exactNewPath = path.join(__dirname, '.././public/fundraisers/images/' + customfileName + '-' + uploadedFileName[1])//new OS file path
        fs.rename(exactUploadedFilePath, exactNewPath, (err) => {
            if (!err) {
                console.log('file moved');
                resolve(routeUrl);
            }
            else {
                console.log('file not moved')
            }
        });
    });
}






//=================  MOVE IMAGE FILE TO FUNDRAISER DIRECTORY==========
moveUploadedDocFiles = function (uploadedFilePathArray, customDocfileName) {

    var Promises = uploadedFilePathArray.map(eachFile => {
        return new Promise((resolve, reject) => {
            var uploadedFileName = eachFile['docPath'].split('/')
            var uploadedFileName = eachFile['docPath'].split('/')[1];
            var exactUploadedFilePath = path.join(__dirname, '.././public/' + eachFile['docPath']);//uploaded file OS file system path
            var routeUrl = 'http://localhost:3000/public/fundraisers/documents/' + customDocfileName + '-' + uploadedFileName; //url file path
            var exactNewPath = path.join(__dirname, '.././public/fundraisers/documents/' + customDocfileName + '-' + uploadedFileName)//new OS file path

            fs.rename(exactUploadedFilePath, exactNewPath, (err) => {
                if (!err) {
                    console.log('file moved');
                    let dbDocPathObject = { docUrl: routeUrl, docCaption: eachFile['docCaption'] }
                    resolve(dbDocPathObject);
                }
                else {
                    console.log('file not moved')
                }
            });
        }
        )
    })

    return Promise.all(Promises)

}



router.post('/upload-document/:caption', function (req, res, next) {
    authGuard(req, res, next)// middleware for auth guard
}, function (req, res, next) {
    multerDocUpload.uploadDoc(req, res, (err) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: err });
        } else {
            if (req.file == undefined) {
                res.json({ success: false, msg: 'Error: No file selected!' });
            } else {
                //if file is uploaded to upload directory, then we move it to proper directory of fundraiser
                var uploadedFilePath = `uploads/${req.file.filename}`;
                var fileName = req.file.filename;
                /*  moveUploadedImageFile(uploadedFilePath, fileName).then((filePathDB) => {
                      res.json({ success: true, filePath: filePathDB });
                      console.log(filePathDB)
                  })*/
                //save uploaded image path to user database to prevent unnecessary no of image upload
                var fileExt = req.file.mimetype.split('/')[1];
                User.findByIdAndUpdate(req.decoded._id,
                    {
                        $push: {
                            "campaignSaved.documentPath": {
                                docPath: uploadedFilePath,
                                fileExt: fileExt,
                                docCaption: req.params.caption
                            }
                        }
                    }, { new: true },
                    (err, user) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log('image file path saved');
                            console.log('uploadedFilePath:' + uploadedFilePath)
                            res.json({
                                success: true,
                                documentPath: user.campaignSaved.documentPath
                            });
                        }
                    })
            }
        }
    })
})


router.post('/delete-document', function (req, res, next) {
    authGuard(req, res, next)// middleware for auth guard
}, (req, res, next) => {
    let docPathDir = path.join(__dirname, '.././public/' + req.body.docPath)
    fs.unlink(docPathDir, (err) => {
        if (!err) {
            console.log('document deleted')
            User.findByIdAndUpdate(req.decoded._id, { $pull: { 'campaignSaved.documentPath': { _id: req.body.doc_id } } }, { new: true }, (err, data) => {
                if (!err) {

                    res.json({ success: true, documentPath: data.campaignSaved.documentPath })
                }
            })
        }
    });
}
)


//========================================================================================================
//                                            TOP CAMPAIGNS
//========================================================================================================
router.get('/topcampaigns', (req, res) => {
    Campaign.find({ verified: true }, { "startedBy": 0, "baneficiaryType": 0, "pan": 0, "taxStatus": 0, "endDate": 0 }, function (err, campaigns) {
        res.json(campaigns);
        console.log('sent')
    })

})

router.get('/featured-banner', (req, res) => {
    Campaign.find({ verified: true }, { "baneficiaryType": 0, "pan": 0, "taxStatus": 0, "endDate": 0 }, { limit: 2 }, function (err, campaigns) {
        if (err) {
            console.log(er)
        }
        res.json({ success: true, featuredFrObject: campaigns });
    })

})


router.get('/load-teaser', (req, res, next) => {
    let structure = {
        "_id": 0,
        "imagePath": 1,
        "amountRaised": 1,
        "amountToRaise": 1,
        "daysLeft": 1,
        "category": 1,
        "title": 1,
        "fundraiserName": 1,
        "startedBy": 1
    }
    Campaign.find({verified: true}, structure, (err, teaserData) => {
        if (err) {
            console.log(err)
            res.json({ success: false, "teaserData": null });
        }
        else {
            console.log(teaserData);
            res.json({ success: true, "teaserData": teaserData });
        }

    })
});



router.get('/load-fr-profile/:frname', (req, res, next) => {
    let frName = req.params.frname
    Campaign.find({ "fundraiserName": frName }, (err, frProfileData) => {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: 'Sorry! no fundraiser found' })
        }
        else {
            if (frProfileData.length == 0) {
                console.log('no fundraiser found')
                res.json({ success: false, msg: 'Sorry! no fundraiser found' })
            }
            else {
                console.log(frProfileData)
                res.json({ success: true, frProfileData })
            }
        }
    })
})



router.post('/admin-campaigns', function (req, res, next) {
    adminAuthGuard(req, res, next)
}, function (req, res, next) {
    Campaign.find({verified: false}, (err, fundraisers) => {
        if (err) {
            console.log(err)
            res.json(err)
        }
        else {
            res.json({ success: true, fundraisersArray: fundraisers });
        }
    })
})



router.post('/reviewed', function (req, res, next) {
    adminAuthGuard(req, res, next)
}, function (req, res, next) {
    console.log(req.body.verified)
    Campaign.findByIdAndUpdate(req.body._id, { $set: { verified: req.body.verified } }, (err, status) => {
        if (err) {
            console.log(err)
            res.json({ success: false })
        }
        else {
            res.json({ success: true })
        }
    })
})

router.post('/zakaat-eligible', function (req, res, next) {
    adminAuthGuard(req, res, next)
}, function (req, res, next) {
    console.log(req.body.zakaatEligible)
    Campaign.findByIdAndUpdate(req.body._id, { $set: { zakaatEligible: req.body.zakaatEligible } }, (err, status) => {
        if (err) {
            console.log(err)
            res.json({ success: false })
        }
        else {
            res.json({ success: true })
        }
    })
})
/*
//=========================================
//       TOKEN AUTHORIZED ROUTES BELOW
//=========================================
router.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['authorization'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                console.log('token available')
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});
*/





module.exports = router;