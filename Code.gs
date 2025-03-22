function doGet(e) {
  // Check if there's a parameter for 'action'
  if (e.parameter.action === 'daftar-kota') {
    return getDaftarKota();
  }
  
  // Check if there's a parameter for 'kota'
  if (e.parameter.kota) {
    return getJadwalSholat(e.parameter.kota);
  }
  
  // If no parameters, serve the web app with inline HTML
  return HtmlService.createHtmlOutput(getHtmlContent())
    .setTitle('Jadwal Sholat Digital')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getDaftarKota() {
  try {
    // Get cities from our helper function
    const cities = getDaftarKotaList();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      total: cities.length,
      data: cities
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getJadwalSholat(kota) {
  try {
    // Get list of available cities
    const cities = getDaftarKotaList();
    
    // Check if kota exists in our data
    const city = cities.find(city => city.name.toLowerCase() === kota.toLowerCase());
    
    if (!city) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: `Kota '${kota}' tidak ditemukan. Gunakan action=daftar-kota untuk melihat daftar kota yang tersedia.`
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Format the city name for display (capitalize first letter)
    const kotaDisplay = kota.charAt(0).toUpperCase() + kota.slice(1);
    
    // Get current date in Indonesian format
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const tanggal = today.toLocaleDateString('id-ID', options);
    
    // You would fetch actual prayer times from an API or calculate them
    // This is just sample data for demonstration
    let jadwal = {};
    
    if (kota.toLowerCase() === "acehbarat") {
      jadwal = {
        imsyak: "05:14",
        shubuh: "05:24",
        terbit: "06:37",
        dhuha: "07:01",
        dzuhur: "12:45",
        ashr: "15:52",
        magrib: "18:48",
        isya: "19:57"
      };
    } else if (kota.toLowerCase() === "yogyakarta") {
      jadwal = {
        imsyak: "04:27",
        shubuh: "04:37",
        terbit: "05:51",
        dhuha: "06:17",
        dzuhur: "12:01",
        ashr: "15:11",
        magrib: "18:06",
        isya: "19:16"
      };
    } else if (kota.toLowerCase() === "jakarta") {
      jadwal = {
        imsyak: "04:36",
        shubuh: "04:46",
        terbit: "06:00",
        dhuha: "06:27",
        dzuhur: "12:10",
        ashr: "15:16",
        magrib: "18:15",
        isya: "19:25"
      };
    } else {
      // Generate some mock data based on the city id
      // In a real app, this would be replaced with actual calculations or API calls
      const cityId = parseInt(city.id, 10);
      const baseMinutes = (cityId % 30) * 2; // Just to generate some variation
      
      jadwal = {
        imsyak: formatTime(4, 30 + baseMinutes % 30),
        shubuh: formatTime(4, 40 + baseMinutes % 30),
        terbit: formatTime(6, 0 + baseMinutes % 40),
        dhuha: formatTime(6, 30 + baseMinutes % 30),
        dzuhur: formatTime(12, 0 + baseMinutes % 20),
        ashr: formatTime(15, 0 + baseMinutes % 30),
        magrib: formatTime(18, 0 + baseMinutes % 20),
        isya: formatTime(19, 10 + baseMinutes % 20)
      };
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      data: {
        kota: kotaDisplay,
        tanggal: tanggal,
        jadwal: jadwal
      }
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper function to format time with leading zeros
function formatTime(hours, minutes) {
  return `${String(hours).padStart(2, '0')}:${String(Math.floor(minutes)).padStart(2, '0')}`;
}

// Function to get the HTML content as a string
function getHtmlContent() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jadwal Sholat - Temukan Waktu Sholat di Kota Anda</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    .prayer-time-card {
      transition: all 0.3s ease;
    }
    .prayer-time-card:hover {
      transform: translateY(-5px);
    }
    .loader {
      border-top-color: #3498db;
      animation: spinner 1.5s linear infinite;
    }
    @keyframes spinner {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body class="bg-gradient-to-r from-emerald-50 to-teal-50 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <header class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
        <i class="fas fa-mosque mr-2"></i>Jadwal Sholat Digital
      </h1>
      <p class="text-gray-600 text-lg">Temukan jadwal sholat terkini untuk kota Anda</p>
    </header>

    <!-- City Search -->
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <div class="mb-4">
        <label for="citySearch" class="block text-gray-700 font-medium mb-2">
          <i class="fas fa-map-marker-alt mr-2"></i>Cari Kota
        </label>
        <div class="relative">
          <input type="text" id="citySearch" 
            class="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            placeholder="Masukkan nama kota..." list="citySuggestions">
          <datalist id="citySuggestions">
            <!-- City suggestions will be populated here -->
          </datalist>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <i class="fas fa-search text-gray-400"></i>
          </div>
        </div>
      </div>
      <button id="searchButton" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
        <i class="fas fa-search mr-2"></i>Cari Jadwal Sholat
      </button>
    </div>

    <!-- Loading Indicator -->
    <div id="loadingIndicator" class="hidden flex justify-center my-8">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>

    <!-- Date Display -->
    <div id="dateDisplay" class="hidden text-center mb-6">
      <div class="inline-block bg-white px-4 py-2 rounded-full shadow">
        <span id="currentDate" class="text-emerald-800 font-semibold">
          <i class="far fa-calendar-alt mr-2"></i>Sabtu, 22 Maret 2025
        </span>
      </div>
    </div>

    <!-- Prayer Times Cards -->
    <div id="prayerTimesContainer" class="hidden max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-center text-emerald-800 mb-4">
          <span id="cityName">Kota</span>
          <i class="fas fa-map-pin ml-2 text-emerald-600"></i>
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Imsyak -->
          <div class="prayer-time-card bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 text-center shadow">
            <div class="text-indigo-700 text-xl mb-1">
              <i class="fas fa-moon"></i>
            </div>
            <h3 class="text-gray-700 font-medium">Imsyak</h3>
            <p id="imsyak" class="text-xl font-bold text-indigo-700">05:14</p>
          </div>
          
          <!-- Shubuh -->
          <div class="prayer-time-card bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 text-center shadow">
            <div class="text-blue-700 text-xl mb-1">
              <i class="fas fa-cloud-sun"></i>
            </div>
            <h3 class="text-gray-700 font-medium">Shubuh</h3>
            <p id="shubuh" class="text-xl font-bold text-blue-700">05:24</p>
          </div>
          
          <!-- Terbit -->
          <div class="prayer-time-card bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 text-center shadow">
            <div class="text-cyan-700 text-xl mb-1">
              <i class="fas fa-sun"></i>
            </div>
            <h3 class="text-gray-700 font-medium">Terbit</h3>
            <p id="terbit" class="text-xl font-bold text-cyan-700">06:37</p>
          </div>
          
          <!-- Dhuha -->
          <div class="prayer-time-card bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-4 text-center shadow">
            <div class="text-teal-700 text-xl mb-1">
              <i class="fas fa-sun"></i>
            </div>
            <h3 class="text-gray-700 font-medium">Dhuha</h3>
            <p id="dhuha" class="text-xl font-bold text-teal-700">07:01</p>
          </div>
          
          <!-- Dzuhur -->
          <div class="prayer-time-card bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-4 text-center shadow">
            <div class="text-emerald-700 text-xl mb-1">
              <i class="fas fa-sun"></i>
            </div>
            <h3 class="text-gray-700 font-medium">Dzuhur</h3>
            <p id="dzuhur" class="text-xl font-bold text-emerald-700">12:45</p>
          </div>
          
          <!-- Ashr -->
          <div class="prayer-time-card bg-gradient-to-br from-emerald-50 to-yellow-50 rounded-lg p-4 text-center shadow">
            <div class="text-yellow-700 text-xl mb-1">
              <i class="fas fa-sun"></i>
            </div>
            <h3 class="text-gray-700 font-medium">Ashr</h3>
            <p id="ashr" class="text-xl font-bold text-yellow-700">15:52</p>
          </div>
          
          <!-- Magrib -->
          <div class="prayer-time-card bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 text-center shadow">
            <div class="text-orange-700 text-xl mb-1">
              <i class="fas fa-sunset"></i>
            </div>
            <h3 class="text-gray-700 font-medium">Magrib</h3>
            <p id="magrib" class="text-xl font-bold text-orange-700">18:48</p>
          </div>
          
          <!-- Isya -->
          <div class="prayer-time-card bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 text-center shadow">
            <div class="text-red-700 text-xl mb-1">
              <i class="fas fa-moon"></i>
            </div>
            <h3 class="text-gray-700 font-medium">Isya</h3>
            <p id="isya" class="text-xl font-bold text-red-700">19:57</p>
          </div>
        </div>
      </div>
      
      <!-- Next Prayer Time -->
      <div id="nextPrayerContainer" class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-center text-white">
        <h3 class="text-xl font-medium mb-2">
          <i class="fas fa-clock mr-2"></i>Waktu Sholat Berikutnya
        </h3>
        <p id="nextPrayer" class="text-3xl font-bold">Magrib - 18:48</p>
        <p id="countdown" class="text-xl mt-2">dalam 2 jam 30 menit</p>
      </div>
    </div>
    
    <!-- Error Message -->
    <div id="errorMessage" class="hidden max-w-md mx-auto mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="ml-3">
          <p id="errorText" class="text-sm">Terjadi kesalahan saat memuat data. Silakan coba lagi.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Info/Tips Section -->
  <section class="bg-white py-8 mt-12">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold text-center text-emerald-800 mb-8">
        <i class="fas fa-info-circle mr-2"></i>Informasi Sholat
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-emerald-50 p-6 rounded-lg shadow">
          <h3 class="font-bold text-emerald-700 mb-2">
            <i class="fas fa-book-open mr-2"></i>Keutamaan Sholat Tepat Waktu
          </h3>
          <p class="text-gray-700">
            Sholat pada awal waktu adalah amalan yang paling dicintai Allah SWT. Ingatlah untuk selalu berusaha menunaikan sholat tepat pada waktunya.
          </p>
        </div>
        
        <div class="bg-emerald-50 p-6 rounded-lg shadow">
          <h3 class="font-bold text-emerald-700 mb-2">
            <i class="fas fa-hand-point-up mr-2"></i>Waktu-waktu Terlarang
          </h3>
          <p class="text-gray-700">
            Hindari sholat saat matahari terbit, saat matahari tepat di tengah langit, dan saat matahari terbenam kecuali sholat wajib atau qadha.
          </p>
        </div>
        
        <div class="bg-emerald-50 p-6 rounded-lg shadow">
          <h3 class="font-bold text-emerald-700 mb-2">
            <i class="fas fa-compass mr-2"></i>Arah Kiblat
          </h3>
          <p class="text-gray-700">
            Pastikan arah kiblat Anda benar sebelum sholat. Anda bisa menggunakan aplikasi kompas kiblat di smartphone atau mencari petunjuk di masjid terdekat.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-emerald-800 text-white py-6 mt-12">
    <div class="container mx-auto px-4 text-center">
      <p class="mb-2">
        <i class="fas fa-heart"></i> Jadwal Sholat Digital &copy; 2025
      </p>
      <p class="text-emerald-200 text-sm">
        Dibuat dengan niat baik untuk memudahkan umat muslim dalam menunaikan ibadah
      </p>
    </div>
  </footer>

  <script>
    // API URLs
    const CITIES_API_URL = "https://script.google.com/macros/s/AKfycbx8CtuEFQrYxM5sF2pZYvjrcIQa4Mj25lO6BUVqFHrhURw05bg06dBtpeYtvax5NIi1/exec?action=daftar-kota";
    const PRAYER_TIMES_API_BASE_URL = "https://script.google.com/macros/s/AKfycbx8CtuEFQrYxM5sF2pZYvjrcIQa4Mj25lO6BUVqFHrhURw05bg06dBtpeYtvax5NIi1/exec?kota=";
    
    // DOM elements
    const citySearch = document.getElementById('citySearch');
    const citySuggestions = document.getElementById('citySuggestions');
    const searchButton = document.getElementById('searchButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const dateDisplay = document.getElementById('dateDisplay');
    const currentDate = document.getElementById('currentDate');
    const cityName = document.getElementById('cityName');
    const prayerTimesContainer = document.getElementById('prayerTimesContainer');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const nextPrayerContainer = document.getElementById('nextPrayerContainer');
    const nextPrayer = document.getElementById('nextPrayer');
    const countdown = document.getElementById('countdown');
    
    // Prayer time elements
    const imsyak = document.getElementById('imsyak');
    const shubuh = document.getElementById('shubuh');
    const terbit = document.getElementById('terbit');
    const dhuha = document.getElementById('dhuha');
    const dzuhur = document.getElementById('dzuhur');
    const ashr = document.getElementById('ashr');
    const magrib = document.getElementById('magrib');
    const isya = document.getElementById('isya');
    
    // Store city data
    let cityData = [];
    
    // Initialize countdown interval
    let countdownInterval = null;
    
    // Load cities on page load
    document.addEventListener('DOMContentLoaded', loadCities);
    
    // Add event listeners
    searchButton.addEventListener('click', fetchPrayerTimes);
    
    // Allow pressing Enter to search
    citySearch.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        fetchPrayerTimes();
      }
    });
    
    // Function to load cities and populate datalist
    async function loadCities() {
      try {
        showLoading(true);
        const response = await fetch(CITIES_API_URL);
        const data = await response.json();
        
        if (data.status === "success") {
          // Sort cities alphabetically
          cityData = data.data.sort((a, b) => a.name.localeCompare(b.name));
          
          // Populate datalist for autocomplete
          cityData.forEach(city => {
            const option = document.createElement('option');
            option.value = city.name;
            citySuggestions.appendChild(option);
          });
        } else {
          showError("Terjadi kesalahan saat memuat daftar kota. Silakan coba lagi.");
        }
      } catch (error) {
        console.error('Error loading cities:', error);
        showError("Tidak dapat memuat daftar kota. Periksa koneksi internet Anda.");
      } finally {
        showLoading(false);
      }
    }
    
    // Function to fetch prayer times
    async function fetchPrayerTimes() {
      const searchQuery = citySearch.value.trim().toLowerCase();
      
      if (!searchQuery) {
        alert('Silakan masukkan nama kota terlebih dahulu');
        return;
      }
      
      try {
        showLoading(true);
        hideError();
        prayerTimesContainer.classList.add('hidden');
        dateDisplay.classList.add('hidden');
        
        const response = await fetch(PRAYER_TIMES_API_BASE_URL + searchQuery);
        const data = await response.json();
        
        if (data.status === "success") {
          updatePrayerTimes(data.data);
        } else {
          showError(data.message || "Kota tidak ditemukan. Pastikan ejaan sudah benar atau coba kota lain.");
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        showError("Terjadi kesalahan. Periksa koneksi internet Anda atau coba lagi nanti.");
      } finally {
        showLoading(false);
      }
    }
    
    // Function to update prayer times UI
    function updatePrayerTimes(data) {
      // Update city and date
      cityName.textContent = data.kota;
      currentDate.innerHTML = \`<i class="far fa-calendar-alt mr-2"></i>\${data.tanggal}\`;
      
      // Update prayer times
      imsyak.textContent = data.jadwal.imsyak;
      shubuh.textContent = data.jadwal.shubuh;
      terbit.textContent = data.jadwal.terbit;
      dhuha.textContent = data.jadwal.dhuha;
      dzuhur.textContent = data.jadwal.dzuhur;
      ashr.textContent = data.jadwal.ashr;
      magrib.textContent = data.jadwal.magrib;
      isya.textContent = data.jadwal.isya;
      
      // Show prayer times container and date
      dateDisplay.classList.remove('hidden');
      prayerTimesContainer.classList.remove('hidden');
      
      // Update next prayer info
      updateNextPrayer(data.jadwal);
    }
    
    // Function to update next prayer information
    function updateNextPrayer(jadwal) {
      const now = new Date();
      const prayers = [
        { name: 'Imsyak', time: jadwal.imsyak },
        { name: 'Shubuh', time: jadwal.shubuh },
        { name: 'Terbit', time: jadwal.terbit },
        { name: 'Dhuha', time: jadwal.dhuha },
        { name: 'Dzuhur', time: jadwal.dzuhur },
        { name: 'Ashr', time: jadwal.ashr },
        { name: 'Magrib', time: jadwal.magrib },
        { name: 'Isya', time: jadwal.isya }
      ];
      
      // Convert current time to minutes
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      
      // Find next prayer
      let nextPrayerObj = null;
      let minDiff = Infinity;
      
      prayers.forEach(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTimeInMinutes = hours * 60 + minutes;
        
        if (prayerTimeInMinutes > currentTimeInMinutes && prayerTimeInMinutes - currentTimeInMinutes < minDiff) {
          minDiff = prayerTimeInMinutes - currentTimeInMinutes;
          nextPrayerObj = prayer;
        }
      });
      
      // If no next prayer today, use first prayer for tomorrow
      if (!nextPrayerObj) {
        nextPrayerObj = prayers[0];
        minDiff = (24 * 60) - currentTimeInMinutes + (nextPrayerObj.time.split(':').map(Number)[0] * 60 + nextPrayerObj.time.split(':').map(Number)[1]);
      }
      
      // Update UI with next prayer
      nextPrayer.textContent = \`\${nextPrayerObj.name} - \${nextPrayerObj.time}\`;
      
      // Start countdown
      startCountdown(minDiff);
    }
    
    // Function to start countdown
    function startCountdown(minutesDiff) {
      // Clear any existing interval
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      
      // Initial update
      updateCountdown(minutesDiff);
      
      // Start interval for countdown
      countdownInterval = setInterval(() => {
        minutesDiff--;
        if (minutesDiff <= 0) {
          clearInterval(countdownInterval);
          fetchPrayerTimes(); // Refresh data
        } else {
          updateCountdown(minutesDiff);
        }
      }, 60000); // Update every minute
    }
    
    // Function to update countdown display
    function updateCountdown(minutesDiff) {
      const hours = Math.floor(minutesDiff / 60);
      const minutes = minutesDiff % 60;
      
      let countdownText = '';
      if (hours > 0) {
        countdownText += \`\${hours} jam \`;
      }
      countdownText += \`\${minutes} menit lagi\`;
      
      countdown.textContent = countdownText;
    }
    
    // Helper functions
    function showLoading(show) {
      if (show) {
        loadingIndicator.classList.remove('hidden');
      } else {
        loadingIndicator.classList.add('hidden');
      }
    }
    
    function showError(message = "Terjadi kesalahan saat memuat data. Silakan coba lagi.") {
      errorText.textContent = message;
      errorMessage.classList.remove('hidden');
      
      // Auto scroll to error message
      errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function hideError() {
      errorMessage.classList.add('hidden');
    }
  </script>
</body>
</html>`;
}

// Helper function to get the list of cities without wrapping in ContentService
function getDaftarKotaList() {
  // This is a sample list of cities - in a real app, this would come from a database or external API
  return [
    { id: "317", name: "acehbarat" },
    { id: "318", name: "acehbesar" },
    { id: "319", name: "acehselatan" },
    { id: "320", name: "acehtengah" },
    { id: "321", name: "acehtimur" },
    { id: "322", name: "acehutara" },
    { id: "323", name: "agam" },
    { id: "324", name: "alor" },
    { id: "325", name: "ambon" },
    { id: "326", name: "asahan" },
    { id: "327", name: "asmat" },
    // Add more cities as needed
    { id: "307", name: "yogyakarta" },
    { id: "308", name: "jakarta" },
    { id: "309", name: "bandung" },
    { id: "310", name: "surabaya" },
    { id: "311", name: "medan" },
    { id: "312", name: "makassar" },
    { id: "313", name: "semarang" },
    { id: "314", name: "palembang" },
    { id: "315", name: "balikpapan" },
    { id: "316", name: "manado" }
  ];
}
