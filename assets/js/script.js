/*=========================================================
REZA HARJADINATA — PORTFOLIO
=========================================================*/

$(function () {
    "use strict";

    /*==================== Loader ====================*/
    setTimeout(function () {
        $("#loader").fadeOut(700);
    }, 1000);

    /*==================== Navbar Scroll ====================*/
    $(window).on("scroll", function () {
        $(".navbar").toggleClass("scrolled", $(this).scrollTop() > 80);
    });

    /*==================== Smooth Scroll ====================*/
    $('a[href^="#"]').on("click", function (e) {
        // Ignore bare "#" links (brand, social icons, placeholders)
        if (this.hash === "" || this.hash === "#") return;

        const target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $("html, body").animate({
                scrollTop: target.offset().top - 80
            }, 700);
        }
    });

    /*==================== Counters (animate when in view) ====================*/
    function runCounter($el) {
        const target = parseInt($el.attr("data-target"), 10) || 0;
        const speed = target / 100;
        let count = 0;

        const interval = setInterval(function () {
            count += speed;
            if (count >= target) {
                count = target;
                clearInterval(interval);
            }
            $el.text(Math.floor(count));
        }, 20);
    }

    const counters = document.querySelectorAll(".counter");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCounter($(entry.target));
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: run immediately
        counters.forEach(function (el) {
            runCounter($(el));
        });
    }

    /*==================== AOS ====================*/
    AOS.init({
        duration: 1200,
        once: true,
        offset: 100
    });

    /*==================== Swiper ====================*/
    new Swiper(".testimonial-slider", {
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        }
    });

    /*==================== Cursor Glow ====================*/
    const glow = document.createElement("div");
    glow.className = "mouse-glow";
    document.body.appendChild(glow);

    document.addEventListener("mousemove", function (e) {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });

    /*==================== Back to Top ====================*/
    const topBtn = document.getElementById("topButton");

    if (topBtn) {
        window.addEventListener("scroll", function () {
            topBtn.classList.toggle("show", window.scrollY > 400);
        });

        topBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});
