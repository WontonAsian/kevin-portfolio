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
    
    // Show home page by default
    const homePage = document.querySelector('[data-page="home"]');
    if (homePage) {
        homePage.style.display = 'flex';
    }
    
    // Set home nav link as active
    const homeLink = document.querySelector('[data-page="home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});

function showPage(pageName) {
    // Hide all pages EXCEPT the target page
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        const pageDataPage = page.getAttribute('data-page');
        if (pageDataPage === pageName) {
            page.style.display = 'flex';
        } else {
            page.style.display = 'none';
        }
    });
    
    // Update navigation links
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
