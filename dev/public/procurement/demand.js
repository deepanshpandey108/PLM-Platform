document.addEventListener("DOMContentLoaded", () => {
    const filterType = document.getElementById("filter-type");
    const filterValue = document.getElementById("filter-value");
    const resultsContainer = document.getElementById("results");
    let data = [];
  
    const fetchData = async () => {
      const response = await fetch("demand.csv");
      const text = await response.text();
      const [headerLine, ...lines] = text.trim().split("\n");
      const headers = headerLine.split(",").map(h => h.trim());
  
      data = lines.map(line => {
        const values = line.split(",").map(v => v.trim());
        return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      });
  
      // Sort by demand (desc)
      data.sort((a, b) => Number(b.demand) - Number(a.demand));
  
      populateFilterOptions();
      renderTable(data);
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
          resultsContainer.innerHTML = `<p class="subtext">No matching demand found.</p>`;
          return;
        }
      
        const wrapper = document.createElement("div");
        wrapper.className = "card-grid";
      
        filteredData.forEach(item => {
          const demand = Number(item.demand);
          let cardClass = "info-card";
      
          if (demand >= 200) {
            cardClass += " high-demand";
          } else if (demand >= 100) {
            cardClass += " medium-demand";
          } else {
            cardClass += " low-demand";
          }
      
          const card = document.createElement("div");
          card.className = cardClass;
      
          card.innerHTML = `
            <h3>${item.name}</h3>
            <p><strong>Product ID:</strong> ${item["product id"]}</p>
            <p><strong>Demand:</strong> ${item.demand}</p>
            <p><strong>Location:</strong> ${item.location}</p>
          `;
      
          wrapper.appendChild(card);
        });
      
        resultsContainer.appendChild(wrapper);
      };
      
  
    filterType.addEventListener("change", populateFilterOptions);
  
    filterValue.addEventListener("change", () => {
      const type = filterType.value;
      const key = type === "product" ? "name" : "location";
      const value = filterValue.value;
  
      if (value) {
        const filtered = data.filter(item => item[key] === value);
        renderTable(filtered);
      } else {
        renderTable(data);
      }
    });
  
    fetchData();
  });
  