var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer'),
    methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/restful_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); // has to go after the body parser
app.use(methodOverride("_method")); // tell the app to override the method with desired params (we're using for PUT/DELETE)

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
    Blog.find({}).sort({ "created": -1 }).exec(function(err, blogs) {
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
    req.body.blog.body = req.sanitize(req.body.blog.body); // sanitize the input so we remove harmful html such as script tags
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

// EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

// UPDATE ROUTE
app.put('/blogs/:id', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body); // eventually change the sanitizer to be called via middleware
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            console.log('error: ' + err);
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log('error: ' + err);
            res.redirect("/blogs"); // eventaully we can add an error route/view
        } else {
            res.redirect("/blogs");
        }
    })
});

app.listen(3000, function() {
    console.log("listening on 3000");
});
