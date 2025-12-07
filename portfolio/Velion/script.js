// ==========================================
// VELION - BRIGHT & BOLD INTERACTIONS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScroll();
    initAnimations();
    initCounters();
    initCardEffects();
});

// ==========================================
// NAVIGATION
// ==========================================
function initNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Nav scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.getElementById(href.substring(1));
            
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const elements = document.querySelectorAll(
        '.step, .feature-block, .price-card, .stat-item'
    );
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==========================================
// COUNTER ANIMATIONS
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/([\d.]+)([^0-9.]*)/);
    
    if (!match) return;
    
    const target = parseFloat(match[1]);
    const suffix = match[2];
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            const display = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
            element.textContent = display + suffix;
        }
    }, 16);
}

// ==========================================
// FLOATING CARD EFFECTS
// ==========================================
function initCardEffects() {
    if (window.innerWidth < 768) return;
    
    const cards = document.querySelectorAll('.card-float');
    const wrapper = document.querySelector('.visual-wrapper');
    
    if (!wrapper) return;
    
    // Parallax effect
    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        cards.forEach((card, index) => {
            const speed = (index + 1) * 8;
            const moveX = (x - 0.5) * speed;
            const moveY = (y - 0.5) * speed;
            
            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    wrapper.addEventListener('mouseleave', () => {
        cards.forEach(card => {
            card.style.transform = 'translate(0, 0)';
        });
    });
    
    // 3D tilt effect on individual cards
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) - 0.5;
            const y = ((e.clientY - rect.top) / rect.height) - 0.5;
            
            const rotateX = y * 8;
            const rotateY = x * -8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// ==========================================
// ANIMATED PROGRESS BARS
// ==========================================
const bars = document.querySelectorAll('.bar');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const height = bar.style.getPropertyValue('--h');
            bar.style.height = '0';
            setTimeout(() => {
                bar.style.transition = 'height 1s ease';
                bar.style.height = height;
            }, 100);
        }
    });
}, { threshold: 0.5 });

bars.forEach(bar => observer.observe(bar));

// ==========================================
// FORECAST BAR ANIMATION
// ==========================================
const forecastBars = document.querySelectorAll('.forecast-bar');
const forecastObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.parentElement.querySelectorAll('.forecast-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transition = 'width 0.8s ease';
                    bar.style.width = bar.style.getPropertyValue('--w');
                }, index * 100);
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.forecast-chart').forEach(chart => {
    forecastObserver.observe(chart);
});

// ==========================================
// LINE ANIMATION
// ==========================================
const lines = document.querySelectorAll('.line');
lines.forEach(line => {
    const lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                line.style.animation = 'lineGlow 2s ease-in-out infinite';
            }
        });
    }, { threshold: 0.5 });
    
    lineObserver.observe(line);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes lineGlow {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ==========================================
// PREVENT DOUBLE TAP ZOOM (iOS)
// ==========================================
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ==========================================
// PAGE LOAD
// ==========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '1';
    }, 50);
});

console.log('🚀 Velion Finance - Supercharged and ready!');
