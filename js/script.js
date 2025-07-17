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
        rootMargin: '50px',
        threshold: CONFIG.INTERSECTION_THRESHOLD
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay to prevent flickering
                requestAnimationFrame(() => {
                entry.target.classList.add('revealed');
                    
                    // Special handling for trust section
                    if (entry.target.closest('.trust-safety-section')) {
                        const trustCards = entry.target.querySelectorAll('.trust-card');
                        const badges = entry.target.querySelectorAll('.badge');
                        
                        // Animate trust cards with staggered delays
                        trustCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('revealed');
                            }, 400 + (index * 100));
                        });
                        
                        // Animate badges with staggered delays
                        badges.forEach((badge, index) => {
                            setTimeout(() => {
                                badge.classList.add('revealed');
                            }, 600 + (index * 100));
                        });
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all scroll reveal elements
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach(element => {
        // Ensure elements start hidden
        element.classList.remove('revealed');
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
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
    const body = document.body;
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    function toggleMobileMenu() {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            // Close menu
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileMenu.classList.remove('active');
            mobileMenuBackdrop.classList.remove('active');
            body.style.overflow = '';
        } else {
            // Open menu
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileMenu.classList.add('active');
            mobileMenuBackdrop.classList.add('active');
            body.style.overflow = 'hidden';
        }
    }
    
    function closeMobileMenu() {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.classList.remove('active');
        mobileMenuBackdrop.classList.remove('active');
        body.style.overflow = '';
    }
    
    // Toggle menu on button click
    mobileMenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu with X button
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
    });
    }
    
    // Close menu when clicking on backdrop
    if (mobileMenuBackdrop) {
        mobileMenuBackdrop.addEventListener('click', () => {
            closeMobileMenu();
        });
    }
    
    // Close menu when clicking on menu links
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250));
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
// IMAGE OPTIMIZATION & LAZY LOADING
// =============================================

/**
 * Lazy load images for better performance
 */
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                    
                    // Replace data-src with src
                    if (img.dataset.src) {
                img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                        img.classList.add('loaded');
                    };
                    
                    observer.unobserve(img);
            }
        });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }
}

/**
 * Optimize image loading with srcset and WebP support
 */
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading attribute if not present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding attribute for better performance
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
        
        // Add width and height attributes if missing (helps with CLS)
        if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
            img.style.aspectRatio = '16/9'; // Default aspect ratio
        }
    });
}

/**
 * Preload critical images
 */
function preloadCriticalImages() {
    const criticalImages = [
        'assets/images/hero-bg.jpg',
        'assets/images/og-image.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// =============================================
// SEO ENHANCEMENTS
// =============================================

/**
 * Add structured data for breadcrumb navigation
 */
function updateBreadcrumbStructuredData() {
    const breadcrumbItems = document.querySelectorAll('.breadcrumb li a');
    
    if (breadcrumbItems.length > 0) {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": []
        };
        
        breadcrumbItems.forEach((item, index) => {
            breadcrumbData.itemListElement.push({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.textContent.trim(),
                "item": item.href
            });
        });
        
        // Update or create breadcrumb structured data
        let breadcrumbScript = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
        if (!breadcrumbScript) {
            breadcrumbScript = document.createElement('script');
            breadcrumbScript.type = 'application/ld+json';
            breadcrumbScript.setAttribute('data-breadcrumb', 'true');
            document.head.appendChild(breadcrumbScript);
        }
        
        breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
    }
}

/**
 * Add meta tags for current page section
 */
function updateMetaTags() {
    const currentSection = getCurrentSection();
    
    if (currentSection) {
        // Update description based on current section
        const descriptions = {
            'browse': 'Browse horses for sale from around the world - Find your perfect horse on FindMyHorse marketplace',
            'platforms': 'Discover the global horse platforms connected to FindMyHorse - 50+ international dealers and classifieds',
            'faq': 'Frequently asked questions about FindMyHorse - Learn how to buy and sell horses online',
            'about': 'About FindMyHorse - The world\'s first unified equestrian marketplace connecting global horse platforms'
        };
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && descriptions[currentSection]) {
            metaDescription.content = descriptions[currentSection];
        }
    }
}

