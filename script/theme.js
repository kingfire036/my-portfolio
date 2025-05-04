const themeToggleBtn = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
    const toggleIcon = themeToggleBtn?.querySelector('i');

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-sun');
            toggleIcon.classList.add('fa-moon');
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-moon');
            toggleIcon.classList.add('fa-sun');
        }
    }


    if (typeof window.updateParticleColors === 'function') {
        window.updateParticleColors();
    }
}

function initializeTheme() {
    if (!themeToggleBtn) {
        console.warn("Theme toggle button not found.");
        const currentTheme = localStorage.getItem('theme');
        applyTheme(currentTheme ? currentTheme : (prefersDarkScheme.matches ? 'dark' : 'light'));
        return;
    }

    const currentTheme = localStorage.getItem('theme');
    applyTheme(currentTheme ? currentTheme : (prefersDarkScheme.matches ? 'dark' : 'light'));

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.hasAttribute('data-theme') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

initializeTheme();
