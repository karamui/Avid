// return to top
$("#returntotop").on("click", function() {
	$("html, body").animate({ scrollTop: 0}, 1500);
});

// return to top hover functionality
$("#returntotop").on({
	"mouseenter": function() {
		$("#rtt").attr("src", "../assets/img/plane-white.png");
	},
	"mouseleave": function() {
		$("#rtt").attr("src", "../assets/img/plane.png");
	}
});

// logo hover functionality
$("#addnyt").on({
	"mouseenter": function() {
		$("#nyt").attr("src", "../assets/img/nyt-logo-white.png");
	},
	"mouseleave": function() {
		$("#nyt").attr("src", "../assets/img/nyt-logo.png");
	}
});

// remove all unsaved articles and reload page
$("#clear").on("click", function() {
	$.ajax({
	    method: "GET",
	    url: "/clear"
	});

	location.reload();
});

// add articles from The New York Times
$("#addnyt").on("click", function() {
	$.ajax({
	    method: "GET",
	    url: "/nyt"
	}).done(function() {
		$("#count").text("You are now completely up-to-date with The New York Times.");
    	$("#added").modal("show");
	});
});

// save an article
$(".savearticle").on("click", function() {
	var id = $(this).attr("data-id");

	$.ajax({
	    method: "POST",
	    url: "/save/" + id
	});
});

// delete an article
$(".deletearticle").on("click", function() {
	var id = $(this).attr("data-id");

	$.ajax({
	    method: "POST",
	    url: "/delete/" + id
	});
});

// reload the page
$("button.reload").on("click", function() {
	location.reload();
});

// show notes
$(".notes").on("click", function() {
	var id = $(this).attr("data-id");

	$.ajax({
	    method: "GET",
	    url: "/notes/" + id
	}).done(function() {
    	$("#notes").modal("show");
    	$("#submit").attr("data-id", id);
	});
});

// submit a note
$("#submit").on("click", function() {
	var id = $(this).attr("data-id");
	console.log(id);

	$.ajax({
	    method: "POST",
	    data: {
		    author: $("#author").val().trim(),
			body: $("#body").val().trim()
		},
	    url: "/notes/" + id
	}).done(function() {
    	$("#notes").modal("show");

    	// empty input fields
    	$("#author").val("");
		$("#body").val("");
	});
});

// delete a note
$(".deletenote").on("click", function() {
	var id = $(this).attr("data-id");

	$.ajax({
	    method: "POST",
	    url: "/delete/notes/" + id
	});
});