/**
 * Get current section based on scroll position
 */
function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = null;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
        }
    });
    
    return currentSection;
}

// =============================================
// PERFORMANCE OPTIMIZATIONS
// =============================================

/**
 * Optimize CSS and JavaScript loading
 */
function optimizeResourceLoading() {
    // Add preload hints for critical resources
    const criticalResources = [
        { href: 'css/styles.css', as: 'style' },
        { href: 'js/script.js', as: 'script' }
    ];
    
    criticalResources.forEach(resource => {
        const existingLink = document.querySelector(`link[href="${resource.href}"]`);
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.as;
            link.href = resource.href;
            document.head.appendChild(link);
        }
    });
}

/**
 * Optimize Web Vitals
 */
function optimizeWebVitals() {
    // Reduce layout shift by setting image dimensions
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.style.aspectRatio && !img.width && !img.height) {
            img.style.width = '100%';
            img.style.height = 'auto';
        }
    });
    
    // Optimize font loading
    const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (fontLink) {
        fontLink.setAttribute('font-display', 'swap');
    }
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
// REDESIGNED SECTIONS FUNCTIONALITY
// =============================================

/**
 * Initialize testimonial carousel
 */
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carousel || cards.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = cards.length;
    
    // Auto-advance slides
    let slideInterval = setInterval(() => {
        nextSlide();
    }, 8000);
    
    function showSlide(index) {
        // Hide all cards
        cards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current card and activate indicator
        cards[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetInterval();
        });
    });
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            nextSlide();
        }, 8000);
    }
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        resetInterval();
    });
    
    // Initialize first slide
    showSlide(0);
}

/**
 * Initialize pricing toggle
 */
function initPricingToggle() {
    const toggle = document.getElementById('pricing-toggle');
    const monthlyAmounts = document.querySelectorAll('.amount.monthly');
    const yearlyAmounts = document.querySelectorAll('.amount.yearly');
    
    if (!toggle) return;
    
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            // Show yearly pricing
            monthlyAmounts.forEach(amount => {
                amount.style.display = 'none';
            });
            yearlyAmounts.forEach(amount => {
                amount.style.display = 'inline';
            });
        } else {
            // Show monthly pricing
            monthlyAmounts.forEach(amount => {
                amount.style.display = 'inline';
            });
            yearlyAmounts.forEach(amount => {
                amount.style.display = 'none';
            });
        }
    });
}

/**
 * Initialize animated counters
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Initialize search demo typing animation
 */
function initSearchDemo() {
    const typingElement = document.querySelector('.typing-demo');
    
    if (!typingElement) return;
    
    const texts = [
        'Warmblood mare, 6-8 years, dressage trained...',
        'Thoroughbred gelding, racing background...',
        'Quarter horse, western pleasure trained...',
        'Friesian stallion, black, baroque type...'
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[currentTextIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                setTimeout(typeText, 500);
                return;
            }
        } else {
            typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeText, 2000);
                return;
            }
        }
        
        setTimeout(typeText, isDeleting ? 50 : 100);
    }
    
    // Start typing animation
    setTimeout(typeText, 1000);
}

/**
 * Initialize trend bar animations
 */
function initTrendBars() {
    const trendBars = document.querySelectorAll('.trend-bar');
    const priceSegments = document.querySelectorAll('.price-segment');
    
    if (trendBars.length === 0 && priceSegments.length === 0) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('trend-bar')) {
                    // Animate trend bars
                    const width = element.style.getPropertyValue('--width');
                    element.style.setProperty('--width', '0%');
                    
                    setTimeout(() => {
                        element.style.setProperty('--width', width);
                    }, 500);
                }
                
                if (element.classList.contains('price-segment')) {
                    // Animate price segments
                    const height = element.style.getPropertyValue('--height');
                    element.style.setProperty('--height', '0%');
                    
                    setTimeout(() => {
                        element.style.setProperty('--height', height);
                    }, 500);
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    trendBars.forEach(bar => observer.observe(bar));
    priceSegments.forEach(segment => observer.observe(segment));
}

/**
 * Initialize mobile app mockup animation
 */
