//Available in nodejs
var express = require('express'),
	//exphbs = require('express-handlebars'),
	logger = require('morgan'),
	moment = require('moment-timezone'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	//passport = require('passport'),
	//LocalStrategy = require('passport-local'),
	//yaml = require("node-yaml"),
	//util = require('util'),
	fs = require('fs');

//NOTE: node-webcam is uses fswebcam, which implies camera must be on SERVER
var NodeWebcam = require( "node-webcam" );

var app = express();
var port = 8086;
//Default options
var data_path = "data";

//===============EXPRESS================
// see also Erik Arneson. <https://www.ctl.io/developers/blog/post/build-user-authentication-with-node-js-express-passport-and-mongodb>. 26 Feb 2014. 8 Aug 2017.
// Configure Express
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'jklaaaaaaaaa99', saveUninitialized: true, resave: true}));
//app.use(passport.initialize());
//app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
	var err = req.session.error,
		msg = req.session.notice,
		success = req.session.success;

	delete req.session.error;
	delete req.session.success;
	delete req.session.notice;

	if (err) res.locals.error = err;
	if (msg) res.locals.notice = msg;
	if (success) res.locals.success = success;

	next();
});

var webcam_opts = {
	//Picture related
	width: 1280,
	height: 720,
	quality: 100,
	//Delay to take shot
	delay: 0,
	//Save shots in memory
	saveShots: true,
	// [jpeg, png] support varies
	// Webcam.OutputTypes
	output: "jpeg",
	//Which camera to use
	//Use Webcam.list() for results
	//false for default device
	device: false,
	// [location, buffer, base64]
	// Webcam.CallbackReturnTypes
	callbackReturn: "location",
	//Logging
	verbose: true
};

var Webcam = null;
var anotherCam = null;

function get_html_top() {
	var ret="";
	ret += '<html>'+"\n";
	ret += '  <head>'+"\n";
	ret += '    <title>Welcome to VisageBox</title>'+"\n";
	ret += '  </head>'+"\n";
	return ret;
}

app.get('/', function (req, res) {
	var ret = "";
	ret += get_html_top();
	ret += '  <body>'+"\n";
	ret += '    <h1><a href="/get">Begin</a></h1>';
	ret += '  </body>'+"\n";
	ret += '</html>'+"\n";
	res.send(ret);
});

app.get('/get', function (req, res) {
	var ret = "";
	ret += get_html_top();
	ret += '  <body>'+"\n";
	ret += '    <form method="post" action="/push">'+"\n";
	ret += '      <input type="file" accept="image/*">'+"\n";
	ret += '    </form>'+"\n";
	ret += '  </body>'+"\n";
	ret += '</html>'+"\n";
	res.send(ret);
});

app.get('/nwinit', function (req, res) {
	var machine_id = 0;  // always 0 for webcam on SERVER
	var ret = 'initializing webcam...';
	//Creates webcam instance
	Webcam = NodeWebcam.create( webcam_opts );
	ret += 'initializing ok...';
	res.send(ret);
});

app.get('/nwtest', function (req, res) {
	var machine_id = 0;  // always 0 for webcam on SERVER
	var ret = 'testing webcam...';
	//Will automatically append location output type
	Webcam.capture( data_path + "/test_picture", function( err, data ) {} );
	ret += 'testing ok';
	res.send(ret);
});

app.get('/nwtestbase64', function (req, res) {
	var machine_id = 0;  // always 0 for webcam on SERVER
	ret = 'testing webcam using base64 image as target...';
	//Return type with base 64 image
	var this_webcam_opts = {
		callbackReturn: "base64"
	};
	
	//One-function version: "Will return Webcam instance via NodeWebcam.create"
	//NOTE: still saves image file
	NodeWebcam.capture( data_path+"/machines/"+machine_id+"/test_picture", webcam_opts, function( err, data ) {
		req.session.nw_result_html = "saving "+data+"..."+err; //data is path
	});
	ret += "loading image...<br>\n"
	ret += "<br>\n"
	ret += 'testing webcam using base64 image as target ok';
	res.send(ret);
});

app.get("/getnwimage", function (req, res) {
	var machine_id = 0;  // always 0 for webcam on SERVER
	res.send(req.session.nw_result_html);
});

app.get('/nwtestquick', function (req, res) {
	var machine_id = 0;  // always 0 for webcam on SERVER
	var ret = 'quick testing webcam...';
	//One-function version: "Will return Webcam instance via NodeWebcam.create"
	NodeWebcam.capture( data_path+"/machines/"+machine_id+"/test_picture", webcam_opts, function( err, data ) {
	});
	ret += "<br>\n"
	ret += 'quick testing ok';
	res.send(ret);
});

app.get('/nwinitother', function (req, res) {
	var machine_id = 0;  // always 0 for webcam on SERVER
	var ret = 'initializing other webcam [0]...';
	//Get list of cameras
	Webcam.list( function( list ) {
		//Use another device
		anotherCam = NodeWebcam.create( { device: list[ 0 ] } );
	});
	ret += "<br>\n"
	ret += 'other webcam [0] ok';
	res.send(ret);
});


app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
