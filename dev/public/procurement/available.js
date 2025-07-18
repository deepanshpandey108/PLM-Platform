document.addEventListener("DOMContentLoaded", () => {
    const filterType = document.getElementById("filter-type");
    const filterValue = document.getElementById("filter-value");
    const resultsContainer = document.getElementById("results");
    let data = [];
  
    const fetchData = async () => {
      const response = await fetch("available.csv");
      const text = await response.text();
      const [headerLine, ...lines] = text.trim().split("\n");
      const headers = headerLine.split(",").map(h => h.trim());
  
      data = lines.map(line => {
        const values = line.split(",").map(v => v.trim());
        return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      });
  
      populateFilterOptions();
    };
  
    const populateFilterOptions = () => {
      const type = filterType.value;
      const key = type === "product" ? "name" : "location";
      const uniqueValues = [...new Set(data.map(item => item[key]))];
      filterValue.innerHTML = `<option value="">-- Select --</option>`;
      uniqueValues.forEach(val => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        filterValue.appendChild(opt);
      });
    };
  
    const renderTable = (filteredData) => {
      resultsContainer.innerHTML = "";
  
      if (filteredData.length === 0) {
        resultsContainer.innerHTML = `<p class="subtext">No matching records found.</p>`;
        return;
      }
  
      const wrapper = document.createElement("div");
      wrapper.className = "card-grid";
  
      filteredData.forEach(item => {
        const card = document.createElement("div");
        card.className = "info-card";
  
        card.innerHTML = `
          <h3>${item.name}</h3>
          <p><strong>Product ID:</strong> ${item["product id"]}</p>
          <p><strong>Fabric:</strong> ${item["fabric type"]}</p>
          <p><strong>Cost:</strong> ₹${item.cost}</p>
          <p><strong>Available:</strong> ${item.availability}</p>
          <p><strong>Location:</strong> ${item.location}</p>
        `;
  
        wrapper.appendChild(card);
      });
  
      resultsContainer.appendChild(wrapper);
    };
  
    // Event listeners
    filterType.addEventListener("change", populateFilterOptions);
  
    filterValue.addEventListener("change", () => {
      const type = filterType.value;
      const key = type === "product" ? "name" : "location";
      const value = filterValue.value;
  
      if (value) {
        const filtered = data.filter(item => item[key] === value);
        renderTable(filtered);
      } else {
        resultsContainer.innerHTML = "";
      }
    });
  
    fetchData();
  });
  