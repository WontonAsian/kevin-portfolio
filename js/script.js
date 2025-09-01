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
});

function showPage(pageName) {
    // Hide all pages first
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the target page
    const targetPage = document.querySelector(`.page[data-page="${pageName}"]`);
    if (targetPage) {
        targetPage.style.display = 'flex';
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
                otherIcon.style.transform = 'rotate(0deg)';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                icon.textContent = '－';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}
