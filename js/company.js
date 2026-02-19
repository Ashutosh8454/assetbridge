const submenuSection = document.querySelector('.submenu-section');
const heroSection = document.querySelector('.hero-section');
const submenuNav = document.querySelector('.submenu-nav');

let submenuOffset = 0;
let heroHeight = 0;

function updateOffsets() {
    if (submenuSection && heroSection) {
        heroHeight = heroSection.offsetHeight;
        submenuOffset = submenuSection.offsetTop;
    }
}

window.addEventListener('load', updateOffsets);
window.addEventListener('resize', updateOffsets);

// Ensure submenu starts at the beginning
window.addEventListener('load', () => {
    if (submenuNav) {
        submenuNav.scrollLeft = 0;
    }
});

window.addEventListener('scroll', () => {
    if (!submenuSection) return;

    const scrollPosition = window.scrollY;

    if (scrollPosition >= heroHeight - 80) {
        submenuSection.classList.add('sticky');
        document.body.style.paddingTop = submenuSection.offsetHeight + 'px';
    } else {
        submenuSection.classList.remove('sticky');
        document.body.style.paddingTop = '0';
    }
});

const submenuLinks = document.querySelectorAll('.submenu-link');

submenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        submenuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const submenuHeight = submenuSection.offsetHeight;
            const targetPosition = targetSection.offsetTop - submenuHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const observerOptions = {
    root: null,
    rootMargin: '-120px 0px -60% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const targetId = entry.target.id;
            const targetLink = document.querySelector(`.submenu-link[href="#${targetId}"]`);

            if (targetLink) {
                submenuLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');

                // Scroll active link into view (works on all screen sizes)
                targetLink.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

const sections = ['our-story', 'why-choose', 'speed-reliability', 'regulation-compliance', 'support', 'relationships', 'our-team', 'join-team', 'legal'];
sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
        observer.observe(section);
    }
});






















// Join Team Slider
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.careers-slider');
    const prevBtn = document.getElementById('prevBtnTeam');
    const nextBtn = document.getElementById('nextBtnTeam');
    const dotsContainer = document.getElementById('sliderDots');
    const cards = document.querySelectorAll('.career-card');

    let currentIndex = 0;
    let cardsPerView = 3;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Initialize slider
    function init() {
        updateCardsPerView();
        createDots();
        updateSlider();
        updateButtons();
        updateDots();
    }

    // Update cards per view based on window width
    function updateCardsPerView() {
        const windowWidth = window.innerWidth;

        if (windowWidth <= 768) {
            cardsPerView = 1;
        } else if (windowWidth <= 1024) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
    }

    // Create navigation dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalSlides = cards.length - cardsPerView + 1;

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update slider position
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(slider).gap);
        const moveDistance = -(currentIndex * (cardWidth + gap));

        slider.style.transform = `translateX(${moveDistance}px)`;
    }

    // Update button states
    function updateButtons() {
        const maxIndex = cards.length - cardsPerView;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;

        // Add visual feedback
        if (prevBtn.disabled) {
            prevBtn.style.opacity = '0.3';
        } else {
            prevBtn.style.opacity = '1';
        }

        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.3';
        } else {
            nextBtn.style.opacity = '1';
        }
    }

    // Update dot indicators
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
        updateButtons();
        updateDots();
    }

    // Previous button click
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
            updateButtons();
            updateDots();
        }
    });

    // Next button click
    nextBtn.addEventListener('click', () => {
        const maxIndex = cards.length - cardsPerView;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
            updateButtons();
            updateDots();
        }
    });

    // Touch/Mouse events for swipe functionality
    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('touchmove', touchMove);

    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);
    slider.addEventListener('mousemove', touchMove);

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        slider.style.cursor = 'grabbing';
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        slider.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;
        const maxIndex = cards.length - cardsPerView;

        // Determine if we should move to next/prev slide
        if (movedBy < -50 && currentIndex < maxIndex) {
            currentIndex++;
        }

        if (movedBy > 50 && currentIndex > 0) {
            currentIndex--;
        }

        updateSlider();
        updateButtons();
        updateDots();

        currentTranslate = 0;
        prevTranslate = 0;
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    // Window resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const oldCardsPerView = cardsPerView;
            updateCardsPerView();

            // Recreate dots if cards per view changed
            if (oldCardsPerView !== cardsPerView) {
                createDots();
                currentIndex = 0;
            }

            // Ensure we're not beyond the last possible position
            const maxIndex = cards.length - cardsPerView;
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            updateSlider();
            updateButtons();
            updateDots();
        }, 250);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextBtn.click();
        }
    });

    // Prevent card links from interfering with drag
    cards.forEach(card => {
        const link = card.querySelector('.btn-primary');
        const moreLink = card.querySelector('.career-link');
        if (link) link.addEventListener('dragstart', (e) => e.preventDefault());
        if (moreLink) moreLink.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Auto-play functionality (optional - uncomment to enable)
    /*
    let autoPlayInterval;
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
            if (currentIndex < maxIndex) {
                nextBtn.click();
            } else {
                currentIndex = 0;
                updateSlider();
                updateButtons();
                updateDots();
            }
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Start auto-play
    startAutoPlay();

    // Pause auto-play on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    */

    // Initialize on load
    init();

    // Also reinitialize after images load
    window.addEventListener('load', () => {
        setTimeout(() => {
            updateSlider();
            updateButtons();
            updateDots();
        }, 100);
    });
});