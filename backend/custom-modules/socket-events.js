var accountSid = 'AC3b2e2d6aaba5794a6c03f95001d8b748'; // Your Account SID from www.twilio.com/console
var authToken = '01d8226a01dda33636698aab0e57e020';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var client = twilio(accountSid, authToken);
const User = require('../database-models/user-model')
const FundraiserNameModel = require('../database-models/fundraiser-unique-name-model')
const verifyToken = require('./jwt-token-verify')
// user model to save some user details here in socket-event file)
//===============================================================
//              SOCKET.io for phone no verification using OTP
//===============================================================
module.exports = function (socket) {
  {
    var otp_generated;
    console.log('new socket connected');

    socket.on('verify-number', (phone) => {
      socket.phone = phone;
      console.log(phone)
      otp_generated = Math.floor(1000 + Math.random() * 9000);
      socket._otpStored = otp_generated;
      client.messages.create({
        body: `Your OTP for phone number verification is: ${otp_generated}.`,
        to: phone,  // Text this number
        from: '+16198221960' // From a valid Twilio number
      }).then((message) => {
        console.log(message.sid)
        socket.emit('isPhoneNoCorrect', { success: true, msg: 'Enter the otp received.' })
      })
        .catch((error) => {
          console.log(error);
          socket.emit('isPhoneNoCorrect', { success: false, msg: 'Please enter correct phone number.' })
        })
    })

    socket.on('verify-otp', (otpEntered, authToken) => {
      if (Number(socket._otpStored) === Number(otpEntered)) {
        console.log('otp matched');
        let user_id = verifyToken.verifyToken(authToken)
        user_id.then((_id) => {
          User.addPhone(socket.phone, _id)// add phone no in user database
        })
        socket.emit('isOtpCorrect', { success: true, msg: 'Phone number verified successfully.' })
      }
      else {
        console.log('otp not matched')
        socket.emit('isOtpCorrect', { success: false, msg: 'Incorrect opt entered.' })
      }
    })

//fundraiser name check soket
socket.on('check-name',(name)=>{
  FundraiserNameModel.checkFundraiserName(name).then((status)=>{
    socket.emit('check-name-status',status)    
})
})



    socket.on('disconnect', (data) => {
      console.log('socket disconnected')
    });
  }

}