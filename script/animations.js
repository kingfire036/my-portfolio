gsap.registerPlugin(ScrollTrigger);

function setupHeroAnimation() {
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
        .to("#hero-name", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to("#hero-title", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .to("#hero-tagline", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .to(".cta-button", { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3");

    const heroSection = document.getElementById('hero');
    if (heroSection && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = heroSection;
            const xPos = (clientX / offsetWidth - 0.5) * 30;
            const yPos = (clientY / offsetHeight - 0.5) * 20;

            gsap.to(['#hero-name', '#hero-title', '#hero-tagline'], {
                x: -xPos,
                y: -yPos,
                duration: 0.8,
                ease: 'power1.out'
            });
        });
    }
}

function setupScrollAnimations() {
    gsap.utils.toArray('.animate-on-scroll').forEach(element => {
        let delay = 0;
        let startPos = "top 85%";
        let xFrom = 0;
        let yFrom = 30;

        if (element.classList.contains('fade-in-left')) {
            xFrom = -30; yFrom = 0;
        }
        if (element.classList.contains('fade-in-right')) {
            xFrom = 30; yFrom = 0;
        }

        gsap.fromTo(element,
            { opacity: 0, y: yFrom, x: xFrom },
            {
                opacity: 1,
                y: 0,
                x: 0,
                duration: 0.8,
                delay: delay,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: startPos,
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    });

    const timeline = document.querySelector('.education-timeline');
    if (timeline) {
        const line = timeline.querySelector('.timeline-line');
        const items = gsap.utils.toArray('.timeline-item');

        gsap.to(line, {
            scaleY: 1,
            duration: items.length * 0.5,
            ease: 'none',
            scrollTrigger: {
                trigger: timeline,
                start: 'top 70%',
                end: 'bottom 70%',
                scrub: 1
            }
        });

        items.forEach(item => {
            gsap.to(item, {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        });
    }

    gsap.utils.toArray('.skill-bar-inner').forEach(bar => {
        const level = bar.getAttribute('data-level') || '0%';
        gsap.to(bar, {
            width: level,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: bar.closest('.skill-item'),
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    });

    gsap.utils.toArray('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                translateY: -8,
                scale: 1.03,
                boxShadow: '0 15px 30px var(--card-shadow)',
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                translateY: 0,
                scale: 1,
                boxShadow: '0 5px 15px var(--card-shadow)',
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });

    gsap.utils.toArray('.social-icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            anime({
                targets: icon,
                scale: 1.2,
                rotate: '5deg',
                color: 'var(--accent-primary)',
                duration: 200,
                easing: 'easeOutSine'
            });
        });
        icon.addEventListener('mouseleave', () => {
            anime({
                targets: icon,
                scale: 1,
                rotate: '0deg',
                color: 'var(--text-secondary)',
                duration: 200,
                easing: 'easeOutSine'
            });
        });
    });

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