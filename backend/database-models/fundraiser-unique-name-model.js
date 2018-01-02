const mongoose = require('mongoose');
const Schema = mongoose.Schema; //database schema for storing a user

const fundraiserNameSchema = new Schema({
    fundraiserName: {
        type: String,
        unique: true
    }
})


const fundraiserName = module.exports = mongoose.model('fundraiserName', fundraiserNameSchema);



//==================================================================
//                THIS FUNCTION IS CALLED IN SOCKET-EVENTs.js
//==================================================================
module.exports.checkFundraiserName = function (name) {
    var dashedName = name.replace(/\s/g,'-');  
    dashedName = dashedName.toLowerCase()
    console.log('reached in checkFundraiserName')
    console.log(dashedName)
    return new Promise((resolve, reject) => {
        fundraiserName.find({ fundraiserName: dashedName }, (err, data) => {
            if (data.length>0) {
                resolve({ success: true, msg: 'Name exists.Try another name' })
            }
            else {
                resolve({ success: false, msg: 'Name available' })
            }
        })
    })
}

module.exports.addNewFundraiserName = function(name){
    fundraiserName.collection.insert({fundraiserName: name},(err, data)=>{
        if(err){
            console.log(err)
        }

    })
}