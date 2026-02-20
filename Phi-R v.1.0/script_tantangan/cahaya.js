const questions = [
    {
        pilar: "Abstraksi",
        image: "https://via.placeholder.com/600x300?text=Young+Double+Slit+Experiment",
        q: "(Interferensi) Dalam model matematika y = (λL)/d, variabel mana yang harus diabaikan (Abstraksi) karena tidak mempengaruhi hasil perhitungan fisis panjang gelombang?",
        opt: [
            "Jarak antar celah (d)",
            "Jarak celah ke layar (L)",
            "Warna cat pada dinding laboratorium",
            "Panjang gelombang cahaya (λ)",
            "Orde interferensi (n)"
        ],
        ans: 2
    },
    {
        pilar: "Dekomposisi",
        image: "https://via.placeholder.com/600x300?text=Light+Diffraction+on+CD",
        q: "(Difraksi) Untuk menganalisis mengapa keping CD menghasilkan pola pelangi, komponen mana yang harus kita urai (Dekomposisi) sebagai variabel utama?",
        opt: [
            "Harga keping CD dan merek pemutarnya",
            "Bahan plastik dan berat keping CD",
            "Hubungan antara λ, konstanta kisi (d), dan sudut difraksi (θ)",
            "Kapasitas penyimpanan data (GB)",
            "Durasi lagu dalam keping tersebut"
        ],
        ans: 2
    },
    {
        pilar: "Pola",
        image: "https://via.placeholder.com/600x300?text=Malus+Law+Polarization",
        q: "(Polarisasi) Jika pola terang maksimum terjadi saat dua polaroid sejajar (0°) dan gelap total saat tegak lurus (90°), apa yang terjadi jika sudutnya 45° berdasarkan Hukum Malus?",
        opt: [
            "Cahaya akan hilang sepenuhnya",
            "Intensitas menjadi setengah dari maksimum (1/2 Imax)",
            "Intensitas menjadi dua kali lipat",
            "Cahaya berubah warna menjadi biru",
            "Intensitas tidak berubah sama sekali"
        ],
        ans: 1
    },
    {
        pilar: "Algoritma",
        image: "https://via.placeholder.com/600x300?text=Optical+Fiber+Internal+Reflection",
        q: "(Aplikasi) Manakah urutan logika (Algoritma) yang paling tepat agar cahaya dapat merambat sempurna di dalam serat optik tanpa bocor keluar?",
        opt: [
            "Medium rapat ke kurang rapat; Sudut datang < Sudut kritis",
            "Medium kurang rapat ke rapat; Sudut datang > Sudut kritis",
            "Medium rapat ke kurang rapat; Sudut datang > Sudut kritis",
            "Udara ke kaca; Sudut datang harus 0°",
            "Cahaya harus dipadamkan sebelum masuk kabel"
        ],
        ans: 2
    },
    {
        pilar: "Evaluasi",
        image: "https://via.placeholder.com/600x300?text=Interferometry+Laser+Pattern",
        q: "(Logika) Jika hasil pengamatan interferometri menunjukkan pola garis terang menjadi lebih rapat (jarak y mengecil), kesimpulan manakah yang benar?",
        opt: [
            "Jarak celah ke layar (L) diperbesar",
            "Jarak antar celah (d) diperbesar",
            "Panjang gelombang (λ) menjadi lebih besar",
            "Intensitas laser diredupkan",
            "Layar pengamatan dipindahkan menjauh"
        ],
        ans: 1
    }
];

let currentIdx = 0;
let hasAnswered = false;
let scores = { dekomposisi: 0, pola: 0, abstraksi: 0, algoritma: 0, evaluasi: 0 };

function loadQuestion() {
    hasAnswered = false;
    const q = questions[currentIdx];
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
        scores[q.pilar.toLowerCase()] = 100; 
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
    const username = localStorage.getItem("username") || "Siswa_Baru_Cahaya";
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwzIL_2ScjfTJT8InR7zsJkkzkYu2UGieDAJZXS_eOx5aI-OOC7wgFpg9gwCjpeTEuQbg/exec';

    Swal.fire({ 
        title: 'Menyimpan Hasil...', 
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
    });

    const payload = {
        action: "save_ct",
        username: username,
        materi: "Gelombang_Cahaya",
        tipe_tes: "Diagnostik Awal",
        dekomposisi: scores.dekomposisi,
        pola: scores.pola,
        abstraksi: scores.abstraksi,
        algoritma: scores.algoritma,
        total: (scores.dekomposisi + scores.pola + scores.abstraksi + scores.algoritma) / 4
    };

    try {
        const qs = new URLSearchParams(payload).toString();
        await fetch(`${scriptURL}?${qs}`, { method: 'POST', mode: 'no-cors' });
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Tes awal cahaya selesai. Hasilmu sudah terekam.',
            confirmButtonText: 'Lanjutkan ke Materi'
        }).then(() => {
            window.location.href = "../../dashboard.html";
        });
    } catch(e) {
        console.error("Error submitting:", e);
        window.location.href = "../../dashboard.html";
    }
}

// Inisialisasi soal pertama saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadQuestion);