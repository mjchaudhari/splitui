// server.js
// set up ======================================================================
// get all the tools we need
var express         = require('express');
var app             = express();
var port            = process.env.PORT || 3000;
var path            = require("path");
var bodyParser      = require('body-parser');

//app.use(bodyParser.urlencoded());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/")))	

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
});

app.get('/', function (req, res, next) {
   console.log('in route');
   
  res.sendFile( __dirname + '/views/default.html');
});
// launch =====ss=================================================================

app.listen(port);
console.log('Start on port ' + port);
