const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');
const header = document.querySelector('.header');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    header.classList.add('menu-active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    header.classList.remove('menu-active');
    document.body.style.overflow = '';
});

mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        mobileMenu.classList.remove('active');
        header.classList.remove('menu-active');
        document.body.style.overflow = '';
    }
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('active');
        header.classList.remove('menu-active');
        document.body.style.overflow = '';
    }
});









// Back to Top Button Functionality
(function () {
    const backToTopButton = document.getElementById('backToTop');

    // Show/Hide button on scroll
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Smooth scroll to top on click
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

