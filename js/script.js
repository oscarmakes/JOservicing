function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("show");

}


/* Close mobile menu when a link is clicked */

document.querySelectorAll("#navMenu a").forEach(function(link) {

    link.addEventListener("click", function() {

        const nav = document.getElementById("navMenu");

        nav.classList.remove("show");

    });

});


/* Simple page-load animation */

document.addEventListener("DOMContentLoaded", function() {

    document.body.classList.add("loaded");

});
