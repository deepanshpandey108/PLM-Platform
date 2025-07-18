document.addEventListener('DOMContentLoaded', () => {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const form = document.getElementById('login-form');
  const errorBox = document.getElementById('error-box');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log('Attempting login for username:', username); // Debug

    try {
      const userCredential = await auth.signInWithEmailAndPassword(`${username}@plm-platform.com`, password);
      console.log('Firebase Auth success, user:', userCredential.user.email); // Debug
      const userDoc = await db.collection('users').doc(username).get();

      if (!userDoc.exists) {
        console.error('User document not found in Firestore:', username); // Debug
        showError('❌ User not found.');
        return;
      }

      const data = userDoc.data();
      console.log('Firestore user data:', data); // Debug
      localStorage.setItem('currentUserRole', data.role.trim());
      console.log('Stored role in localStorage:', localStorage.getItem('currentUserRole')); // Debug
      redirectToDashboard(data.role.trim());
    } catch (err) {
      console.error('Login error:', err); // Debug
      showError('❌ Invalid username or password.');
    }
  });

  function redirectToDashboard(role) {
    console.log('Redirecting to dashboard for role:', role); // Debug
    if (role === 'management') {
      window.location.href = '/management/index.html';
    } else if (role === 'design') {
      window.location.href = '/design/index.html';
    } else if (role === 'procurement') {
      window.location.href = '/procurement/index.html';
    } else {
      console.error('Invalid role:', role); // Debug
      showError('❌ Unknown role assigned.');
    }
  }

  function showError(message) {
    errorBox.classList.remove('hidden');
    errorBox.textContent = message;
    errorBox.classList.remove('shake');
    void errorBox.offsetWidth;
    errorBox.classList.add('shake');
  }
});