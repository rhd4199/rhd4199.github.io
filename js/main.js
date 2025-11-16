/* =========================================
   MAIN JS — CINEMATIC FULL BLACK WEBSITE
   ========================================= */

/* ------------------------------
   TYPING EFFECT (Hero Subtitle)
-------------------------------- */
const typingText = document.querySelector('.typing-text');

if (typingText) {
    const words = [
        "Wedding & Engagement Photographer",
        "Cinematic — Editorial — Romantic",
        "Timeless stories in every frame"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        let currentWord = words[wordIndex];
        let displayedText = currentWord.substring(0, charIndex);

        typingText.textContent = displayedText;

        if (!isDeleting) {
            // typing forward
            if (charIndex < currentWord.length) {
                charIndex++;
                setTimeout(typeEffect, 80);
            } else {
                setTimeout(() => isDeleting = true, 1500);
                setTimeout(typeEffect, 80);
            }
        } else {
            // deleting
            if (charIndex > 0) {
                charIndex--;
                setTimeout(typeEffect, 60);
            } else {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 300);
            }
        }
    }

    typeEffect();
}

/* --------------------------------------
   REVEAL ON SCROLL (Fade / Slide / Zoom)
--------------------------------------- */
function revealOnScroll() {
    const reveals = document.querySelectorAll(
        '.reveal, .fade-in, .fade-up, .slide-left, .slide-right, .fade-zoom'
    );

    let windowHeight = window.innerHeight;

    reveals.forEach((el) => {
        let elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ------------------------------
   PARALLAX QUOTE SCROLL EFFECT
-------------------------------- */
const quote = document.querySelector('.quote-text');
if (quote) {
    window.addEventListener('scroll', () => {
        const speed = quote.dataset.speed || 0.3;
        quote.style.transform = `translateY(${window.scrollY * speed}px)`;
    });
}

/* ------------------------------
   NAVBAR SHADOW SCROLL EFFECT
-------------------------------- */
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }
    });
}

/* ------------------------------------------
   PAGE TRANSITION (Fade-in when load)
------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-transition");
    setTimeout(() => {
        document.body.classList.add("show");
    }, 100);
});

/* ------------------------------------------
   CINEMATIC DELAY VIA data-delay="0.3s"
------------------------------------------- */
document.querySelectorAll("[data-delay]").forEach((el) => {
    let delayValue = el.getAttribute("data-delay");
    el.style.setProperty("--delay", delayValue);
});

/* ------------------------------------------
   SMOOTH SCROLL FOR INTERNAL LINKS
------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        if (this.getAttribute("href") !== "#") {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});
