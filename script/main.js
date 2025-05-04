document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio Initialized");

    let lenis;
    function setupLenis() {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        console.log("Lenis initialized.");

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    lenis.scrollTo(targetElement, {
                        offset: -document.querySelector('.site-header').offsetHeight,
                        duration: 1.5
                    });
                }
            });
        });
    }


    function initializeSite() {
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

        setupLenis();

        setupHeroAnimation();
        setupMobileMenuAnimation();
        setupScrollAnimations();
        fetchGitHubRepos()
            .then(result => {
                if (result.success && result.count > 0) {
                    console.log(`Successfully loaded ${result.count} projects.`);
                    setupProjectCardHover();
                    ScrollTrigger.refresh();
                    console.log("Project card hovers initialized and ScrollTrigger refreshed.");
                } else if (result.success && result.count === 0) {
                    console.log("No projects loaded (check configuration).");
                    ScrollTrigger.refresh();
                } else {
                    console.error("Failed to load projects:", result.error);
                    ScrollTrigger.refresh();
                }
            })
            .catch(error => {
                console.error("Error during GitHub repo fetch process:", error);
                ScrollTrigger.refresh();
            });

        console.log("Site initialization complete.");
    }

    setTimeout(initializeSite, 100);
});
