document.addEventListener('DOMContentLoaded', () => {
  const role = localStorage.getItem('currentUserRole');
  
  if (role !== 'procurement' && role !== 'management') {
    console.warn('Unauthorized access. Redirecting...');
    window.location.href = '../auth/login.html';
    return;
  }

  console.log('Access granted for role:', role);

  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

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
    const msg = localStorage.getItem('procurementFeedback');
    const box = document.getElementById('feedback-container');
    const text = document.getElementById('feedback-message');

    if (msg && box && text) {
      text.textContent = msg;
      box.classList.remove('hidden');

      const closeBtn = box.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          box.classList.add('hidden');
          localStorage.removeItem('procurementFeedback');
        });
      }

      setTimeout(() => {
        box.classList.add('hidden');
        localStorage.removeItem('procurementFeedback');
      }, 10000);
    }
  }
});
