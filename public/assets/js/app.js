$(document).on("ready", function() {

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

	// reload the page
	$(document).on("click", ".reload", function() {
		location.reload();
	});

	// logo hover functionality for The New York Times 
	$("#addnyt").on({
		"mouseenter": function() {
			$("#nyt").attr("src", "../assets/img/nyt-logo-white.png");
		},
		"mouseleave": function() {
			$("#nyt").attr("src", "../assets/img/nyt-logo.png");
		}
	});

	// logo hover functionality for Chicago Tribune 
	$("#addct").on({
		"mouseenter": function() {
			$("#ct").attr("src", "../assets/img/ct-logo-white.png");
		},
		"mouseleave": function() {
			$("#ct").attr("src", "../assets/img/ct-logo.png");
		}
	});

	// logo hover functionality for The Wall Street Journal
	$("#addwsj").on({
		"mouseenter": function() {
			$("#wsj").attr("src", "../assets/img/wsj-logo-white.png");
		},
		"mouseleave": function() {
			$("#wsj").attr("src", "../assets/img/wsj-logo.png");
		}
	});

	// logo hover functionality for The Washington Post
	$("#addwp").on({
		"mouseenter": function() {
			$("#wp").attr("src", "../assets/img/wp-logo-white.png");
		},
		"mouseleave": function() {
			$("#wp").attr("src", "../assets/img/wp-logo.png");
		}
	});

	// logo hover functionality for Boston Globe
	$("#addbg").on({
		"mouseenter": function() {
			$("#bg").attr("src", "../assets/img/bg-logo-white.png");
		},
		"mouseleave": function() {
			$("#bg").attr("src", "../assets/img/bg-logo.png");
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

	// add articles from The New York Times and display updated message
	$("#addnyt").on("click", function() {
		$.ajax({
		    method: "GET",
		    url: "/nyt"
		});

		$("#count").html("You are now completely up-to-date with <i>The New York Times</i>.");
    	$("#added").modal("show");
	});

	// add articles from Chicago Tribune and display updated message
	$("#addct").on("click", function() {
		$.ajax({
		    method: "GET",
		    url: "/ct"
		});

		$("#count").html("You are now completely up-to-date with <i>Chicago Tribune</i>.");
    	$("#added").modal("show");
	});

	// add articles from The Wall Street Journal and display updated message
	$("#addwsj").on("click", function() {
		$.ajax({
		    method: "GET",
		    url: "/wsj"
		});

		$("#count").html("You are now completely up-to-date with <i>The Wall Street Journal</i>.");
    	$("#added").modal("show");
	});

	// add articles from The Washington Post and display updated message
	$("#addwp").on("click", function() {
		$.ajax({
		    method: "GET",
		    url: "/wp"
		});

		$("#count").html("You are now completely up-to-date with <i>The Washington Post</i>.");
    	$("#added").modal("show");
	});

	// add articles from Boston Globe and display updated message
	$("#addbg").on("click", function() {
		$.ajax({
		    method: "GET",
		    url: "/bg"
		});

		$("#count").html("You are now completely up-to-date with <i>Boston Globe</i>.");
    	$("#added").modal("show");
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

	// show all notes for an article
	$(".notes").on("click", function() {
		var id = $(this).attr("data-id");

		$.ajax({
		    method: "GET",
		    url: "/notes/" + id
		}).done(function(result) {

			// if notes exist...
			if (result.notes.length > 0) {
				$("#notecollection").empty();

				// displays all notes for the returned article
				for (var i = 0; i < result.notes.length; i++) {
					// creates elements for each note
					var div = $("<div class='article'>");
					var h2 = $("<h2 class='heading'>");
					var p = $("<p>");
					var button = $("<button class='standard delete deletenote reload'>Delete</button>");

					// update contents of note
					h2.text("Written by " + result.notes[i].author);
					p.text(result.notes[i].body);
					button.attr("data-id", result.notes[i]._id);

					// render notes
					div.append(h2).append(p).append(button);
					$("#notecollection").append(div);
				}
			}

			// displays modal and apply article id to note submission button
	    	$("#notes").modal("show");
	    	$("#submit").attr("data-id", id);
		});
	});

	// submit a new note
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
	$("#notecollection").on("click", ".deletenote", function() {
		var id = $(this).attr("data-id");

		$.ajax({
		    method: "POST",
		    url: "/delete/notes/" + id
		});
	});

}); // document ready