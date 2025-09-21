/**
 * =============================================================================
 * KEVIN'S PORTFOLIO - MAIN JAVASCRIPT
 * =============================================================================
 * 
 * This file contains all the interactive functionality for the portfolio:
 * - Page navigation
 * - Accordion functionality
 * - Image slider with infinite loop
 * - Video state management
 * - Enhanced user experience features
 */

// =============================================================================
// GLOBAL VARIABLES & CONSTANTS
// =============================================================================

const CONFIG = {
    slider: {
        autoPlayDelay: 5000, // 5 seconds
        transitionDuration: 500, // milliseconds
        totalSlides: 5
    },
    animations: {
        fadeInDuration: 300,
        scrollThreshold: 0.1
    }
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the portfolio when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeNavigation();
        initializeAccordion();
        initializeSlider();
        initializeVideoStates();
        initializePageTransitions();
        initializeScrollAnimations();
        
        // Set initial page
        showPage('home');
        
        console.log('Portfolio initialized successfully');
    } catch (error) {
        console.error('Error initializing portfolio:', error);
    }
});

// =============================================================================
// PAGE NAVIGATION
// =============================================================================

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            
            if (pageName) {
                showPage(pageName);
                updateNavigationState(this);
            }
        });
    });
}

/**
 * Show the specified page and hide others
 * @param {string} pageName - The data-page attribute value
 */
function showPage(pageName) {
    try {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.querySelector(`.page[data-page="${pageName}"]`);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Update URL hash for better UX
            window.history.replaceState(null, null, `#${pageName}`);
        } else {
            console.warn(`Page "${pageName}" not found`);
        }
        
        // Update navigation
        updateActiveNavigation(pageName);
        
    } catch (error) {
        console.error('Error showing page:', error);
    }
}

/**
 * Update active navigation state
 * @param {string} pageName - The active page name
 */
function updateActiveNavigation(pageName) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const isActive = link.getAttribute('data-page') === pageName;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'page' : null);
    });
}

/**
 * Update navigation state for clicked link
 * @param {HTMLElement} clickedLink - The clicked navigation link
 */
function updateNavigationState(clickedLink) {
    // Remove active state from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Add active state to clicked link
    clickedLink.classList.add('active');
    clickedLink.setAttribute('aria-current', 'page');
}

// =============================================================================
// ACCORDION FUNCTIONALITY
// =============================================================================

/**
 * Initialize accordion functionality for the About page
 */
function initializeAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const icon = item.querySelector('.accordion-icon');
        
        if (header && icon) {
            header.addEventListener('click', () => toggleAccordionItem(item, icon));
            
            // Set initial ARIA states
            const isActive = item.classList.contains('active');
            item.setAttribute('aria-expanded', isActive);
            icon.textContent = isActive ? '－' : '＋';
        }
    });
}

/**
 * Toggle accordion item open/closed
 * @param {HTMLElement} item - The accordion item element
 * @param {HTMLElement} icon - The accordion icon element
 */
function toggleAccordionItem(item, icon) {
    const isActive = item.classList.contains('active');
    
    // Close all accordion items
    document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherIcon = otherItem.querySelector('.accordion-icon');
        if (otherIcon) {
            otherIcon.textContent = '＋';
            otherItem.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
        icon.textContent = '－';
        item.setAttribute('aria-expanded', 'true');
    }
}

// =============================================================================
// IMAGE SLIDER FUNCTIONALITY
// =============================================================================

/**
 * Initialize the image slider with infinite loop functionality
 */
function initializeSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    if (!sliderTrack || !prevBtn || !nextBtn) {
        console.warn('Slider elements not found');
        return;
    }
    
    let currentSlide = 1; // Start at slide 1 (first real slide)
    let isTransitioning = false;
    let autoPlayInterval;
    
    /**
     * Get slide width from CSS variable
     * @returns {number} Slide width in pixels
     */
    function getSlideWidth() {
        const slideWidth = getComputedStyle(document.documentElement)
            .getPropertyValue('--slide-width');
        return parseInt(slideWidth) || 600; // Fallback to 600px
    }
    
    /**
     * Update slider position
     */
    function updateSlider() {
        const slideWidth = getSlideWidth();
        const translateX = -currentSlide * slideWidth;
        sliderTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update ARIA states for accessibility
        updateSliderAccessibility();
    }
    
    /**
     * Update accessibility attributes for slider
     */
    function updateSliderAccessibility() {
        const slides = sliderTrack.querySelectorAll('.slider-item');
        slides.forEach((slide, index) => {
            const isActive = index === currentSlide;
            slide.setAttribute('aria-hidden', !isActive);
        });
    }
    
    /**
     * Go to next slide
     */
    function nextSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentSlide++;
        updateSlider();
        
        // Check if we need to loop back to beginning
        setTimeout(() => {
            if (currentSlide > CONFIG.slider.totalSlides) {
                currentSlide = 1;
                sliderTrack.style.transition = 'none';
                updateSlider();
                
                // Re-enable transitions
                setTimeout(() => {
                    sliderTrack.style.transition = `transform ${CONFIG.slider.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                }, 10);
            }
            isTransitioning = false;
        }, CONFIG.slider.transitionDuration);
    }
    
    /**
     * Go to previous slide
     */
    function prevSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentSlide--;
        updateSlider();
        
        // Check if we need to loop to end
        setTimeout(() => {
            if (currentSlide < 1) {
                currentSlide = CONFIG.slider.totalSlides;
                sliderTrack.style.transition = 'none';
                updateSlider();
                
                // Re-enable transitions
                setTimeout(() => {
                    sliderTrack.style.transition = `transform ${CONFIG.slider.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                }, 10);
            }
            isTransitioning = false;
        }, CONFIG.slider.transitionDuration);
    }
    
    /**
     * Start auto-play functionality
     */
    function startAutoPlay() {
        stopAutoPlay(); // Clear any existing interval
        autoPlayInterval = setInterval(nextSlide, CONFIG.slider.autoPlayDelay);
    }
    
    /**
     * Stop auto-play functionality
     */
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (sliderTrack.closest('.page.active')) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
            }
        }
    });
    
    // Pause auto-play on hover
    sliderTrack.addEventListener('mouseenter', stopAutoPlay);
    sliderTrack.addEventListener('mouseleave', startAutoPlay);
    
    // Handle window resize
    window.addEventListener('resize', debounce(updateSlider, 250));
    
    // Initialize
    updateSlider();
    startAutoPlay();
}

// =============================================================================
// VIDEO FUNCTIONALITY
// =============================================================================

/**
 * Initialize video state management for poster/playing states
 */
function initializeVideoStates() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Add playing class when video starts
        video.addEventListener('play', () => {
            video.classList.add('playing');
        });
        
        // Remove playing class when video pauses or ends
        video.addEventListener('pause', () => {
            video.classList.remove('playing');
        });
        
        video.addEventListener('ended', () => {
            video.classList.remove('playing');
        });
        
        // Remove playing class when video loads (shows poster)
        video.addEventListener('loadstart', () => {
            video.classList.remove('playing');
        });
        
        // Handle loading errors
        video.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
        });
    });
}

// =============================================================================
// PAGE TRANSITIONS
// =============================================================================

/**
 * Initialize enhanced page transitions
 */
function initializePageTransitions() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Add loading state
            document.body.classList.add('loading');
            
            // Remove loading state after transition
            setTimeout(() => {
                document.body.classList.remove('loading');
            }, CONFIG.animations.fadeInDuration);
        });
    });
}

// =============================================================================
// SCROLL ANIMATIONS
// =============================================================================

/**
 * Initialize scroll-triggered animations
 */
function initializeScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported, scroll animations disabled');
        return;
    }
    
    const observerOptions = {
        threshold: CONFIG.animations.scrollThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.image-container, .gallery-item, .video-container'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
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
 * Check if an element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
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

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Global error handler for unhandled errors
 */
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

/**
 * Monitor page load performance
 */
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
});