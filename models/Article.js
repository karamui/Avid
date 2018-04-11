// initializes Node.js package
var mongoose = require("mongoose");

// initializes schema
var Schema = mongoose.Schema;

// creates article schema
var ArticleSchema = new Schema({
    status: {
        type: String,
        required: true,
        default: "unsaved"
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    brief: {
        type: String,
        required: true,
        trim: true
    },
    source: {
        type: String,
        required: true
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// creates article model
var Article = mongoose.model("Article", ArticleSchema);

// exports article model
module.exports = Article;
