var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    express = require("express"),
    app = express();
    
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful Route
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//New Route
app.get("/blogs/new",function(req, res){
    res.render("new");
});
//index Route
app.get("/blogs", function(req,res){
    Blog.find({}, function(error, blogs){
        if(error){
            console.log("ERROR");
        } else{
            res.render("index", {blogs:blogs});
        }
    });
});
//Create Route
app.post("/blogs", function(req, res){
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    Blog.create(req.body.blog, function(error, newBlog){
        if(error){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});
//Show Route
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(error, foundBlog){
        if (error){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});
//Edit Route
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(error, foundBlog){
        if(error){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});
//Update Route
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, uppdatedBlog){
        if (error){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(error){
        if (error){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The web server started!");
});