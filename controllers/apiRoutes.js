// initializes Node.js packages
var cheerio = require("cheerio");
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");

// initializes MongoDB using Mongo.js
var database = "newsdb";
var collections = ["news", "saved"];
var db = mongojs(database, collections);

// throws an error if the database fails to initialize
db.on("error", function(error) {
    console.log("Database error:", error);
});

// sets up routing
var router = express.Router();

// default route to display all news
router.get("/", function(req, res) {
    request("http://www.chicagotribune.com/news/local/breaking/", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $("section.trb_outfit_group_list_item_body").each(function(i, element) {
            var title = $(element).children("h3.trb_outfit_relatedListTitle").text();
            var url = $(element).children("a.trb_outfit_relatedListTitle_a").attr("href");
            console.log(url);
            var brief = $(element).children("p.trb_outfit_group_list_item_brief").text();
            
            db.news.createIndex({title:1}, {unique: true});
            db.news.insert({"title": title, "url": "http://www.chicagotribune.com/" + url, "brief": brief});
        });
    });

    db.news.find({}, function(error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            res.render("index", { news: data });
        }
    });
});

// clears all news articles
router.get("/clear", function(req, res) {
    db.news.drop();
});

// exports router
module.exports = router;