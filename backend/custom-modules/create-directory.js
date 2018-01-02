const fs = require('fs');



module.exports = function () {

    var uploads = './public/uploads';
    var fundraisers = './public/fundraisers';
    var images = './public/fundraisers/images';
    var documents = './public/fundraisers/documents';


    fs.exists(uploads, (exists) => {
        if (exists === false) {
            fs.mkdir('./public/uploads', (err) => {
                if (!err) {
                    console.log('uploads directory created')
                }
                else {
                    console.log(err)
                }
            });
        }
        else {
            console.log('uploads directory exists');
        }
    });


    fs.exists(fundraisers, (exists) => {
        if (exists === false) {
            fs.mkdir(fundraisers, (err) => {
                if (!err) {
                    console.log('fundraisers directory created')
                    fs.mkdir(images, (err) => {
                        if (!err) {
                            console.log('images directory created')
                        }
                        else {
                            console.log(err);
                        }
                    });
                    fs.mkdir(documents, (err) => {
                        if (!err) {
                            console.log('documents directory created')
                        }
                        else {
                            console.log(err);
                        }
                    });
                }
                else {
                    console.log(err)
                }
            });
        }
        else {
            console.log('fundraisers directory exists');
        }
    })
}
