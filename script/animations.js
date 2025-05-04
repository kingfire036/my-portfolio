gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
    duration: 0.8,
    ease: "power2.out"
});

function setupHeroAnimation() {
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
        .fromTo("#hero-name", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .fromTo("#hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
        .fromTo("#hero-tagline", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .fromTo(".cta-button-wrapper", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" }, "-=0.3");

    const heroSection = document.getElementById('hero');
    const heroContentElements = ['#hero-name', '#hero-title', '#hero-tagline'];
    let parallaxTween;

    function handleMouseMove(e) {
        if (window.innerWidth <= 768) {
            if (parallaxTween) parallaxTween.kill();
            gsap.set(heroContentElements, { x: 0, y: 0 });
            return;
        }

        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = heroSection;
        const xPos = (clientX / offsetWidth - 0.5) * 25;
        const yPos = (clientY / offsetHeight - 0.5) * 15;

        parallaxTween = gsap.to(heroContentElements, {
            x: -xPos,
            y: -yPos,
            duration: 1.2,
            ease: 'power1.out',
            overwrite: 'auto'
        });
    }

    let mmTimeout;
    heroSection.addEventListener('mousemove', (e) => {
        clearTimeout(mmTimeout);
        mmTimeout = setTimeout(() => handleMouseMove(e), 16);
    });

    heroSection.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            gsap.to(heroContentElements, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'power1.out',
                overwrite: 'auto'
            });
        }
    });

    if (window.innerWidth <= 768) {
        gsap.set(heroContentElements, { x: 0, y: 0 });
    }
}

function setupScrollAnimations() {

    gsap.utils.toArray('.animate-on-scroll').forEach(element => {
        let xFrom = 0;
        let yFrom = 50;
        let rotationFrom = 0;

        if (element.classList.contains('fade-in-left')) {
            xFrom = -50; yFrom = 0;
        }
        if (element.classList.contains('fade-in-right')) {
            xFrom = 50; yFrom = 0;
        }

        gsap.fromTo(element,
            { opacity: 0, y: yFrom, x: xFrom, rotation: rotationFrom },
            {
                opacity: 1,
                y: 0,
                x: 0,
                rotation: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    });

    const timeline = document.querySelector('.education-timeline .timeline-line-container');
    if (timeline) {
        const line = timeline.querySelector('.timeline-line');
        const items = gsap.utils.toArray('.timeline-item');

        gsap.fromTo(line,
            { scaleY: 0, transformOrigin: 'top top' },
            {
                scaleY: 1,
                duration: items.length * 0.6,
                ease: 'none',
                scrollTrigger: {
                    trigger: timeline,
                    start: 'top 70%',
                    end: 'bottom 70%',
                    scrub: 1
                }
            }
        );
        n
        items.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });
    }

    gsap.utils.toArray('.skill-bar-inner').forEach(bar => {
        const level = bar.getAttribute('data-level') || '0%';
        gsap.fromTo(bar,
            { width: '0%' },
            {
                width: level,
                duration: 1.5,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: bar.closest('.skill-item'),
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    });

    const socialIcons = gsap.utils.toArray('.social-icon');
    socialIcons.forEach(icon => {
        const iconTween = gsap.to(icon, {
            scale: 1.2,
            rotation: 5,
            color: 'var(--accent-primary)',
            duration: 0.2,
            ease: 'power1.inOut',
            paused: true
        });

        icon.addEventListener('mouseenter', () => iconTween.play());
        icon.addEventListener('mouseleave', () => iconTween.reverse());
    });
}

function setupProjectCardHover() {
    const projectCards = gsap.utils.toArray('#projects-grid .project-card');

    projectCards.forEach(card => {
        if (card.dataset.hoverInitialized) return;
        card.dataset.hoverInitialized = true;

        const cardTween = gsap.to(card, {
            y: -8,
            scale: 1.03,
            boxShadow: '0 15px 30px var(--card-shadow-hover)',
            duration: 0.3,
            ease: 'power1.out',
            paused: true
        });

        card.addEventListener('mouseenter', () => cardTween.play());
        card.addEventListener('mouseleave', () => cardTween.reverse());
    });
}

function setupMobileMenuAnimation() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = gsap.utils.toArray('.mobile-nav-link');
    const hamburgerLines = gsap.utils.toArray('.hamburger-line');

    const openMenuTl = gsap.timeline({ paused: true, reversed: true });
    openMenuTl
        .set(mobileNav, { display: 'flex' })
        .to(mobileNav, { x: '0%', duration: 0.4, ease: 'power2.inOut' })
        .to(hamburgerLines[0], { rotate: 45, y: 8, duration: 0.3 }, 0)
        .to(hamburgerLines[1], { opacity: 0, duration: 0.3 }, 0)
        .to(hamburgerLines[2], { rotate: -45, y: -8, duration: 0.3 }, 0)
        .fromTo(mobileNavLinks,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power1.out' },
            "-=0.2")
        .eventCallback("onReverseComplete", () => {
            gsap.set(mobileNav, { display: 'none' });
        });

    menuToggle.addEventListener('click', () => {
        if (openMenuTl.reversed()) {
            openMenuTl.play();
        } else {
            openMenuTl.reverse();
        }
        document.body.classList.toggle('no-scroll', !openMenuTl.reversed());
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!openMenuTl.reversed()) {
                openMenuTl.reverse();
                document.body.classList.remove('no-scroll');
            }
        });
    });
}
