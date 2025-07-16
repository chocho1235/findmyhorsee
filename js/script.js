/*
 * FindMyHorse - Modern JavaScript File
 * Enhanced animations, scroll effects, and user interactions
 */

// =============================================
// GLOBAL VARIABLES & CONFIGURATION
// =============================================

const CONFIG = {
    PARALLAX_SPEED: 0.5,
    SCROLL_THROTTLE: 16, // ~60fps
    ANIMATION_DURATION: 600,
    INTERSECTION_THRESHOLD: 0.1,
    BREAKPOINTS: {
        mobile: 480,
        tablet: 768,
        desktop: 1024
    }
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function to delay function calls
 */
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

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element, duration = 800) {
    const targetPosition = element.offsetTop - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// =============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// =============================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: CONFIG.INTERSECTION_THRESHOLD
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all scroll reveal elements
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach(element => {
        observer.observe(element);
    });
}

// =============================================
// HEADER SCROLL EFFECTS
// =============================================

function initHeaderEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// =============================================
// PARALLAX EFFECTS
// =============================================

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    if (parallaxElements.length === 0) return;

    const updateParallax = throttle(() => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * CONFIG.PARALLAX_SPEED;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${parallax}px)`;
        });
    }, CONFIG.SCROLL_THROTTLE);

    window.addEventListener('scroll', updateParallax);
}

// =============================================
// SMOOTH NAVIGATION
// =============================================

function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

// =============================================
// ANIMATED COUNTERS
// =============================================

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        if (isNaN(target)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

// =============================================
// CARD HOVER EFFECTS
// =============================================

function initCardHoverEffects() {
    const cards = document.querySelectorAll('.stat, .showcase-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-2xl)';
        });
        
        card.addEventListener('mouseleave', (e) => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
}

// =============================================
// BUTTON RIPPLE EFFECTS
// =============================================

function initButtonRippleEffects() {
    const buttons = document.querySelectorAll('.btn, .cta-primary-hero, .cta-secondary-hero, .cta-primary, .cta-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// =============================================
// LOADING ANIMATIONS
// =============================================

function initLoadingAnimations() {
    const elements = document.querySelectorAll('.hero-content, .section-title, .section-subtitle');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// =============================================
// SCROLL PROGRESS INDICATOR
// =============================================

function initScrollProgressIndicator() {
    // Create the scroll progress container that matches CSS styles
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress';
    
    // Create the progress bar inside the container
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    const updateProgress = throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        
        progressBar.style.width = scrollPercentRounded + '%';
    }, CONFIG.SCROLL_THROTTLE);
    
    window.addEventListener('scroll', updateProgress);
}

// =============================================
// MOBILE MENU TOGGLE
// =============================================

function initMobileMenu() {
    const createMobileMenuButton = () => {
        const button = document.createElement('button');
        button.className = 'mobile-menu-toggle';
        button.innerHTML = '☰';
        button.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--primary-color);
            cursor: pointer;
            padding: 0.5rem;
            @media (max-width: 768px) {
                display: block;
            }
        `;
        
        return button;
    };
    
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    const mobileButton = createMobileMenuButton();
    
    navContainer.appendChild(mobileButton);
    
    mobileButton.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = 'white';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = 'var(--shadow-xl)';
        navLinks.style.borderRadius = '0 0 1rem 1rem';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target)) {
            navLinks.style.display = '';
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.right = '';
            navLinks.style.backgroundColor = '';
            navLinks.style.flexDirection = '';
            navLinks.style.padding = '';
            navLinks.style.boxShadow = '';
            navLinks.style.borderRadius = '';
        }
    });
}

// =============================================
// FLOATING ELEMENTS
// =============================================

function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.benefit-icon');
    
    floatingElements.forEach((element, index) => {
        element.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });
}

// =============================================
// PERFORMANCE OPTIMIZATIONS
// =============================================

function initPerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// =============================================
// ACCESSIBILITY ENHANCEMENTS
// =============================================

function initAccessibilityEnhancements() {
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                    element.click();
                }
            }
        });
    });
}

// =============================================
// INITIALIZATION
// =============================================

function init() {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        initScrollAnimations();
        initParallaxEffects();
        initLoadingAnimations();
        initFloatingElements();
        initScrollProgressIndicator();
        initAnimatedCounters();
    }
    
    // Always init these (they respect reduced motion internally)
    initHeaderEffects();
    initSmoothNavigation();
    initCardHoverEffects();
    initButtonRippleEffects();
    initMobileMenu();
    initPerformanceOptimizations();
    initAccessibilityEnhancements();
}

// =============================================
// DOM READY
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    init();
});

// =============================================
// WINDOW LOAD
// =============================================

window.addEventListener('load', () => {
    // Additional performance optimizations after page load
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.willChange = 'auto';
    }
});

// =============================================
// RESIZE HANDLER
// =============================================

window.addEventListener('resize', debounce(() => {
    // Recalculate animations on resize
    const elements = document.querySelectorAll('.scroll-reveal.revealed');
    elements.forEach(element => {
        element.style.transition = 'none';
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
        }, 100);
    });
}, 250));

// =============================================
// ERROR HANDLING
// =============================================

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Graceful fallback for critical functionality
    if (e.error.message.includes('IntersectionObserver')) {
        // Fallback for older browsers
        const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
        scrollRevealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }
});

// =============================================
// EXPORT FOR TESTING
// =============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        throttle,
        debounce,
        smoothScrollTo,
        isInViewport
    };
} 