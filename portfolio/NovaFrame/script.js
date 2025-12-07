// ========================================
// NOVAFRAME - OPTIMIZED INTERACTIVE BEHAVIORS
// Performance-first, no heavy canvas operations
// ========================================

// ========================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// HEADER SCROLL EFFECTS
// ========================================

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}, { passive: true });

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-right');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});

// ========================================
// MOBILE NAVIGATION TOGGLE
// ========================================

const mobileToggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav');

if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = mobileToggle.querySelectorAll('span');
        if (mobileToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile nav when clicking a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
            
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ========================================
// DYNAMIC STATS COUNTER (OPTIMIZED)
// ========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function animatePercentage(element, target) {
    let current = 0;
    const increment = target / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '%';
            clearInterval(timer);
        } else {
            element.textContent = current.toFixed(2) + '%';
        }
    }, 16);
}

function animateMs(element, target) {
    let current = 0;
    const increment = target / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target) + 'ms';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + 'ms';
        }
    }, 16);
}

// Trigger counter animation when stat items are visible
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const valueElement = entry.target.querySelector('.stat-value');
            if (valueElement && !valueElement.classList.contains('animated')) {
                valueElement.classList.add('animated');
                
                // Extract number from text
                const text = valueElement.textContent;
                let targetValue = 0;
                
                if (text.includes('%')) {
                    targetValue = parseFloat(text);
                    valueElement.textContent = '0%';
                    animatePercentage(valueElement, targetValue);
                } else if (text.includes('ms')) {
                    targetValue = parseFloat(text);
                    valueElement.textContent = '0ms';
                    animateMs(valueElement, targetValue);
                } else if (text.includes('K')) {
                    targetValue = parseFloat(text) * 1000;
                    animateCounter(valueElement, targetValue);
                }
            }
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => statObserver.observe(item));
});

// ========================================
// PRICING CARD INTERACTIONS (OPTIMIZED)
// ========================================

const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// FEATURE CARD HOVER EFFECTS (SIMPLIFIED)
// ========================================

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    let timeout;
    
    card.addEventListener('mouseenter', function() {
        clearTimeout(timeout);
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        const self = this;
        timeout = setTimeout(() => {
            self.style.transform = 'translateY(0)';
        }, 50);
    });
});

// ========================================
// TESTIMONIAL CARD INTERACTIONS
// ========================================

const testimonialCards = document.querySelectorAll('.testimonial-card');

testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const tri = this.querySelector('.testimonial-tri');
        if (tri) {
            tri.style.transform = 'rotate(15deg) scale(1.2)';
            tri.style.opacity = '0.6';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const tri = this.querySelector('.testimonial-tri');
        if (tri) {
            tri.style.transform = 'rotate(0deg) scale(1)';
            tri.style.opacity = '0.3';
        }
    });
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// SECTION PROGRESS INDICATOR
// ========================================

function updateProgressIndicator() {
    const sections = document.querySelectorAll('.tri-section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            section.classList.add('in-view');
        } else {
            section.classList.remove('in-view');
        }
    });
}

// Use throttle for scroll events
window.addEventListener('scroll', throttle(updateProgressIndicator, 100), { passive: true });

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // Only if not typing in an input
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    
    // Press 'H' to go to hero section
    if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'P' to go to pricing
    if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
});

// ========================================
// INITIALIZE ALL FEATURES
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔺 NovaFrame initialized - Performance optimized');
    
    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Initialize section progress
    updateProgressIndicator();
});

// ========================================
// REDUCE MOTION SUPPORT
// ========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable all animations for users who prefer reduced motion
    document.querySelectorAll('.fade-in-up, .fade-in-right').forEach(el => {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}
