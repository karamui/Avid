// initializes Node.js packages
var cheerio = require("cheerio");
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var request = require("request");

// initializes counter
var count = 0;

// requires article model
var db = require("../models");

// connects MongoDB to Mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// sets up routing
var router = express.Router();

// default route to display all news
/*router.get("/news", function(req, res) {
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
});*/

// default route to display all news
router.get("/", function(req, res) {
    db.Article.find({ status: "unsaved" })
    .populate("notes")
    .then(function(data) {
        // flipping data array to show recently-added news first
        var flop = [];

        for (var i = 0; i < data.length; i++) {
            flop[i] = data[data.length - 1 - i];
        }

        res.render("index", { news: flop });
    })
    .catch(function(err) {
        return res.json(err);
    });
});

// default route to display saved articles
router.get("/saved", function(req, res) {
    db.Article.find({ status: "saved" })
    .populate("notes")
    .then(function(data) {
        res.render("index", { news: data });
    })
    .catch(function(err) {
        return res.json(err);
    });
});

// pulls news from The New York Times
router.get("/nyt", function(req, res) {
    var count = 0;
    var result = [];

    db.Article.find({})
    .then(function(data) {
        result = data;
    });

    request("https://www.nytimes.com/", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $("article.story.theme-summary").each(function(i, element) {
            var flag = false;
            var title = $(element).children("h2.story-heading").text().trim();
            var url = $(element).children("h2.story-heading").children("a").attr("href");
            var brief = $(element).children("p.summary").text().trim();
            
            for (var i = 0; i < result.length; i++) {
                if (result[i].title == title) {
                    flag = true;
                }
            }

            if (title != "" && title != null && flag == false) {
                count++;

                var data = {
                    status: "unsaved",
                    title: title,
                    url: url,
                    brief: brief,
                    source: "The New York Times"
                };

                db.Article.create(data)
                .then(function(database) {
                    console.log(database);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            }
        });
        console.log(count + " articles have been added.");
    });
});

// clears all unsaved news articles
router.get("/clear", function(req, res) {
    db.Article.remove({ status: "unsaved" }, function(error) {
        console.log("All articles have been removed.");
    });
});

// saves one article
router.post("/save/:id", function(req, res) {
    db.Article.findOneAndUpdate({_id: req.params.id}, {status: "saved"}, function(error) {
        console.log("Article has been saved.");
    });
});

// removes one article
router.post("/delete/:id", function(req, res) {
    db.Article.remove({_id: req.params.id}, function(error) {
        console.log("Article has been removed.");
    });
});

// pulls notes for an article
router.get("/notes/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function(data) {
        // console.log(data);
        res.json(data);
    })
    .catch(function(err) {
        return res.json(err);
    });
});

// posts a note
router.post("/notes/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        // console.log(dbNote);
        console.log("Note added!");
        return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: dbNote._id}}, {new: true})
    })
    .then(function(dbArticle) {
        // console.log(dbArticle);
        res.json(dbArticle);
    })
    .catch(function(err) {
        return res.json(err);
    });
});

// removes one note
router.post("/delete/notes/:id", function(req, res) {
    db.Note.remove({_id: req.params.id}, function(error) {
        console.log("Note has been removed.");
    });
});

// exports router
module.exports = router;