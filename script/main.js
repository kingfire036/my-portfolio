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

        function raf(time) {
            lenis.raf(time);
            ScrollTrigger.update(); // Ensure ScrollTrigger is updated
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        console.log("Lenis initialized.");

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return; // Ignore empty hashes
                
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    let offset = 0;
                    const header = document.querySelector('.site-header');
                    if (header) {
                        offset = -header.offsetHeight;
                    }
                    // For mobile nav, ensure it closes before scrolling
                    const mobileNav = document.getElementById('mobile-nav');
                    const menuToggle = document.getElementById('menu-toggle'); // Assuming you have access to openMenuTl or similar logic
                    if (mobileNav && mobileNav.classList.contains('active') && typeof window.closeMobileMenu === 'function' ) {
                         // If closeMobileMenu is defined in animations.js and returns a promise or handles timing
                        window.closeMobileMenu().then(() => {
                            lenis.scrollTo(targetElement, { offset: offset, duration: 1.5 });
                        });
                    } else {
                        lenis.scrollTo(targetElement, { offset: offset, duration: 1.5 });
                    }
                }
            });
        });
    }

    function setupBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true }); // Use passive listener for scroll

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        console.log("Back to top button initialized.");
    }


    function initializeSite() {
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

        setupLenis();
        setupBackToTopButton(); // Initialize back to top button

        setupHeroAnimation();
        setupMobileMenuAnimation();
        setupScrollAnimations(); // This should handle .animate-on-scroll for certificates too
        
        fetchGitHubRepos()
            .then(result => {
                if (result.success && result.count > 0) {
                    console.log(`Successfully loaded ${result.count} projects.`);
                    // setupProjectCardHover might need to be called *after* cards are in DOM
                    // GSAP animations in api.js's displayRepos should handle initial card animation
                    // setupProjectCardHover is for interactive hover, so it should be fine here
                    setupProjectCardHover(); 
                    ScrollTrigger.refresh(); // Refresh ScrollTrigger after dynamic content
                    console.log("Project card hovers initialized and ScrollTrigger refreshed for projects.");
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
        
        // Setup hover for static certificate cards if needed, or rely on CSS
        // If .certificate-card also needs GSAP hover, a new function like setupCertificateCardHover would be needed.
        // For now, CSS handles certificate card hover.
        // ScrollTrigger.refresh() is called after projects, should be sufficient for initial layout.

        console.log("Site initialization complete.");
    }

    // A short delay can help ensure all DOM elements are ready, especially for scripts loaded with defer
    setTimeout(initializeSite, 100); 
});
