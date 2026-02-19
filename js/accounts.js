const submenuSection = document.querySelector('.submenu-section');
const heroSection = document.querySelector('.hero-section');

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

                if (window.innerWidth <= 768) {
                    targetLink.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

const sections = ['choose-account', 'features', 'funding-withdrawals', 'leverage-margin', 'open-account', 'client-portal', 'start'];
sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
        observer.observe(section);
    }
});










// Account Types Slider
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.accounts-slider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.account-card');

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
        updateSlider();
        updateButtons();
        updateHighlightedCard();
    }

    // Highlight the middle card dynamically
    function updateHighlightedCard() {
        // Remove highlight from all cards
        cards.forEach(card => card.classList.remove('account-card-highlighted'));

        // Calculate which card should be in the middle
        let middleIndex;

        if (cardsPerView === 1) {
            middleIndex = currentIndex;
        } else if (cardsPerView === 2) {
            middleIndex = currentIndex;
        } else {
            middleIndex = currentIndex + 1;
        }

        // Add highlight to middle card
        if (middleIndex >= 0 && middleIndex < cards.length) {
            cards[middleIndex].classList.add('account-card-highlighted');
        }
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

    // Update slider position
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(slider).gap);
        const moveDistance = -(currentIndex * (cardWidth + gap));

        slider.style.transform = `translateX(${moveDistance}px)`;
        updateHighlightedCard();
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

    // Previous button click
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
            updateButtons();
        }
    });

    // Next button click
    nextBtn.addEventListener('click', () => {
        const maxIndex = cards.length - cardsPerView;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
            updateButtons();
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

        // Determine if we should move to next/prev slide
        if (movedBy < -50 && currentIndex < cards.length - cardsPerView) {
            currentIndex++;
        }

        if (movedBy > 50 && currentIndex > 0) {
            currentIndex--;
        }

        updateSlider();
        updateButtons();

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

            // Reset to first slide if cards per view changed
            if (oldCardsPerView !== cardsPerView) {
                currentIndex = 0;
            }

            // Ensure we're not beyond the last possible position
            const maxIndex = cards.length - cardsPerView;
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            updateSlider();
            updateButtons();
            updateHighlightedCard();
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
        if (link) {
            link.addEventListener('dragstart', (e) => e.preventDefault());
        }
    });

    // Initialize on load
    init();

    // Also reinitialize after images load
    window.addEventListener('load', () => {
        setTimeout(() => {
            updateSlider();
            updateButtons();
            updateHighlightedCard();
        }, 100);
    });
});
