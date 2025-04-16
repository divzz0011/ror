const statusText = document.getElementById('status');
const locationInfo = document.getElementById('location-info');
const mapDiv = document.getElementById('map');

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    statusText.textContent = "Lokasi berhasil dideteksi!";
    locationInfo.innerHTML = `Koordinat: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await res.json();
    const city = data.address.city || data.address.town || data.address.village || 'Tidak diketahui';

    locationInfo.innerHTML += `<br>Kota: ${city}`;

    mapDiv.innerHTML = `<iframe width="100%" height="100%" frameborder="0"
      src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}">
    </iframe>`;

    // Kirim ke backend
    fetch('/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude,
        longitude,
        city,
        userAgent: navigator.userAgent,
        time: new Date().toISOString()
      })
    });

  }, (error) => {
    statusText.textContent = "Gagal mendapatkan lokasi: " + error.message;
  });
} else {
  statusText.textContent = "Geolocation tidak didukung browser ini.";
}