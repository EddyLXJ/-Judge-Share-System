var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var mongoose = require("mongoose");

mongoose.connect("mongodb+srv://user:user@cluster0-weijt.mongodb.net/test");


app.use("/api/v1", restRouter);

app.listen(3000, function() {
	console.log('App listening on port 3000!')
});
