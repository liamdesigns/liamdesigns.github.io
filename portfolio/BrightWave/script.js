document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");
    const backToTop = document.getElementById("backToTop");
    const footerYearSpan = document.getElementById("footerYear");

    /* Footer year */
    if (footerYearSpan) {
        footerYearSpan.textContent = new Date().getFullYear();
    }

    /* Mobile nav toggle */
    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            mainNav.classList.toggle("nav-open");
        });

        mainNav.addEventListener("click", function (event) {
            if (event.target.classList.contains("nav-link")) {
                mainNav.classList.remove("nav-open");
            }
        });
    }

    /* Smooth scroll for internal links */
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") {
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    /* Back to top visibility */
    function updateBackToTop() {
        if (!backToTop) return;
        if (window.scrollY > 450) {
            backToTop.style.display = "flex";
        } else {
            backToTop.style.display = "none";
        }
    }

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        updateBackToTop();
        window.addEventListener("scroll", updateBackToTop);
    }
});
