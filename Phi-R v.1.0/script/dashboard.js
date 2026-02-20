// Pastikan SCRIPT_URL sudah terdefinisi
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzIL_2ScjfTJT8InR7zsJkkzkYu2UGieDAJZXS_eOx5aI-OOC7wgFpg9gwCjpeTEuQbg/exec";

// Variabel global untuk menyimpan instance chart
let lineChartInstance = null;
let radarChartInstance = null;

$(document).ready(function() {
    const username = localStorage.getItem('username');
    const nama = localStorage.getItem('nama');
    const skorTTI = localStorage.getItem('skor_tti');
    const jalur = localStorage.getItem('jalur');

    if (!username) {
        window.location.href = "index.html";
        return;
    }

    // Update UI
    $('#display-nama').text("Halo, " + nama + "!");
    $('#val-tti').text(skorTTI || 0);
    $('#val-jalur').text("Jalur: " + (jalur || "Belum ditentukan"));

    // Ambil Data Progres dari database
    fetchDataProgres(username);
});

// Fungsi untuk merender charts dengan data yang diberikan
function renderCharts(labelsMateri, dataDek, dataPol, dataAbs, dataAlg, totalDek, totalPol, totalAbs, totalAlg) {
    // --- RENDER LINE CHART ---
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    if (lineChartInstance) lineChartInstance.destroy();
    lineChartInstance = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: labelsMateri,
            datasets: [
                { label: 'Dekomposisi', data: dataDek, borderColor: '#ff6384', fill: false },
                { label: 'Pola', data: dataPol, borderColor: '#36a2eb', fill: false },
                { label: 'Abstraksi', data: dataAbs, borderColor: '#cc65fe', fill: false },
                { label: 'Algoritma', data: dataAlg, borderColor: '#ffce56', fill: false }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { color: '#fff' } },
                x: { ticks: { color: '#fff' } }
            },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    });

    // --- RENDER RADAR CHART ---
    const ctxRadar = document.getElementById('radarChart').getContext('2d');
    if (radarChartInstance) radarChartInstance.destroy();
    radarChartInstance = new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Algoritma'],
            datasets: [{
                label: 'Total Penguasaan CT',
                data: [totalDek, totalPol, totalAbs, totalAlg],
                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                borderColor: '#00d4ff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#fff' },
                    ticks: { display: false }
                }
            },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    });
}

function fetchDataProgres(user) {
    // --- TAMPILKAN CHART DENGAN DATA DEFAULT TERLEBIH DAHULU ---
    // Ini agar chart tetap terlihat meskipun sedang loading atau database kosong
    renderCharts(['Awal'], [0], [0], [0], [0], 0, 0, 0, 0);

    // --- AMBIL DATA DARI DATABASE ---
    $.getJSON(SCRIPT_URL + "?callback=?", {
        action: "get_progres",
        username: user
    }, function(data) {
        // --- LOGIKA DATA KOSONG (Agar Chart Tetap Muncul) ---
        let labelsMateri = ['Awal'];
        let dataDek = [0], dataPol = [0], dataAbs = [0], dataAlg = [0];
        let totalDek = 0, totalPol = 0, totalAbs = 0, totalAlg = 0;

        // Jika data dari database ADA, maka timpa data default di atas
        if (data && data.length > 0) {
            labelsMateri = data.map(item => item.materi);
            dataDek = data.map(item => item.dek);
            dataPol = data.map(item => item.pol);
            dataAbs = data.map(item => item.abs);
            dataAlg = data.map(item => item.alg);

            data.forEach(d => {
                totalDek += parseFloat(d.dek) || 0;
                totalPol += parseFloat(d.pol) || 0;
                totalAbs += parseFloat(d.abs) || 0;
                totalAlg += parseFloat(d.alg) || 0;
            });

            // --- LOGIKA RATA-RATA (FIX) ---
            // Kita bagi total skor dengan jumlah data (tes yang diikuti)
            const jumlahTes = data.length;
            totalDek = totalDek / jumlahTes;
            totalPol = totalPol / jumlahTes;
            totalAbs = totalAbs / jumlahTes;
            totalAlg = totalAlg / jumlahTes;
        }

        // --- RENDER ULANG CHART DENGAN DATA BARU ---
        renderCharts(labelsMateri, dataDek, dataPol, dataAbs, dataAlg, totalDek, totalPol, totalAbs, totalAlg);
    }).fail(function() {
        // Jika gagal mengambil data, chart sudah menampilkan data default
        console.log("Gagal mengambil data progres, menampilkan data default.");
    });
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}