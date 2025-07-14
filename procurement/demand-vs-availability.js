const productSelect = document.getElementById("product-select");
const locationSelect = document.getElementById("location-select");
const compareBtn = document.getElementById("compare-btn");
const comparisonResults = document.getElementById("comparison-results");

let demandData = [];
let availableData = [];

const loadCSV = (file, callback) => {
  Papa.parse(file, {
    header: true,
    download: true,
    skipEmptyLines: true,
    complete: results => callback(results.data)
  });
};

const populateDropdowns = () => {
  const productSet = new Set();
  const locationSet = new Set();

  [...demandData, ...availableData].forEach(item => {
    productSet.add(item.name);
    locationSet.add(item.location);
  });

  productSet.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    productSelect.appendChild(opt);
  });

  locationSet.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    locationSelect.appendChild(opt);
  });
};

const compareData = () => {
  const selectedProduct = productSelect.value;
  const selectedLocation = locationSelect.value;

  comparisonResults.innerHTML = "";

  // Filter data
  const filteredDemand = demandData.filter(item =>
    (selectedProduct === "" || item.name === selectedProduct) &&
    (selectedLocation === "" || item.location === selectedLocation)
  );

  const filteredAvailable = availableData.filter(item =>
    (selectedProduct === "" || item.name === selectedProduct) &&
    (selectedLocation === "" || item.location === selectedLocation)
  );

  // Merge and display
  const combined = [];

  filteredDemand.forEach(d => {
    const match = filteredAvailable.find(a =>
      a.name === d.name && a.location === d.location
    );

    combined.push({
      name: d.name,
      location: d.location,
      demand: Number(d.demand),
      availability: match ? Number(match.availabilty) : 0
    });
  });

  if (combined.length === 0) {
    comparisonResults.innerHTML = "<p class='subtext'>No matching data found.</p>";
    return;
  }

  const table = document.createElement("table");
  table.className = "comparison-table";

  const headerRow = `
    <thead><tr>
      <th>Product</th>
      <th>Location</th>
      <th>Demand</th>
      <th>Availability</th>
      <th>Status</th>
    </tr></thead>
  `;
  table.innerHTML = headerRow;

  const tbody = document.createElement("tbody");

  combined.forEach(row => {
    const status =
      row.availability >= row.demand
        ? `<span class="status-good">✅ Sufficient</span>`
        : `<span class="status-bad">⚠️ Insufficient</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.location}</td>
      <td>${row.demand}</td>
      <td>${row.availability}</td>
      <td>${status}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  comparisonResults.appendChild(table);
};

loadCSV("demand.csv", data => {
  demandData = data;
  loadCSV("available.csv", avail => {
    availableData = avail;
    populateDropdowns();
    compareData(); // Show default comparison
  });
});

compareBtn.addEventListener("click", compareData);
