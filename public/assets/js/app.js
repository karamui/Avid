// return to top
$("#returntotop").on("click", function() {
	$("html, body").animate({ scrollTop: 0}, 1500);
});

// return to top hover functionality
$("#returntotop").on({
	"mouseenter": function() {
		$(".nav").attr("src", "../assets/img/plane-white.png");
	},
	"mouseleave": function() {
		$(".nav").attr("src", "../assets/img/plane.png");
	}
});