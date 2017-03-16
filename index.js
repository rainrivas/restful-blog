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

app.get('/', function(req, res) {
    res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("error: " + err);
        } else {
            res.render("index", { blogs: blogs });
        }
    })
});

// NEW ROUTE
app.get('/blogs/new', function(req, res) {
    res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req, res) {
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            // console.log("error: " + err);
            res.render("new"); // go back to new form if we make a mistake
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

app.listen(3000, function() {
    console.log("listening on 3000");
});
