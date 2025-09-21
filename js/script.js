document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click event listeners to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            showPage(pageName);
        });
    });
    
    // Initialize: Show home page and set active nav link
    showPage('home');
    
    // Initialize accordion functionality
    initAccordion();
    
    // Initialize slider functionality
    initSlider();
    
    // Initialize enhanced page transitions
    initPageTransitions();
});

function showPage(pageName) {
    // Hide all pages first
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the target page
    const targetPage = document.querySelector(`.page[data-page="${pageName}"]`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation links - remove active from all
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    const clickedLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (clickedLink) {
        clickedLink.classList.add('active');
    }
}

// Accordion functionality
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const icon = item.querySelector('.accordion-icon');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherIcon = otherItem.querySelector('.accordion-icon');
                otherIcon.textContent = '＋';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                icon.textContent = '－';
            }
        });
    });
}

// Slider functionality with seamless infinite effect
function initSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    let currentSlide = 1; // Start at slide 1 (first real slide)
    const totalSlides = 5;
    const slideWidth = 600; // CSS variable --slide-width
    let isTransitioning = false;
    
    // Update slider position
    function updateSlider() {
        const translateX = -currentSlide * slideWidth;
        sliderTrack.style.transform = `translateX(${translateX}px)`;
    }
    
    // Go to next slide
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentSlide++;
        updateSlider();
        
        // Check if we need to loop
        setTimeout(() => {
            if (currentSlide > totalSlides) {
                // We're at a clone, jump to the real slide
                currentSlide = 1;
                sliderTrack.style.transition = 'none';
                updateSlider();
                // Re-enable transitions
                setTimeout(() => {
                    sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);
            }
            isTransitioning = false;
        }, 500);
    }
    
    // Go to previous slide
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentSlide--;
        updateSlider();
        
        // Check if we need to loop
        setTimeout(() => {
            if (currentSlide < 1) {
                // We're at a clone, jump to the real slide
                currentSlide = totalSlides;
                sliderTrack.style.transition = 'none';
                updateSlider();
                // Re-enable transitions
                setTimeout(() => {
                    sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);
            }
            isTransitioning = false;
        }, 500);
    }
    
    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (sliderTrack.closest('.page.active')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Pause auto-play on hover
    sliderTrack.addEventListener('mouseenter', stopAutoPlay);
    sliderTrack.addEventListener('mouseleave', startAutoPlay);
    
    // Start auto-play
    startAutoPlay();
}

// Enhanced page transitions
function initPageTransitions() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            document.body.classList.add('loading');
            
            setTimeout(() => {
                document.body.classList.remove('loading');
            }, 300);
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
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
    const animatedElements = document.querySelectorAll('.image-container, .gallery-item, .video-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}