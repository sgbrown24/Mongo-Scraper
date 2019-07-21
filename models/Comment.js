// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the comment schema
var commentSchema = new Schema({
    body: {
        type: String
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
});

// Create the comment model with the commentSchema
var comment = mongoose.model("comment", commentSchema);

// Export the comment model
module.exports = comment;
