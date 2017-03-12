var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

mongoose.connect("mongodb://localhost/restful_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

Blog.create({
	title: "Freedom",
	image: "https://unsplash.com/search/new-port?photo=snRziGMSvcg",
	body: "Peace in the warm embrace of a setting sun",
});

app.get('/' function(req,res){
	res.redirect('/blogs');
});

app.get('/blogs', function(req,res){
	res.render("index");
});

app.listen(3000, function() {
    console.log("listening on 3000");
});
