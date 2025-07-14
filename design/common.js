const getDesigns = () => JSON.parse(localStorage.getItem('designs')) || [];
const saveDesigns = (designs) => localStorage.setItem('designs', JSON.stringify(designs));

document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    const role = localStorage.getItem('currentUserRole');
    if (!['design', 'management'].includes(role)) {
        alert('🚫 Unauthorized access.');
        window.location.href = '../auth/login.html';
        return;
    }

    // === 🌗 Theme Management ===
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    // === 💬 Feedback Display from Management ===
    const feedbackMessage = localStorage.getItem('designFeedback');
    const feedbackContainer = document.getElementById('feedback-container');
    const messageElement = document.getElementById('feedback-message');

    if (feedbackMessage && feedbackContainer && messageElement) {
        feedbackContainer.classList.remove('hidden');
        messageElement.textContent = feedbackMessage;

        // Optional: Dismiss Button Logic
        const closeBtn = feedbackContainer.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                feedbackContainer.classList.add('hidden');
                localStorage.removeItem('designFeedback');
            });
        }

        setTimeout(() => {
             feedbackContainer.classList.add('hidden');
             localStorage.removeItem('designFeedback');
         }, 10000);
    }
});
