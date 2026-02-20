const questions = [
    {
        pilar: "abstraksi",
        image: "https://via.placeholder.com/600x300?text=Gambar+Partikel+Udara+Longitudinal",
        q: "(Cepat Rambat Bunyi) Saat memodelkan perambatan bunyi di udara, detail mana yang harus diabaikan (Abstraksi) agar kita fokus pada perpindahan energinya?",
        opt: [
            "Getaran partikel medium secara longitudinal.",
            "Warna molekul gas nitrogen di udara.",
            "Kecepatan rambat bunyi di medium tersebut.",
            "Kerapatan massa jenis medium.",
            "Suhu udara yang mempengaruhi kecepatan."
        ],
        ans: 1
    },
    {
        pilar: "dekomposisi",
        image: "https://via.placeholder.com/600x300?text=Gambar+Tabung+Resonansi",
        q: "(Resonansi) Untuk menentukan panjang gelombang melalui percobaan resonansi, bagian mana yang harus diurai (Dekomposisi) secara spesifik?",
        opt: [
            "Massa tabung dan harga garpu tala.",
            "Warna air dan jenis lantai laboratorium.",
            "Panjang kolom udara, frekuensi sumber, dan kondisi ujung tabung.",
            "Nama asisten laboratorium dan waktu praktikum.",
            "Volume total air tanpa mengukur tinggi permukaan."
        ],
        ans: 2
    },
    {
        pilar: "pola",
        image: "https://via.placeholder.com/600x300?text=Gambar+Dawai+Gitar+L",
        q: "(Sumber Bunyi) Berdasarkan hukum Marsenne, jika panjang dawai (L) diperkecil, nada suara menjadi lebih tinggi. Pola hubungan fisis yang tepat adalah...",
        opt: [
            "Frekuensi berbanding lurus dengan panjang dawai.",
            "Frekuensi tidak dipengaruhi oleh panjang dawai.",
            "Frekuensi berbanding terbalik dengan panjang dawai.",
            "Panjang dawai berbanding lurus dengan luas penampang.",
            "Tegangan dawai berbanding terbalik dengan panjang."
        ],
        ans: 2
    },
    {
        pilar: "algoritma",
        image: "https://via.placeholder.com/600x300?text=Gambar+Sonar+Kapal+Laut",
        q: "(Aplikasi Bunyi) Kapal menggunakan sonar untuk mengukur kedalaman. Urutan langkah (Algoritma) perhitungan yang paling tepat adalah...",
        opt: [
            "Input v; Input t; d = v * t; Selesai.",
            "Input v; Input t; d = (v * t) / 2; Tampilkan d.",
            "Hitung v / t; Kurangi suhu; Selesai.",
            "Pancarkan bunyi; Tunggu 1 jam; Tampilkan 0.",
            "Input massa kapal; d = t / v; Tampilkan d."
        ],
        ans: 1
    },
    {
        pilar: "abstraksi",
        image: "https://via.placeholder.com/600x300?text=Gambar+Ambulan+Doppler",
        q: "(Efek Doppler) Dalam menghitung frekuensi yang didengar dari sirine ambulan, variabel mana yang merupakan 'noise' (tidak relevan) dalam model matematika?",
        opt: [
            "Kecepatan sumber bunyi.",
            "Kecepatan pendengar.",
            "Warna cat mobil ambulan.",
            "Frekuensi asli sirine.",
            "Cepat rambat bunyi di udara."
        ],
        ans: 2
    }
];

let currentIdx = 0;
let hasAnswered = false;
let scores = { dekomposisi: 0, pola: 0, abstraksi: 0, algoritma: 0 };

function loadQuestion() {
    hasAnswered = false;
    const q = questions[currentIdx];
    
    // Update UI
    document.getElementById("pilar-display").innerText = q.pilar;
    document.getElementById("progress-text").innerText = `Soal ${currentIdx + 1}/${questions.length}`;
    document.getElementById("q-image").src = q.image;
    document.getElementById("q-text").innerText = q.q;

    const cont = document.getElementById("options-cont");
    cont.innerHTML = "";
    
    q.opt.forEach((o, i) => {
        const div = document.createElement("div");
        div.className = "option-item";
        div.id = `opt-${i}`;
        div.innerHTML = `<b style="margin-right:10px">${String.fromCharCode(65 + i)}.</b> ${o}`;
        div.onclick = () => checkAnswer(i);
        cont.appendChild(div);
    });
    
    document.getElementById("btn-next").disabled = true;
}

function checkAnswer(selected) {
    if (hasAnswered) return;
    hasAnswered = true;

    const q = questions[currentIdx];
    const correct = q.ans;

    if (selected === correct) {
        // Logika skor: Abstraksi ada 2 soal (50+50), lainnya 1 soal (100)
        scores[q.pilar] += (q.pilar === "abstraksi" ? 50 : 100); 
        document.getElementById(`opt-${selected}`).classList.add("correct");
    } else {
        document.getElementById(`opt-${selected}`).classList.add("wrong");
        document.getElementById(`opt-${correct}`).classList.add("correct");
    }

    document.querySelectorAll(".option-item").forEach(el => el.classList.add("locked"));
    document.getElementById("btn-next").disabled = false;
}

document.getElementById("btn-next").onclick = () => {
    currentIdx++;
    if (currentIdx < questions.length) {
        loadQuestion();
    } else {
        submitResults();
    }
};

async function submitResults() {
    // Ambil data user dari localStorage yang disimpan saat login
    const username = localStorage.getItem("username") || "Siswa_Baru";
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwzIL_2ScjfTJT8InR7zsJkkzkYu2UGieDAJZXS_eOx5aI-OOC7wgFpg9gwCjpeTEuQbg/exec';

    Swal.fire({ 
        title: 'Menyimpan Hasil...', 
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
    });

    const totalAvg = (scores.dekomposisi + scores.pola + scores.abstraksi + scores.algoritma) / 4;

    const payload = {
        action: "save_ct",
        username: username,
        materi: "Gelombang_Bunyi",
        tipe_tes: "Diagnostik ATI",
        dekomposisi: scores.dekomposisi,
        pola: scores.pola,
        abstraksi: scores.abstraksi,
        algoritma: scores.algoritma,
        total: totalAvg
    };

    try {
        const qs = new URLSearchParams(payload).toString();
        // Menggunakan mode no-cors untuk Web App Google Apps Script
        await fetch(`${scriptURL}?${qs}`, { method: 'POST', mode: 'no-cors' });
        
        Swal.fire({
            title: "Berhasil!",
            text: "Tes awal selesai. Mari lanjut ke materi!",
            icon: "success",
            confirmButtonText: "OK"
        }).then(() => {
            window.location.href = "../../dashboard.html";
        });
    } catch(e) {
        console.error("Error submit:", e);
        // Tetap pindah halaman jika gagal fetch (agar user tidak stuck)
        window.location.href = "../../dashboard.html";
    }
}

// Inisialisasi soal pertama saat halaman dimuat
loadQuestion();