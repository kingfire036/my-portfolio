const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const toggleIcon = themeToggleBtn.querySelector('i');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
    }
}

if (currentTheme) {
    applyTheme(currentTheme);
} else {
    applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
}

themeToggleBtn.addEventListener('click', () => {
    const newTheme = document.documentElement.hasAttribute('data-theme') ? 'light' : 'dark';
    applyTheme(newTheme);
});

prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});