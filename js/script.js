document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        if (navLinks.style.maxHeight) {
            navLinks.style.maxHeight = null;
            console.log("Menu collapsed"); // Debugging log
        } else {
            navLinks.style.maxHeight = navLinks.scrollHeight + "px";
            console.log("Menu expanded to:", navLinks.scrollHeight + "px"); // Debugging log
        }
    });
});
