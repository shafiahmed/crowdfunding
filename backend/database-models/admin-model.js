const User = require('./user-model');
const bcrypt = require('bcryptjs');//utilty to generate hash of password defined by user at the time of registration.





//============================================
//     FIND BY NAME (used in authentication)
//============================================
module.exports.findAdminByEmail = function (email) {
    const query = { email: email, role: 'admin' };
    return new Promise((resolve, reject)=>{
        User.findOne(query, (err,admin)=>{
            if(err){
               reject(err)
            }else{
                if(admin){
                    resolve(admin);
                }
                else{
                    reject();
                }
            }
        });
    })
   
}


//============================================
//     COMPARE PASSWORD ADMIN
//============================================
module.exports.compareAdminPassword = function (enteredPassword, hashedPw, callback) {
    bcrypt.compare(enteredPassword, hashedPw, (err, isMatch) => {
        if (err) {
            callback(null, false)
        }
        else {
            callback(null, isMatch);
        }

    });
}