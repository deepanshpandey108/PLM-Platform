const users = [
  { username: 'admin', password: 'admin123', role: 'management' },
  { username: 'design', password: 'design123', role: 'design' },
  { username: 'procure', password: 'procure123', role: 'procurement' }
];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const errorBox = document.getElementById('error-box');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const uname = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    const user = users.find(u => u.username === uname && u.password === pass);

    if (user) {
      localStorage.setItem('currentUserRole', user.role);

      // Redirect based on role
      switch (user.role) {
        case 'management':
          window.location.href = '../management/index.html';
          break;
        case 'design':
          window.location.href = '../design/index.html';
          break;
        case 'procurement':
          window.location.href = '../procurement/index.html';
          break;
      }
    } else {
      // Show animated error message
      errorBox.classList.remove('hidden');
      errorBox.textContent = '❌ Invalid username or password';

      // Optionally add shake animation
      errorBox.classList.remove('shake');
      void errorBox.offsetWidth; // Trigger reflow
      errorBox.classList.add('shake');
    }
  });
});
