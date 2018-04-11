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


// pulls news from The Chicago Tribune
router.get("/ct", function(req, res) {
    var count = 0;
    var result = [];

    db.Article.find({})
    .then(function(data) {
        result = data;
    });

    request("http://www.chicagotribune.com/news/local/breaking/", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $("section.trb_outfit_group_list_item_body").each(function(i, element) {
            var flag = false;
            var title = $(element).children("h3.trb_outfit_relatedListTitle").text();
            var url = $(element).children("h3.trb_outfit_relatedListTitle").children("a").attr("href");
            var brief = $(element).children("p.trb_outfit_group_list_item_brief").text();
            
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
                    url: "http://www.chicagotribune.com" + url,
                    brief: brief,
                    source: "Chicago Tribune"
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

// pulls news from The Wall Street Journal
router.get("/wsj", function(req, res) {
    var count = 0;
    var result = [];

    db.Article.find({})
    .then(function(data) {
        result = data;
    });

    request("https://www.wsj.com/", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $("div.wsj-card").each(function(i, element) {
            var flag = false;
            var title = $(element).children("h3.wsj-headline").text();
            var url = $(element).children("h3.wsj-headline").children("a.wsj-headline-link").attr("href");
            var brief = $(element).children("div.wsj-card-body").children("p.wsj-summary").text();
            
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
                    source: "The Wall Street Journal"
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

// pulls news from The Washington Post
router.get("/wp", function(req, res) {
    var count = 0;
    var result = [];

    db.Article.find({})
    .then(function(data) {
        result = data;
    });

    request("https://www.washingtonpost.com/", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $("div.flex-item").each(function(i, element) {
            var flag = false;
            var title = $(element).children("div.headline").children("a").text();
            var url = $(element).children("div.headline").children("a").attr("href");
            var brief = $(element).children("div.blurb").text();
            
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
                    source: "The Washington Post"
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

// pulls news from Boston Globe
router.get("/bg", function(req, res) {
    var count = 0;
    var result = [];

    db.Article.find({})
    .then(function(data) {
        result = data;
    });

    request("https://www.bostonglobe.com/", function(error, response, html) {

        if (error) {
            console.log(error);
        }

        var $ = cheerio.load(html);

        $("div.story").each(function(i, element) {
            var flag = false;
            var title = $(element).children("h2.story-title").text();
            var url = $(element).children("h2.story-title").children("a.story-perm").attr("href");
            var brief = $(element).children("div.excerpt").children("p").text();
            
            // checking to ensure url will be correctly formatted and excluding noncompliant urls
            if (url != undefined) {
                var urlsplit = url.substring(0,4);

                if (urlsplit == "http") {
                    flag = true;
                }
            }
        
            for (var i = 0; i < result.length; i++) {
                if (result[i].title == title) {
                    flag = true;
                }
            }

            if (title != "" && title != null && flag == false && url != undefined) {
                count++;

                var data = {
                    status: "unsaved",
                    title: title,
                    url: "https://www.bostonglobe.com" + url,
                    brief: brief,
                    source: "Boston Globe"
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

// pulls all notes for an article
router.get("/notes/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function(data) {
        console.log(data);
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
        console.log(dbNote);
        console.log("Note added!");
        return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: dbNote._id}}, {new: true})
    })
    .then(function(dbArticle) {
        console.log(dbArticle);
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