function initMobileMockup() {
    const mockup = document.querySelector('.mobile-mockup');
    
    if (!mockup) return;
    
    const observerOptions = {
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const phoneFrame = entry.target.querySelector('.phone-frame');
                
                if (phoneFrame) {
                    phoneFrame.style.animation = 'phoneFloat 6s ease-in-out infinite';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(mockup);
}

/**
 * Initialize platform hover effects
 */
function initPlatformEffects() {
    const platformLogos = document.querySelectorAll('.platform-logo');
    
    platformLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'translateY(-5px)';
        });
    });
}

/**
 * Initialize service card effects
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(-8px)';
            }
        });
    });
}

/**
 * Initialize pricing card effects
 */
function initPricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(-8px)';
            }
        });
    });
}

/**
 * Initialize CTA section animations
 */
function initCTAAnimations() {
    const ctaSection = document.querySelector('.cta-section');
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    
    if (!ctaSection) return;
    
    // Floating background animation
    const ctaBg = ctaSection.querySelector('::before');
    
    // Button hover effects
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(-3px)';
        });
    });
}

/**
 * Initialize trust card stagger animation
 */
function initTrustCards() {
    const trustCards = document.querySelectorAll('.trust-card');
    
    if (trustCards.length === 0) return;
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.trust-card');
                
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `slideInUp 0.6s ease forwards`;
                    }, index * 200);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const trustGrid = document.querySelector('.trust-grid');
    if (trustGrid) {
        observer.observe(trustGrid);
    }
}

/**
 * Initialize feature cards stagger animation
 */
function initFeatureCards() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    if (featureItems.length === 0) return;
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.feature-item');
                
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = `slideInUp 0.6s ease forwards`;
                    }, index * 150);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) {
        observer.observe(featuresGrid);
    }
    }
    
/**
 * Initialize keyboard navigation for carousel
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const prevBtn = document.querySelector('.testimonial-prev');
            if (prevBtn) prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            const nextBtn = document.querySelector('.testimonial-next');
            if (nextBtn) nextBtn.click();
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize live statistics simulation
 */
function initLiveStats() {
    const statNumbers = document.querySelectorAll('.stat-card .stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Simulate live updates every 30 seconds
    setInterval(() => {
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
            const newValue = Math.max(0, currentValue + variation);
            
            // Animate the change
            stat.style.transform = 'scale(1.1)';
            setTimeout(() => {
                stat.textContent = newValue;
                stat.style.transform = 'scale(1)';
            }, 200);
        });
    }, 30000);
}

// Add new keyframes for animations
const additionalStyles = `
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes phoneFloat {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// =============================================
// UPDATED INITIALIZATION
// =============================================

/**
 * Initialize all functionality
 */
function init() {
    // Initialize Lucide icons first
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Core functionality
        initScrollAnimations();
        initScrollProgressIndicator();
    initHeaderEffects();
    initSmoothNavigation();
    initCardHoverEffects();
    initButtonRippleEffects();
    initMobileMenu();
    initImageLazyLoading();
    optimizeImages();
    preloadCriticalImages();
    updateBreadcrumbStructuredData();
    optimizeResourceLoading();
    optimizeWebVitals();
    initAccessibilityEnhancements();
    
    // New redesigned section functionality
    initTestimonialCarousel();
    initPricingToggle();
    initAnimatedCounters();
    initSearchDemo();
    initTrendBars();
    initMobileMockup();
    initPlatformEffects();
    initServiceCards();
    initPricingCards();
    initCTAAnimations();
    initTrustCards();
    initFeatureCards();
    initKeyboardNavigation();
    initSmoothScrolling();
    initLiveStats();
    initFAQAccordion();
}

/**
 * Initialize FAQ accordion functionality
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
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
    
    // Add scroll listener for dynamic meta tag updates
    window.addEventListener('scroll', throttle(() => {
        updateMetaTags();
    }, 500));
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
        isInViewport,
        initImageLazyLoading,
        optimizeImages,
        preloadCriticalImages,
        updateBreadcrumbStructuredData,
        updateMetaTags,
        optimizeResourceLoading,
        optimizeWebVitals
    };
} 