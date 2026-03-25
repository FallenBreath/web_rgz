const themeToggle = document.getElementById('theme-toggle');

function applySavedTheme() {
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.textContent = 'Светлая тема';
        }
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');

        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
    });
}

applySavedTheme();