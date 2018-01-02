'use strict';
const http = require('http');
const express = require('express');
//define express app and port
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./database-models/user-model')
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user-routes');
const adminRoutes = require('./routes/admin-routes')
const campaignRoutes = require('./routes/campaign-routes');
const createDirectories = require('./custom-modules/create-directory');
const tokenverify = require('./custom-modules/jwt-token-verify');
// socket related modules
const server = http.Server(app);
let socket = require('socket.io');
let io = socket.listen(server);
const socket_events = require('./custom-modules/socket-events')

//var textlocal = require('textlocal')(validOptions); //Text Local Api
//auth related modules
const session = require('express-session');
const passport = require('passport');

// ANGULAR UNIVERSAL RELATED MODULES
//for server side rendering implemented using angular universal in frontend
require('zone.js/dist/zone-node');
require('reflect-metadata');
const ngUniversal = require('@nguniversal/express-engine');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist-server/main.bundle');


//connecting to the mongo database running on port 27017
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/crowd', { useMongoClient: true });
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected');
});
mongoose.connection.on('error', function (err) {
  console.log('Database connection error');
});

//=========================================
//            PASSPORT SETUP
//==========================================
//session are used only for passport strategy to work as intended.
//we are using token instead of session.
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }))
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);//passing passport after initializing to strategy

//create directories for uploads if does not exists
createDirectories()


///==================================================================
//            ANGULAR UNIVERSAL SERVER SIDE RENDERING CONFIGURATION
//===================================================================
app.engine('html', ngUniversal.ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
app.set('view engine', 'html');
app.set('views', 'public');

app.use(cors());//cross-origin-requests
app.use(bodyParser.json()); //to parse the json data received
app.use(bodyParser.urlencoded({ extended: false }));

//=================  ROUTES BELOW ============
app.use('/user', userRoutes);// defining the router for api
app.use('/campaigns', campaignRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.render('index', { req, res });
  console.log('server rendered')
});
//static directory for images of fundraiser
app.use(express.static(__dirname));

//================================================================
//                 (SOCKET.io) ### PHONE no VERIFICATION ### (OTP service from TWILIO)
//================================================================
io.sockets.on('connection', (socket)=>{
  socket_events(socket);//  socket_events() is defined in ./custom-modules/socket-events.js
});
//static directory for index.html
app.use(express.static(__dirname + '/public/'));
app.get('*', (req, res) => {
  res.render('index', { req, res });
  console.log('client rendered');
});
//starting server
server.listen(port);
console.log("working");
exports = module.exports = server;   