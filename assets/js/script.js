/*=========================================================
REZA HARJADINATA — PORTFOLIO
=========================================================*/

$(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*==================== Loader ====================*/
    setTimeout(function () {
        $("#loader").fadeOut(600);
    }, 900);

    /*==================== Theme toggle ====================*/
    const root = document.documentElement;
    const themeBtn = document.getElementById("themeToggle");

    function applyThemeIcon(theme) {
        if (!themeBtn) return;
        themeBtn.innerHTML = theme === "dark"
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    }

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        try { localStorage.setItem("theme", theme); } catch (e) { }
        applyThemeIcon(theme);
    }

    function toggleTheme() {
        setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    }

    applyThemeIcon(root.getAttribute("data-theme") || "light");

    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }

    // Fun: press "t" to toggle theme (ignores typing in inputs)
    document.addEventListener("keydown", function (e) {
        const tag = (e.target.tagName || "").toLowerCase();
        if (e.key.toLowerCase() === "t" && tag !== "input" && tag !== "textarea") {
            toggleTheme();
        }
    });

    /*==================== Scroll progress bar ====================*/
    const progress = document.getElementById("scrollProgress");

    /*==================== Navbar + scrollspy + progress ====================*/
    const sections = $("section[id]");
    const navLinks = $(".nav-link");

    function onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // progress
        if (progress) {
            progress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + "%";
        }

        // navbar background
        $(".navbar").toggleClass("scrolled", scrollTop > 60);

        // back-to-top
        if (topBtn) topBtn.classList.toggle("show", scrollTop > 400);

        // scrollspy
        let current = "";
        sections.each(function () {
            if (scrollTop >= this.offsetTop - 120) current = this.id;
        });
        navLinks.each(function () {
            $(this).toggleClass("active", $(this).attr("href") === "#" + current);
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    /*==================== Smooth scroll ====================*/
    $('a[href^="#"]').on("click", function (e) {
        if (this.hash === "" || this.hash === "#") return;

        const target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: target.offset().top - 80 }, 700);
        }
    });

    /*==================== Typed hero role ====================*/
    const roles = ["Full Stack Developer", "AI Engineer", "Founder", "Software Consultant"];
    const typingEl = document.getElementById("typing");
    let roleIndex = 0;
    let charIndex = 0;

    function typeLoop() {
        if (!typingEl) return;
        const word = roles[roleIndex];

        typingEl.textContent = word.substring(0, charIndex);
        charIndex++;

        if (charIndex <= word.length) {
            setTimeout(typeLoop, 80);
        } else {
            setTimeout(eraseLoop, 1600);
        }
    }

    function eraseLoop() {
        if (!typingEl) return;
        const word = roles[roleIndex];

        typingEl.textContent = word.substring(0, charIndex);
        charIndex--;

        if (charIndex >= 0) {
            setTimeout(eraseLoop, 40);
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            charIndex = 0;
            setTimeout(typeLoop, 350);
        }
    }

    if (typingEl) {
        if (reduceMotion) {
            typingEl.textContent = roles[0];
        } else {
            typeLoop();
        }
    }

    /*==================== Counters (animate on view) ====================*/
    function runCounter(el) {
        const $el = $(el);
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
        const io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { io.observe(el); });
    } else {
        counters.forEach(runCounter);
    }

    /*==================== Copy to clipboard ====================*/
    $(".copy-btn").on("click", function () {
        const btn = this;
        const text = btn.getAttribute("data-copy");
        const done = function () {
            btn.classList.add("copied");
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
            setTimeout(function () {
                btn.classList.remove("copied");
                btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
            }, 1800);
        };

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
            done();
        }
    });

    /*==================== Card tilt ====================*/
    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
        document.querySelectorAll("[data-tilt]").forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform =
                    "perspective(900px) rotateY(" + (x * 6) + "deg) rotateX(" + (-y * 6) + "deg)";
            });
            card.addEventListener("mouseleave", function () {
                card.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
            });
        });
    }

    /*==================== Cursor glow ====================*/
    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
        const glow = document.createElement("div");
        glow.className = "mouse-glow";
        document.body.appendChild(glow);
        document.addEventListener("mousemove", function (e) {
            glow.style.left = e.clientX + "px";
            glow.style.top = e.clientY + "px";
        });
    }

    /*==================== AOS ====================*/
    AOS.init({ duration: 900, once: true, offset: 80 });

    /*==================== Swiper ====================*/
    new Swiper(".testimonial-slider", {
        loop: true,
        speed: 900,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 24 }
        }
    });

    /*==================== Back to top ====================*/
    var topBtn = document.getElementById("topButton");
    if (topBtn) {
        topBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // run once on load to set initial state
    onScroll();
});

/*==================== Dev easter egg ====================*/
console.log(
    "%c👋 Hey there, fellow developer!",
    "font-size:16px;font-weight:bold;color:#6366f1"
);
console.log(
    "%cLike what you see? Let's build something → hello@rezaharjadinata.com  (psst: press \"t\" to switch theme)",
    "font-size:12px;color:#06b6d4"
);
