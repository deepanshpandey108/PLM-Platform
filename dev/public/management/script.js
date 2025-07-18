document.addEventListener('DOMContentLoaded', () => {
  const role = localStorage.getItem('currentUserRole');
  console.log('Current role from localStorage:', role); // Debug
  if (!role || role !== 'management') {
    console.warn('Unauthorized access. Role:', role, 'Redirecting to login...');
    window.location.href = '/auth/login.html';
    return;
  }

  console.log('Access granted: MANAGEMENT');

  const designForm = document.getElementById('design-feedback-form');
  const procurementForm = document.getElementById('procurement-feedback-form');
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  initTheme();
  initFeedbackForms();

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

  function initFeedbackForms() {
    if (designForm) {
      designForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = designForm.querySelector('textarea').value.trim();
        if (message) {
          localStorage.setItem('designFeedback', message);
          alert(`✅ Feedback sent to Design Team:\n\n"${message}"`);
          designForm.reset();
          setTimeout(() => localStorage.removeItem('designFeedback'), 600000);
        }
      });
    }

    if (procurementForm) {
      procurementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = procurementForm.querySelector('textarea').value.trim();
        if (message) {
          localStorage.setItem('procurementFeedback', message);
          alert(`✅ Feedback sent to Procurement Team:\n\n"${message}"`);
          procurementForm.reset();
          setTimeout(() => localStorage.removeItem('procurementFeedback'), 600000);
        }
      });
    }
  }
});