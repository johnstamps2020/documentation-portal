// JavaScript Document
define(["jquery"], function ($) {
  $(document).ready(function () {
	    var topoffset = 120; 
  $('.wh_topic_toc ul li a').click(function() {
    if (location.pathname.replace(/^\//,'') === 
      this.pathname.replace(/^\//,'') && 
      location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top-topoffset
        }, 500);
        return false;
      } 
    }
  });
    $('li.topic-item a').click(function (e) {
      var id = "#" + $(this).attr('href');
      var top = $(id).position().top;
      $('article+id').animate({
        scrollTop: 420
      }, 800);
    });
	$(window).scroll(function(){
		var scroll = $(window).scrollTop();
		if (scroll >= 0) {
			$("body,#affix2").css("background-color", "rgba(0, 0, 0, 0)");
		}
	});
    $(window).resize(function () {
      if ($(window).width() <= 992) {
        $(".wh_publication_toc li.active").find("span:first").removeClass("border-left");
      }
	  $("body,#affix2").css("background-color", "rgba(0, 0, 0, 0)");
    });
    var headerWidth = $("header").width();
    var documentWidth = $(document).width();

    /* $(".wh_publication_toc li.active").find("span:first").addClass("border-left"); */
    $("#myInput").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#myList li").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
	/* wh_publication_toc */
    $(".collapse-toc-button").css('cursor', 'pointer').click(function () {
      $("#wh_publication_toc").toggle(0, function () {
        $("#wh_topic_body").toggleClass("fixWh_topic_bodyforToggle ");
		$("#wh_topic_body").toggleClass("col-lg-9");/* DOCS-323 */
		$("#wh_topic_body").toggleClass("col-lg-6_5");
		$(".collapse-toc").toggleClass("col-lg-1 fixcollapse-tocforToggle");/* DOCS-323 */
        $(".collapse-toc-button").toggleClass("collapsed");
        $(".collapse-toc-button").attr('title', function (index, attr) {
            return attr=='Show contents' ? 'Hide contents' : 'Show contents';
            });
      });
    });
    $(".openNav").css('cursor', 'pointer').click(function () {
      $("#wh_publication_toc").css({
        "background-color": "#ffffff",
        "width": "auto",
        "z-index": "1"
      });
      $(".wh_publication_toc").css({
        "background-color": "#ffffff",
        "width": "310",
        "z-index": "9"
      });
      $("body,#affix2").css("background-color", "rgba(0, 0, 0, 0.7)");
      $(".wh_search_input").css({
        "margin-left": "0px",
        "position": "relative",
        "top": "0px",
		"right": "0px",
        "z-index": "1"
      });
      /* $("#searchForm").css({"display":"block","border":"solid 1px #979797","width":"241"}); */
    });
    $(".closeNav").css('cursor', 'pointer').click(function () {
      $("#wh_publication_toc").css({
        "background-color": "#ffffff",
        "width": "0",
        "z-index": "9"
      });
      $(".wh_publication_toc").css({
        "background-color": "#ffffff",
        "width": "0",
        "z-index": "9"
      });
	  $("body,#affix2").css("background-color", "rgba(0, 0, 0, 0)");
      /* $("#searchForm").css("display","none"); */
    });

    $(".fa-share-alt").attr({
      "data-url": window.location.href,
      "data-subject": $(document).attr('title'),
      "data-title": $(document).attr('title')
    });
	$('#topic_navigation_links_header a.link').click(function(e) {
		$('a.link').attr("href", function(i, origValue){
			return origValue.split('#')[0]; 
		});
	});
	$('div.wh_publication_toc li span').click(function(e) {
		$('a').attr("href", function(i, origValue){
		return origValue.split('#')[0]; 
		});
	});
	$('.d-print-none').addClass('d-print-inline-block').removeClass('d-print-none');
  });

});
