var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
/// Requiring models
var comment= require("./models/comment.js");
var Article = require("./models/Article.js");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongo-scraper", { useNewUrlParser: true });

var db =  mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected  to Mongoose!!");
});

app.get("/scrape", function(req,res){
  axios.get("https://www.nytimes.com/")
  .then(function(response){
    var $ = cheerio.load(response.data);
    console.log("scraping article")
var articles = []
    $(".assetWrapper").each(function(i, element){
  var title = $(this).find("h2").text()
var summary = $(this).find("p").text();
var url = $(this).find("a").attr("href")
var article = {
  headline: title, 
  summary: summary,
  url: url,
}
articles.push(article)
})
console.log(articles)
for(var i = 0; i< articles.length; i++){

}

var entry = new Article(articles);

entry.save(function(err, doc) {

  if (err) {
    console.log(err);
  }
  else {
    console.log(doc);
  }
});
// closing entry.save

});
//closing div.listEntry


});
// closing request

// res.redirect("/");


// closing app.get

//Get Articles from DB
app.get("/stories", function(req, res) {
// Grab every doc in the Articles array
Article.find({}, function(error, doc) {
// Log any errors
if (error) {
console.log(error);
}
// Or send the doc to the browser as a json object
else {
res.json(doc);
}
});
});

// Grab an article by it's ObjectId
app.get("/stories/:id", function(req, res) {
// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
Article.findOne({ "_id": req.params.id })
// ..and populate all of the comments associated with it
.populate("comment")
// now, execute our query
.exec(function(error, doc) {
// Log any errors
if (error) {
console.log(error);
}
// Otherwise, send the doc to the browser as a json object
else {
res.json(doc);
}
});
});


app.get("/saved", function(req,res){

Article.find({saved:true}, function(error, doc) {
// Log any errors
if (error) {
console.log(error);
}
// Or send the doc to the browser as a json object
else {
res.render("saved",{Article: doc});
}
});

});

// Change from false to true
app.post("/updates/:id", function(req,res){

Article.where({ _id: req.params.id }).update({ $set:{saved: true }})

.exec(function(error, doc) {
// Log any errors
if (error) {
console.log(error);
}
// Otherwise, send the doc to the browser as a json object
else {

res.json(doc)
}
});

});

// Change from true to false
app.post("/updates/:id/:saved", function(req,res){

Article.where({_id: req.params.id, saved:true }).update({ $set:{saved: false }})

.exec(function(error, doc) {
// Log any errors
if (error) {
console.log(error);
}
// Otherwise, send the doc to the browser as a json object
else {

res.json(doc)
}
});

});

// Post comments
app.post("/comments/:id", function(req, res) {
// Create a new commentand pass the req.body to the entry
var newComment= new comment(req.body);
console.log(newComment);

// And save the new commentthe db
newComment.save(function(error, doc) {
// Log any errors
if (error) {
console.log(error);
}
// Otherwise
else {
// Use the article id to find and update it's comment
Article.findOneAndUpdate({ "_id": req.params.id },{ "comment": doc._id })
// Execute the above query
.exec(function(err, doc) {
// Log any errors
if (err) {
console.log(err);
}
else {
// Or send the document to the browser
res.send(doc);
}
});
}
});
});

// Grab an article by it's ObjectId
app.get("/comments/:id", function(req, res) {
// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
Article.findOne({ "_id": req.params.id })
// ..and populate all of the comments associated with it
.populate("comment")
// now, execute our query
.exec(function(error, doc) {
// Log any errors
if (error) {
console.log(error);
}
// Otherwise, send the doc to the browser as a json object
else {
res.json(doc);
}
});
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
