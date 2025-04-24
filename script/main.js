document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio Initialized");

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    setupHeroAnimation();
    setupScrollAnimations();
    fetchGitHubRepos().then(() => {
        console.log("GitHub repos loaded, refreshing ScrollTriggers for projects.");

        ScrollTrigger.refresh();

        gsap.utils.toArray('#projects-grid .project-card').forEach(card => {
            if (!card.scrollTrigger) {
                gsap.fromTo(card,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                            once: true
                        }
                    }
                );
                // Re-apply hover listeners if needed (anime.js ones are added directly in displayRepos or here)
                card.addEventListener('mouseenter', () => { /* ... anime hover ... */ });
                card.addEventListener('mouseleave', () => { /* ... anime hover revert ... */ });
            }
        });

    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = document.querySelector('.site-header').offsetHeight || 70; // Get header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
});