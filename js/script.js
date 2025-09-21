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

// Slider functionality
function initSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots = document.querySelectorAll('.dot');
    const sliderItems = document.querySelectorAll('.slider-item');
    
    let currentSlide = 0;
    const totalSlides = sliderItems.length;
    let isTransitioning = false;
    
    // Touch/drag variables
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let dragThreshold = 50;
    
    // Update slider position
    function updateSlider() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        const translateX = -currentSlide * 20; // 20% per slide (100% / 5 slides)
        sliderTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update slider items
        sliderItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentSlide);
        });
        
        // Reset transition flag after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        if (isTransitioning) return;
        currentSlide = slideIndex;
        updateSlider();
    }
    
    // Go to next slide
    function nextSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    // Go to previous slide
    function prevSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Touch/drag event listeners for mobile
    sliderTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
    sliderTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
    sliderTrack.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse drag event listeners for desktop
    sliderTrack.addEventListener('mousedown', handleMouseDown);
    sliderTrack.addEventListener('mousemove', handleMouseMove);
    sliderTrack.addEventListener('mouseup', handleMouseUp);
    sliderTrack.addEventListener('mouseleave', handleMouseUp);
    
    // Prevent context menu on long press
    sliderTrack.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Touch event handlers
    function handleTouchStart(e) {
        if (isTransitioning) return;
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        sliderTrack.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isDragging || isTransitioning) return;
        
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        const translateX = -currentSlide * 20 + (diffX / sliderTrack.offsetWidth) * 100;
        
        // Prevent over-scrolling
        if (translateX > 0) translateX = 0;
        if (translateX < -80) translateX = -80; // 4 * 20%
        
        sliderTrack.style.transform = `translateX(${translateX}%)`;
        e.preventDefault();
    }
    
    function handleTouchEnd(e) {
        if (!isDragging || isTransitioning) return;
        
        const diffX = currentX - startX;
        const threshold = sliderTrack.offsetWidth * 0.2; // 20% of slider width
        
        sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            updateSlider(); // Snap back to current slide
        }
        
        isDragging = false;
    }
    
    // Mouse event handlers
    function handleMouseDown(e) {
        if (isTransitioning) return;
        startX = e.clientX;
        currentX = startX;
        isDragging = true;
        sliderTrack.style.transition = 'none';
        e.preventDefault();
    }
    
    function handleMouseMove(e) {
        if (!isDragging || isTransitioning) return;
        
        currentX = e.clientX;
        const diffX = currentX - startX;
        const translateX = -currentSlide * 20 + (diffX / sliderTrack.offsetWidth) * 100;
        
        // Prevent over-scrolling
        if (translateX > 0) translateX = 0;
        if (translateX < -80) translateX = -80;
        
        sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    function handleMouseUp(e) {
        if (!isDragging || isTransitioning) return;
        
        const diffX = currentX - startX;
        const threshold = sliderTrack.offsetWidth * 0.2;
        
        sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            updateSlider();
        }
        
        isDragging = false;
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.page[data-page="home"]').classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Auto-play functionality (optional - can be disabled)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Pause auto-play on hover/interaction
    sliderTrack.addEventListener('mouseenter', stopAutoPlay);
    sliderTrack.addEventListener('mouseleave', startAutoPlay);
    sliderTrack.addEventListener('touchstart', stopAutoPlay);
    
    // Start auto-play after 3 seconds
    setTimeout(startAutoPlay, 3000);
    
    // Initialize slider
    updateSlider();
}


// Enhanced page transitions
function initPageTransitions() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            // Add loading state
            document.body.classList.add('loading');
            
            // Remove loading state after transition
            setTimeout(() => {
                document.body.classList.remove('loading');
            }, 300);
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.image-container, .gallery-item, .video-container');
    animateElements.forEach(el => observer.observe(el));
}

