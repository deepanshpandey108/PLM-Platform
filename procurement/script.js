document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('search-input');
  const locationFilter = document.getElementById('location-filter');
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // === 🔐 Role-based Access Control ===
  const role = localStorage.getItem('currentUserRole');
  if (!['procurement', 'management'].includes(role)) {
    alert('🚫 Unauthorized access. Redirecting...');
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

  // === 📥 Load CSV and Render Data ===
  fetch('data.csv')
    .then(res => res.text())
    .then(csv => {
      const rows = csv.trim().split('\n');
      const headers = rows.shift().split(',');
      const data = rows.map(row => {
        const values = row.split(',');
        return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i]?.trim() || '']));
      });

      renderTable(data);
      renderCharts(data);

      // === 🔎 Filter - Search ===
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const query = searchInput.value.toLowerCase();
          const filtered = data.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item['fabric type'].toLowerCase().includes(query)
          );
          renderTable(filtered);
        });
      }

      // === 🌍 Filter - Location ===
      if (locationFilter) {
        locationFilter.addEventListener('change', () => {
          const value = locationFilter.value;
          const filtered = value
            ? data.filter(item => item.location.toLowerCase() === value.toLowerCase())
            : data;
          renderTable(filtered);
        });
      }
    });

  // === 📊 Table Renderer ===
  function renderTable(data) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      ['product id', 'name', 'fabric type', 'cost', 'availabilty', 'location'].forEach(col => {
        const td = document.createElement('td');
        td.className = 'py-2 px-4';
        td.textContent = row[col];
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  }

  // === 📈 Chart Renderer ===
  function renderCharts(data) {
    if (!window.Chart) return;

    const availData = data.reduce((acc, cur) => {
      acc[cur.availabilty] = (acc[cur.availabilty] || 0) + 1;
      return acc;
    }, {});

    new Chart(document.getElementById('availabilityChart'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(availData),
        datasets: [{
          data: Object.values(availData),
          backgroundColor: ['#22c55e', '#ef4444']
        }]
      }
    });

    const locationData = data.reduce((acc, cur) => {
      acc[cur.location] = (acc[cur.location] || 0) + 1;
      return acc;
    }, {});

    new Chart(document.getElementById('locationChart'), {
      type: 'bar',
      data: {
        labels: Object.keys(locationData),
        datasets: [{
          label: '# of Items',
          data: Object.values(locationData),
          backgroundColor: '#6366f1'
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // === 💬 Feedback Display ===
  const feedbackMessage = localStorage.getItem('procurementFeedback');
  const feedbackContainer = document.getElementById('feedback-container');
  const messageElement = document.getElementById('feedback-message');

  if (feedbackMessage && feedbackContainer && messageElement) {
    feedbackContainer.classList.remove('hidden');
    messageElement.textContent = feedbackMessage;
  }
});
