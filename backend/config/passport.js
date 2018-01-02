const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../database-models/user-model');
const secret = require('./secret').secret;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

module.exports = function (passport) {
  //==============================================================================
  //                  LOCAL STRATEGY USING EMAIL & PASSWORD
  //==============================================================================
  /*no being used as of now
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromHeader("authorization");
    opts.secretOrKey = secret;
    passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {
      process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
      });
      console.log('here in jwt')
      new Promise((resolve, reject) => {
        if (jwt_payload._id) { //======================LOCAL JWT
          User.findById(jwt_payload._id, (err, user) => {
            if (err) {
              console.log('error')
            return done(null, false)
            }
            else {
              console.log('resolve')
              resolve(user)
            }
          });
        }
        else {//=============================== FACEBOOK JWT
          User.findOne({ 'facebook.id': jwt_payload.id }, (err, user) => {
            if (err) {
              return done(err, false);
            }
            else { resolve(user) }
          });
        }
      }).then((user) => {    //==============then()
        if (user) {
          console.log('here in then')
           done();
        } else {
          console.log('user not found')
          return done(null, false);
        }
      })
    }));
  */




  //==================================================================================
  //            SERIALIZE / DESERIALIZE  (used in fb, google strategy)
  //==================================================================================
  //serializeUser and deserializeUser are necessary to implement while using facebook strategy
  //the purpose is to store session and send cookies on client side.
  //But we are using no session(the two methods are necessary to for passport-strategy to work).
  //Everything is authenticated using json Web Token by using "jsonwebtoken" module.
  //#####   Object to store in req.user:
  //everything except hashed pw.
  passport.serializeUser(function (tokenPayload, done) {
    done(null, tokenPayload._id)
  });
  passport.deserializeUser(function (id, done) {
    // console.log('deserialize executed')
    User.findOne({ id: id }, function (err, user) {
      done(null, 'user');
    });
  });


  //====================================================================================================
  //                   PASSPORT-FACEBOOK  STRATEGY
  //====================================================================================================
  passport.use('facebook', new FacebookStrategy({
    clientID: '235427429867485',
    clientSecret: '3e20dbce05a759fff261e418bd30fe3a',
    callbackURL: "http://localhost:3000/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
    function (accessToken, refreshToken, profile, done) {
      //=========================================
      //            PROFILE HAS EMAIL
      //=========================================
      if (profile._json.email) {
        console.log('profile has email')
        new Promise((resolve, reject) => {
          User.findOne({ email: profile._json.email }, (err, user) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(user);
            }
          });

        }).then((user) => {
          if (user) {
            //user already exists in DB
            console.log('email matched with the facebook profile email')
            user.facebook = { fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, email: profile._json.email, token: accessToken };
            user.role = 'user';
            user.save((err) => {
              if (err) { done(err, false) }
              else {
                //compose object to pas to req.user which in turn will be used to form token payload in user-routes
                var tokenPayload = { _id: user._id, fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, email: profile._json.email, token: accessToken }
                done(null, tokenPayload);
              }
            })
          }
          else {
            //user does not exist in DB           
            console.log('no email matched with fb profile email, creating new fb user')
            var newUser = new User({
              role : 'user',
              email: profile._json.email,
              facebook: { fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, email: profile._json.email, token: accessToken }
            });
            User.collection.insert(newUser, (err, user) => {
              if (err) { done(err, false); }
              else {
                console.log('successfully stored user')
                console.log(user.ops[0]['_id']);
                //compose object to pas to req.user which in turn will be used to form token payload in user-routes
                var tokenPayload = { _id: user.ops[0]['_id'], fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, email: profile._json.email, token: accessToken }
                done(null, tokenPayload)
              }
            })
          }
        }).catch((err) => {
          done(err, false);
        });
      }

      //=======================================
      //       PROFILE DOES NOT HAVE EMAIL
      //=======================================
      else {
        console.log('profile does not have email')
        new Promise((resolve, reject) => {
          User.findOne({ 'facebook.fbId': profile._json.id }, (err, user) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(user);
            }
          });
        }).then((user) => {
          if (user) {
            user.role = 'user';
            user.facebook = { fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, token: accessToken }
            user.save((err) => {
              if (err) {
                done(err, false);
              }
              else {
                var tokenPayload = { _id: user._id, fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, token: accessToken }
                done(null, tokenPayload);
              }
            })
          }
          else {
            var newUser = new User({
              role : 'user',
              facebook: { fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, token: accessToken }
            })
            newUser.collection.insert(newUser, (err, user) => {
              if (err) { done(err, false) }
              else {
                var tokenPayload = { _id: user.ops[0]['_id'], fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, token: accessToken }
                done(null, tokenPayload);
              }
            });
          }
        }).catch((err) => {
          done(err, false);
        })
      }
    }
  ));


  //====================================================================================================
  //                              PASSPORT-GOOGLE-OAUTH-2  STRATEGY
  //====================================================================================================

  passport.use('google', new GoogleStrategy({
    clientID: '188366775117-ehjt1t016tp3sg1n0h9mv6hrelk87k54.apps.googleusercontent.com',
    clientSecret: 'EPQ-VDrNVs2UqJb25cvai0iH',
    callbackURL: "http://localhost:3000/user/auth/google/callback",

  },
    function (accessToken, refreshToken, profile, done) {

      // check for already existing user in DB
      new Promise((resolve, reject) => {
        User.findOne({ email: profile.email }, (err, user) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(user);
          }
        });

      }).then((user) => {
        if (user) {
          //user already exists in DB
          console.log('email matched with the google profile email');
          user.role = 'user';
          user.google = { googleId: profile._json.id, name: profile._json.displayName, photo: profile._json.image.url, email: profile.email, token: accessToken };
          user.save((err) => {
            if (err) { done(err, false) }
            else {
              //compose object to pas to req.user which in turn will be used to form token payload in user-routes
              var tokenPayload = { _id: user._id, googleId: profile._json.id, name: profile._json.displayName, photo: profile._json.image.url, email: profile.email}
              done(null, tokenPayload);
            }
          });
        }
        else {
          //user does not exist in DB           
          console.log('no email matched with fb profile email, creating new fb user')
          var newUser = new User({
            role : 'user',
            email: profile._json.email,
            google: { googleId: profile._json.id, name: profile._json.displayName, photo: profile._json.image.url, email: profile.email, token: accessToken }
          });
          User.collection.insert(newUser, (err, user) => {
            if (err) { done(err, false); }
            else {
              console.log('successfully stored user')
              //compose object to pas to req.user which in turn will be used to form token payload in user-routes
              var tokenPayload = { _id: user.ops[0]['_id'], fbId: profile._json.id, name: profile._json.name, photo: profile._json.picture.data.url, email: profile._json.email}
              done(null, tokenPayload)
            }
          });
        }
      }).catch((err) => {
        done(err, false);
      });
    }
  ));



  //====================================================================================================
  //                              PASSPORT-LINKEDIN-OAUTH-2  STRATEGY
  //====================================================================================================

  passport.use(new LinkedInStrategy({
    clientID: '818b257tca7mw9',
    clientSecret: 'FNbNd3kKOidxJrRp',
    callbackURL: "http://localhost:3000/user/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
  }, function (accessToken, refreshToken, profile, done) {
      //=========================================
      //            PROFILE HAS EMAIL
      //=========================================
      // check for already existing user in DB
      new Promise((resolve, reject) => {
        User.findOne({ email: profile._json.emailAddress }, (err, user) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(user);
          }
        });

      }).then((user) => {
       
        if (user) {
          //user already exists in DB
          console.log('email matched with the linkedin profile email');
          user.role = 'user';
          user.linkedin = { linkedinId: profile._json.id, name: profile._json.formattedName, photo: profile._json.pictureUrl, email: profile._json.emailAddress, token: accessToken };
          user.save((err) => {
            if (err) { done(err, false) }
            else {
              //compose object to pas to req.user which in turn will be used to form token payload in user-routes
              var tokenPayload = { _id: user._id, linkedinId: profile._json.id, name: profile._json.formattedName, photo: profile._json.pictureUrl, email: profile._json.emailAddress}
              done(null, tokenPayload);
            }
          });
        }
        else {
          //user does not exist in DB           
          console.log('no email matched with linkedin profile email, creating new linked user')
          var newUser = new User({
            role : 'user',
            email: profile._json.emailAddress,
            linkedin: { linkedinId: profile._json.id, name: profile._json.formattedName, photo: profile._json.pictureUrl, email: profile._json.emailAddress, token: accessToken }
          });
          User.collection.insert(newUser, (err, user) => {
            if (err) { done(err, false); }
            else {
              console.log('successfully stored user')
              //compose object to pas to req.user which in turn will be used to form token payload in user-routes
              var tokenPayload = { _id: user.ops[0]['_id'], linkedinId: profile._json.id, name: profile._json.formattedName, photo: profile._json.pictureUrl, email: profile._json.emailAddress }
              done(null, tokenPayload)
            }
          });
        }
      }).catch((err) => {
        done(err, false);
      });
  }));

//IN CASE IF LINKED IN DOESNT RETURN VERIFIED EMAIL

}
