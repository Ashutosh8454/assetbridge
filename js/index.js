// Hero Slider
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.getElementById('prevBtnHero');
    const nextBtn = document.getElementById('nextBtnHero');
    const dotsContainer = document.getElementById('sliderDotsHero');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    let currentIndex = 0;
    let autoPlayInterval;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Initialize slider
    function init() {
        createDots();
        updateSlider();
        updateButtons();
        updateDots();
        startAutoPlay();
    }

    // Create navigation dots
    function createDots() {
        dotsContainer.innerHTML = '';

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot-hero');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update slider position
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth;
        const moveDistance = -(currentIndex * slideWidth);

        slider.style.transform = `translateX(${moveDistance}px)`;
    }

    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= slides.length - 1;

        // Add visual feedback
        prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
    }

    // Update dot indicators
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.slider-dot-hero');
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
        resetAutoPlay();
    }

    // Previous button click
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
            updateButtons();
            updateDots();
            resetAutoPlay();
        }
    });

    // Next button click
    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlider();
            updateButtons();
            updateDots();
            resetAutoPlay();
        } else {
            // Loop back to first slide
            currentIndex = 0;
            updateSlider();
            updateButtons();
            updateDots();
            resetAutoPlay();
        }
    });


    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
            updateButtons();
            updateDots();
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Pause auto-play on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

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
        slider.style.cursor = 'grabbing';
        stopAutoPlay();
    }

    function touchEnd() {
        if (!isDragging) return;

        isDragging = false;
        slider.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;

        // Determine if we should move to next/prev slide
        if (movedBy < -50 && currentIndex < slides.length - 1) {
            currentIndex++;
        } else if (movedBy < -50 && currentIndex === slides.length - 1) {
            currentIndex = 0;
        }

        if (movedBy > 50 && currentIndex > 0) {
            currentIndex--;
        } else if (movedBy > 50 && currentIndex === 0) {
            currentIndex = slides.length - 1;
        }

        updateSlider();
        updateButtons();
        updateDots();

        currentTranslate = 0;
        prevTranslate = 0;

        resetAutoPlay();
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

    // Window resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlider();
            updateButtons();
            updateDots();
        }, 250);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });

    // Prevent default drag behavior on links
    slides.forEach(slide => {
        const links = slide.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('dragstart', (e) => e.preventDefault());
        });
    });

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            const headerActions = document.querySelector('.header-actions');

            mobileMenuBtn.classList.toggle('active');

            if (nav) {
                if (nav.style.display === 'flex') {
                    nav.style.display = 'none';
                    if (headerActions) headerActions.style.display = 'none';
                } else {
                    nav.style.display = 'flex';
                    nav.style.flexDirection = 'column';
                    nav.style.position = 'absolute';
                    nav.style.top = '70px';
                    nav.style.left = '0';
                    nav.style.right = '0';
                    nav.style.background = 'rgba(10, 14, 26, 0.98)';
                    nav.style.padding = '20px';
                    nav.style.gap = '20px';

                    if (headerActions) {
                        headerActions.style.display = 'flex';
                        headerActions.style.flexDirection = 'column';
                        headerActions.style.position = 'absolute';
                        headerActions.style.top = '250px';
                        headerActions.style.left = '0';
                        headerActions.style.right = '0';
                        headerActions.style.background = 'rgba(10, 14, 26, 0.98)';
                        headerActions.style.padding = '20px';
                    }
                }
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

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

    // Add active state animation to mobile menu button
    if (mobileMenuBtn) {
        const checkMobileMenuActive = () => {
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileMenuBtn.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        };

        mobileMenuBtn.addEventListener('click', () => {
            setTimeout(checkMobileMenuActive, 10);
        });
    }
});

// Add parallax effect to hero images (optional enhancement)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImages = document.querySelectorAll('.hero-image img');

    heroImages.forEach(img => {
        const speed = 0.5;
        img.style.transform = `translateY(${scrolled * speed}px)`;
    });
});