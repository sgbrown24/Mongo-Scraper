
// Require mongoose
var mongoose = require("mongoose");


// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new schema object
var Articleschema = new Schema({
  // `string` is a required field, and a custom error message is thrown if it is not supplied
  title: {
    type: String,
    required: true,
    required: "String is Required"
  },
  
  // `number` is required. The default mongoose error message is thrown if it is not supplied
  url: {
    type: String,
    required: true
  },
summary:{
  type: String,
},
  comment: [{
    type: schema.Types.objectId,
ref: "comment"  }],
  
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", Articleschema);

// Export the nycArticle model
module.exports = Article;
