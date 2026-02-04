document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('next-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark');
    updateThemeButtonText();

    nextBtn?.addEventListener('click', () => {
        alert('You have successfully signed In!');
        window.location.href = 'index.html';
    });

    themeToggleBtn?.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeButtonText();
    });

    function updateThemeButtonText() {
        if (!themeToggleBtn) return;
        const isDark = document.body.classList.contains('dark');
        themeToggleBtn.textContent = isDark ? 'Light Theme' : 'Dark Theme';
    }
});