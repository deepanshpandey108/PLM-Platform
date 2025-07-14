document.addEventListener('DOMContentLoaded', () => {
  const designForm = document.getElementById('design-feedback-form');
  const procurementForm = document.getElementById('procurement-feedback-form');
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const role = localStorage.getItem('currentUserRole');
  if (role !== 'management') {
    alert('🚫 Unauthorized access. Redirecting to login...');
    window.location.href = '../auth/login.html';
    return;
  }

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
});
