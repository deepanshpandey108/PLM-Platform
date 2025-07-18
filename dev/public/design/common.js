document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('currentUserRole');
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    if (role !== 'design' && role !== 'management') {
        console.warn('Unauthorized access. Redirecting to login...');
        window.location.href = '../auth/login.html';
        return;
    }

    console.log('Access granted for role:', role);
    initTheme();
    displayFeedback();

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        html.classList.toggle('dark', savedTheme !== 'light');

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                html.classList.toggle('dark');
                localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
            });
        }
    }

    function displayFeedback() {
        const msg = localStorage.getItem('designFeedback');
        const box = document.getElementById('feedback-container');
        const text = document.getElementById('feedback-message');

        if (msg && box && text) {
            text.textContent = msg;
            box.classList.remove('hidden');

            setTimeout(() => {
                box.classList.add('hidden');
                localStorage.removeItem('designFeedback');
            }, 10000);
        }
    }
});
