// initializes Node.js package
var mongoose = require("mongoose");

// initializes schema
var Schema = mongoose.Schema;

// creates notes schema
var NoteSchema = new Schema({
	author: {
	  	type: String,
	  	required: false,
	  	default: "anonymous"
	},
	body: {
	  	type: String,
	  	required: true
	}
});

// creates note model
var Note = mongoose.model("Note", NoteSchema);

// exports note model
module.exports = Note;
