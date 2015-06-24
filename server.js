var express = require("express"),
	path = require("path"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "./client/static")));

app.set("views", path.join(__dirname, "./client/views"));
app.set("view engine", "ejs");

// DB
mongoose.connect("mongodb://localhost/message_board");

var MessageSchema = new mongoose.Schema({
	name: String,
	message: String,
	date: {type: Date, default: Date.now}
});

// Validation
MessageSchema.path("name").required(true, "Your name is required");
MessageSchema.path("message").required(true, "Cat got your tongue? A message is required");

var Messages = mongoose.model("Messages", MessageSchema);

// Routes
// Index
app.get("/", function(req, res){
	Messages.find({}, function(err, messages){
		if(err){
			console.log("ERR when retrieving message", err);
		}
		res.render("index", {messages: messages});
	}).sort({date: -1});
});
// Post new message
app.post("/addMessage", function(req, res){
	console.log("POST DATA: ", req.body);
	var message = new Messages({
		name: req.body.name,
		message: req.body.message
	});
	message.save(function(err){
		if(err){
			console.log("ERR while posting new message");
			// res.render("index", {title: "You've got errors!", errors: message.errors});
		} else {
			Messages.find({}, function(err, messages){
				if(err){
					console.log("ERR when retrieving message", err);
				}
				res.redirect("/");
			});
		}
	});
});



// Listen
app.listen(6789, function(){
	console.log("Listening on port 6789");
});