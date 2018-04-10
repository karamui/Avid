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

// return to top hover functionality
$("#addnyt").on({
	"mouseenter": function() {
		$("#nyt").attr("src", "../assets/img/nyt-logo-white.png");
	},
	"mouseleave": function() {
		$("#nyt").attr("src", "../assets/img/nyt-logo.png");
	}
});