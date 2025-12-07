document.addEventListener("DOMContentLoaded", function () {
    /* Scroll reveal using IntersectionObserver */

    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    function revealFallback() {
        animatedElements.forEach(function (el) {
            el.classList.add("in-view");
        });
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18 }
        );

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealFallback();
    }

    /* Stat counter animation */

    const statNumbers = document.querySelectorAll(".stat-number");
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(function (stat) {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            if (isNaN(target)) {
                return;
            }

            const duration = 1600;
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(progress * target);
                stat.textContent = value.toString();
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    stat.textContent = target.toString();
                }
            }

            requestAnimationFrame(step);
        });
    }

    if ("IntersectionObserver" in window) {
        const statsContainer = document.querySelector(".hero-stats");
        if (statsContainer) {
            const statsObserver = new IntersectionObserver(
                function (entries, obs) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateStats();
                            obs.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.3 }
            );
            statsObserver.observe(statsContainer);
        } else {
            animateStats();
        }
    } else {
        animateStats();
    }

    /* Pulse glow for key CTAs */

    const emergencyStrip = document.querySelector(".emergency-strip");
    const heroCallBtn = document.querySelector(".hero-call-btn");

    function addPulse(element) {
        if (!element) return;
        element.classList.add("pulse-glow");
    }

    if ("IntersectionObserver" in window && emergencyStrip) {
        const pulseObserver = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        addPulse(emergencyStrip.querySelector(".emergency-cta"));
                        addPulse(heroCallBtn);
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        pulseObserver.observe(emergencyStrip);
    } else {
        addPulse(heroCallBtn);
        if (emergencyStrip) {
            addPulse(emergencyStrip.querySelector(".emergency-cta"));
        }
    }
});
