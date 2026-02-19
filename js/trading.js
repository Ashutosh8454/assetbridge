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

const sections = ['markets', 'atherium', 'pricing', 'global-trading', 'education', 'ready'];
sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
        observer.observe(section);
    }
});
