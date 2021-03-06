const multer = require('multer');
const path = require('path');

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


// ===================Check IMAGE File Type Used in upload() method
function checkFileTypeForImage(file, callback) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback('Error: Documents with extensions jpg, png, pdf are allowed.');
    }
}

// ==================== Upload() method called in router.post('/upload')
module.exports.uploadDoc = multer({
    storage: storageConf,
    limits: { fileSize: 10000000000000000000 },
    fileFilter: function (req, file, callback) {
        checkFileTypeForImage(file, callback);
    }
}).single('fundraiser-document');// same as frontend formData input name appended



