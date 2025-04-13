document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, JavaScript is running!");

  const tableBody = document.querySelector("#crypto-table tbody");
  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");


  let currentPage = 1;
  const itemsPerPage = 10; // Show 10 coins per page.
  let allCryptoData = []; // Holds all coins fetched from API.

 
  async function fetchCryptoData() {
    try {
      // The `corsproxy.io` prefix is used to avoid CORS issues.
      const apiUrl =
        "https://corsproxy.io/?" +
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&locale=en";

      const response = await fetch(apiUrl);
      const data = await response.json();

      // Make sure the data is in array form before storing.
      if (Array.isArray(data)) {
        allCryptoData = data;
      } else {
        console.error("API returned unexpected data:", data);
      }

      // Initial table render
      renderTable();
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  function renderTable() {
    // Clear any existing table rows
    tableBody.innerHTML = "";

    // Calculate the slice of data for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = allCryptoData.slice(startIndex, endIndex);

    // Create a table row for each coin on this page
    pageData.forEach((coin) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="coin-container">
          <img 
            src="${coin.image}" 
            alt="${coin.name}" 
            class="image" 
            width="30" 
            height="30"
          >
          <div class="coin-name-container">
            <p class="coin-symbol">${coin.symbol.toUpperCase()}</p>
            <p class="coin-name">${coin.name}</p>
          </div>
        </td>
        <td>
          <div class="price-container">
            <p class="current-price">
              ${coin.current_price.toFixed(2)}
            </p>
            <div class="high-low-group">
              <p class="high-low high">
                H: ${coin.high_24h.toFixed(2)}
              </p>
              <p class="high-low low">
                L: ${coin.low_24h.toFixed(2)}
              </p>
            </div>
          </div>
        </td>
        <td class="market-cap">
          <strong>${coin.market_cap.toLocaleString()}</strong>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Disable Back button on the first page
    backBtn.disabled = currentPage === 1;
    // Disable Next button if we've reached or passed the last batch of items
    nextBtn.disabled = endIndex >= allCryptoData.length;
  }

  
  // Moves to the previous page if possible, then re-renders the table.
  backBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });


  // Moves to the next page if possible, then re-renders the table.
  nextBtn.addEventListener("click", () => {
    if (currentPage * itemsPerPage < allCryptoData.length) {
      currentPage++;
      renderTable();
    }
  });

  // Fetch data once the DOM content is fully loaded
  fetchCryptoData();
});
