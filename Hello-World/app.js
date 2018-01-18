var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require("path");

var app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var exec = require('child_process').exec;

var OUTFORMATS = ['xml', 'json', 'html'];
var DAYTIMES = ['morning', 'evening', 'night'];



var handler = function(req, res, next){


	var first, last, returnContentType = (res.locals.outformat == "xml" || res.locals.outformat == "json")?'application/'+res.locals.outformat : "text/html";
	var delayResponse = ("delay" in req.query)? true : false;

	var myRenderer = function(template, renderParameters){
		//
		console.log("Delay : "+delayResponse);
		if(!delayResponse)
			res.render(template, renderParameters);
		else
			setTimeout(function(){ res.render(template, renderParameters); }, 1000*Math.floor( Math.random()*(10-5)+5 ));
	}


	if(req.method === 'GET'){
		console.log("METHOD IS GET");
		if(!req.query.firstname){
			res.set('Content-Type', returnContentType);
			return myRenderer("index", { outformat : res.locals.outformat, status : "Error", message : "Firstname is required" });
		}

		first = req.query.firstname.replace(/\ /g, "\\ "); 
		last = (req.query.lastname)? req.query.lastname.replace(/\ /g, "\\ ") : null;
	}
	else if(req.method === 'POST'){
		if(!req.body.firstname){
			res.set('Content-Type', returnContentType);
			return myRenderer("index", { outformat : res.locals.outformat, status : "Error", message : "Firstname is required" });
		}

		first = req.body.firstname.replace(/\ /g, "\\ "); 
		last = (req.body.lastname)? req.body.lastname.replace(/\ /g, "\\ ") : null;
	}
	else {
		res.set('Content-Type', returnContentType);
		return myRenderer("index", { outformat : res.locals.outformat, status : "Error", message : "Only GET and POST is accepted" });
	}


	
	var cmd = "bash hello.sh "+( (res.locals.daytime)? "-t="+res.locals.daytime : "")+" -f="+first+( (last)?" -l="+last: '' );
	console.log("CMD : "+cmd);
	exec(cmd, (error, stdout, stderr) => {
		console.log(`error : ${error}, stdout : ${stdout}, stderr : ${stderr}`);
		res.set('Content-Type', returnContentType);
		myRenderer("index", { outformat : res.locals.outformat, status : "success", message : stdout.replace(/\n$/, "") });
	});
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
	if(req.query.outformat){
		if(OUTFORMATS.indexOf(req.query.outformat.toLowerCase()) < 0)
			return res.status(500).end("The specified Content-type is not supported. Here are the supported values : "+OUTFORMATS.join(", ")+".");
		res.locals.outformat = req.query.outformat.toLowerCase();
	}
	else
		res.locals.outformat = "html";
	next();
});

app.use("/:d_time", function(req, res, next){

	if( DAYTIMES.indexOf(req.params.d_time.toLowerCase()) < 0){
		return res.status(500).end("daytime should among the following values"+DAYTIMES.join(", ")+".");
	}
	else {
		res.locals.daytime = req.params.d_time;
	}

	next();
});

app.use(handler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("HelloWorld started on port "+port);
});


