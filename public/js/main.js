var dappAddress = "n1wocsYdgmUD3bcBbK9EukmdAZ4v9m5kDK5";

$("#load_next").click(function () {
    var voteCount = localStorage.getItem("voteCount");

    if (voteCount == 0) {
        alert("No more polls to load");
        return;
    }

    voteCount -= 1;
    localStorage.setItem("voteCount", voteCount);

    var func = "getPoll"
    var args = "[" + voteCount + "]"

    window.postMessage({
        "target": "contentscript",
        "data": {
            "to": dappAddress,
            "value": "0",
            "contract": {
                "function": func,
                "args": args
            }
        },
        "method": "neb_call"
    }, "*");

})

$("#create_poll").click(function () {
    var func = "createPoll"
    var question = $("#questionInp").val();
    var answ1 = $("#answ1").val();
    var answ2 = $("#answ2").val();

    var args = "[\"" + question + "\",\"" + answ1 + "\",\"" + answ2 + "\"]"

    window.postMessage({
        "target": "contentscript",
        "data": {
            "to": dappAddress,
            "value": "0",
            "contract": {
                "function": func,
                "args": args
            }
        },
        "method": "neb_sendTransaction"
    }, "*");

})

window.postMessage({
    "target": "contentscript",
    "data": {
        "to": dappAddress,
        "value": "0",
        "contract": {
            "function": "getPollCount",
            "args": "[]"
        }
    },
    "method": "neb_call"
}, "*");

function vote(voteId, answerId) {
    var func = "vote"
    var args = "[" + voteId + "," + answerId + "]"

    window.postMessage({
        "target": "contentscript",
        "data": {
            "to": dappAddress,
            "value": "0",
            "contract": {
                "function": func,
                "args": args
            }
        },
        "method": "neb_sendTransaction"
    }, "*");
}

window.addEventListener('message', function (e) {
    if (!!e.data.data.account) {}
    if (!!e.data.data.receipt) {}
    if (!!e.data.data.neb_call) {
        var result = e.data.data.neb_call.result;
        console.log(result);
        if (result >= 0) {
            localStorage.setItem("voteCount", result);
            return;
        }

        var voteCount = localStorage.getItem("voteCount");

        var jsonResult = JSON.parse(result);
        var test = JSON.parse(jsonResult);
        var question = test.question;
        var answer1 = test.one.answer;
        var votes1 = test.one.votes;
        var answer2 = test.two.answer;
        var votes2 = test.two.votes;

        var voteBox = document.getElementById("votes");
        var div1 = document.createElement("div");
        div1.className = "col-xs-12 col-sm-6 col-md-4";
        var div2 = document.createElement("div");
        div2.className = "box";
        div2.id = voteCount;
        var questH3 = document.createElement("h3");
        questH3.innerHTML = question;
        var answer1Text = document.createElement("a");
        answer1Text.innerHTML = answer1 + ": " + votes1 + "<br><br>";
        answer1Text.setAttribute("onClick", "javascript: vote(" + voteCount + ", 1);")

        var answer2Text = document.createElement("a");
        answer2Text.innerHTML = answer2 + ": " + votes2;
        answer2Text.setAttribute("onClick", "javascript: vote(" + voteCount + ", 2);")

        div2.appendChild(questH3);
        div2.appendChild(answer1Text);
        div2.appendChild(answer2Text);
        div1.appendChild(div2);
        voteBox.appendChild(div1);
    }
});

(function ($) {

    "use strict";
    $(".carousel-inner .item:first-child").addClass("active");
    /* Mobile menu click then remove
    ==========================*/
    $(".mainmenu-area #mainmenu li a").on("click", function () {
        $(".navbar-collapse").removeClass("in");
    });
    /*WoW js Active
    =================*/
    new WOW().init({
        mobile: true,
    });
    /* Scroll to top
    ===================*/
    $.scrollUp({
        scrollText: '<i class="fa fa-angle-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });

    /*--------------------
       MAGNIFIC POPUP JS
       ----------------------*/
    var magnifPopup = function () {
        $('.work-popup').magnificPopup({
            type: 'image',
            removalDelay: 300,
            mainClass: 'mfp-with-zoom',
            gallery: {
                enabled: true
            },
            zoom: {
                enabled: true, // By default it's false, so don't forget to enable it

                duration: 300, // duration of the effect, in milliseconds
                easing: 'ease-in-out', // CSS transition easing function

                // The "opener" function should return the element from which popup will be zoomed in
                // and to which popup will be scaled down
                // By defailt it looks for an image tag:
                opener: function (openerElement) {
                    // openerElement is the element on which popup was initialized, in this case its <a> tag
                    // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                    return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
            }
        });
    };
    // Call the functions 
    magnifPopup();

    //Background Parallax
    $('.header-area').parallax("50%", -0.4);
    $('.price-area').parallax("50%", -0.5);
    $('.testimonial-area').parallax("10%", -0.2);


    $('#accordion .panel-title a').prepend('<span></span>');






    //Function to animate slider captions 
    function doAnimations(elems) {
        //Cache the animationend event in a variable
        var animEndEv = 'webkitAnimationEnd animationend';

        elems.each(function () {
            var $this = $(this),
                $animationType = $this.data('animation');
            $this.addClass($animationType).one(animEndEv, function () {
                $this.removeClass($animationType);
            });
        });
    }

    //Variables on page load 
    var $myCarousel = $('.caption-slider'),
        $firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");

    //Initialize carousel 
    $myCarousel.carousel();

    //Animate captions in first slide on page load 
    doAnimations($firstAnimatingElems);

    //Pause carousel  
    $myCarousel.carousel('pause');


    //Other slides to be animated on carousel slide event 
    $myCarousel.on('slide.bs.carousel', function (e) {
        var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
        doAnimations($animatingElems);
    });





    // Select all links with hashes
    $('.mainmenu-area a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });






    /* Preloader Js
    ===================*/
    $(window).on("load", function () {
        $('.preloader').fadeOut(500);
    });
})(jQuery);
