/**
 * Phi-R Interactive | Gelombang Lab
 * Logic: Diagnostic Test ATI-CT (Final Fix)
 * Database: Google Sheets (action: save_ct)
 */

// Konfigurasi Soal dengan Identitas Pilar CT
const questions = [
    {
        pilar: "abstraksi", // Soal 1
        image: "img/gelombang_jenis.png",
        text: "Pilar Abstraksi: Berdasarkan simulasi, ciri utama apa yang paling tepat untuk membedakan Gelombang Tali dan Gelombang Pegas?",
        options: [
            "Warna Gelombang yang dihasilkan", 
            "Arah Getar partikel terhadap Arah Rambatnya", 
            "Panjang Tali dan jenis pegas yang digunakan", 
            "Jenis Bahan pembuat medium rambatan", 
            "Amplitudo Maksimum saat diberikan gangguan"
        ],
        answer: 1 
    },
    {
        pilar: "pola", // Soal 2
        image: "img/superposisi.png",
        text: "Pilar Pengenalan Pola: Jika Bukit A (2 unit) bertemu Bukit B (2 unit) di titik yang sama, tingginya menjadi 4 unit. Pola logika apa ini?",
        options: [
            "Pengurangan (Interferensi Destruktif)", 
            "Perkalian (Amplifikasi Sinyal Berlipat)", 
            "Penjumlahan (Interferensi Konstruktif)", 
            "Pembagian (Reduksi Simpangan Gelombang)", 
            "Eksponensial (Lonjakan Energi Mendadak)"
        ],
        answer: 2 
    },
    {
        pilar: "dekomposisi", // Soal 3
        image: "img/beda_fase.png",
        text: "Pilar Dekomposisi: Untuk menentukan beda fase antara dua gelombang yang berbeda waktu mulainya, bagian mana yang harus kamu bandingkan?",
        options: [
            "Warna puncak masing-masing gelombang", 
            "Jarak horizontal antara dua puncak yang bersesuaian", 
            "Tinggi maksimum (amplitudo) masing-masing", 
            "Kecepatan getar tangan saat menggerakkan medium", 
            "Luas penampang medium rambatan gelombang"
        ],
        answer: 1 
    },
    {
        pilar: "algoritma", // Soal 4
        image: "img/pantulan.png",
        text: "Pilar Algoritma: JIKA gelombang menabrak ujung tetap, MAKA gelombang akan dipantulkan dengan fase terbalik. Manakah visual yang sesuai dengan aturan ini?",
        options: [
            "Bukit gelombang tetap dipantulkan menjadi bukit", 
            "Gelombang menembus dinding tanpa ada pantulan", 
            "Bukit gelombang dipantulkan menjadi lembah", 
            "Gelombang berhenti seketika di titik pantul", 
            "Gelombang berbalik arah tanpa ada perubahan bentuk"
        ],
        answer: 2 
    },
    {
        pilar: "pola", // Soal 5
        image: "img/v_f_lambda.png",
        text: "Pilar Pengenalan Pola: Dalam simulasi, saat Frekuensi dinaikkan namun Kecepatan tetap, pola apa yang terjadi pada Panjang Gelombang?",
        options: [
            "Panjang gelombang akan terlihat semakin besar", 
            "Panjang gelombang akan terlihat semakin mengecil", 
            "Panjang gelombang tidak mengalami perubahan", 
            "Gelombang menghilang secara perlahan dari layar", 
            "Panjang gelombang menjadi tidak terhingga"
        ],
        answer: 1 
    }
];

let currentIdx = 0;
let score = 0;
let isAnswered = false; 

// Penampung Skor CT Per Pilar
let ctResults = {
    dekomposisi: 0,
    pola: 0,
    abstraksi: 0,
    algoritma: 0
};

// Bind DOM Elements
const qText = document.getElementById("question-text");
const qImg = document.getElementById("question-image");
const optCont = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

function loadQuestion() {
    isAnswered = false;
    nextBtn.disabled = true; 
    nextBtn.innerText = "Pilih Jawaban...";
    
    const q = questions[currentIdx];
    qText.innerText = q.text;
    qImg.src = q.image;
    
    progressText.innerText = `${currentIdx + 1} / ${questions.length}`;
    const progressPercent = ((currentIdx + 1) / questions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;

    optCont.innerHTML = "";
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.classList.add("opt-item");
        btn.onclick = () => handleInstantFeedback(i, btn);
        optCont.appendChild(btn);
    });
}

function handleInstantFeedback(selectedIndex, selectedBtn) {
    if (isAnswered) return; 
    isAnswered = true;

    const q = questions[currentIdx];
    const correctIdx = q.answer;
    const allBtns = document.querySelectorAll(".opt-item");

    // Logika Penyekoran CT
    if (selectedIndex === correctIdx) {
        score++;
        if (q.pilar === "pola") {
            ctResults.pola += 50; // Karena ada 2 soal pola, masing-masing 50 poin
        } else {
            ctResults[q.pilar] = 100; // Pilar lain cuma 1 soal, langsung 100 poin
        }
    }

    // Feedback Warna
    allBtns.forEach((btn, i) => {
        btn.style.cursor = "default";
        if (i === correctIdx) {
            btn.style.backgroundColor = "#00b894";
            btn.style.color = "white";
        } else if (i === selectedIndex && i !== correctIdx) {
            btn.style.backgroundColor = "#ff7675";
            btn.style.color = "white";
        } else {
            btn.style.opacity = "0.4";
        }
    });

    nextBtn.disabled = false;
    nextBtn.innerText = currentIdx === questions.length - 1 ? "Simpan Hasil Ke Database" : "Lanjut ke Soal Berikutnya";
}

nextBtn.onclick = () => {
    currentIdx++;
    if (currentIdx < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
};

async function finishQuiz() {
    const finalScore = (score / questions.length) * 100;
    const levelATI = finalScore >= 60 ? "SEDANG" : "RENDAH";
    const activeUser = localStorage.getItem("username") || "User_SMA_Ammar";

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwzIL_2ScjfTJT8InR7zsJkkzkYu2UGieDAJZXS_eOx5aI-OOC7wgFpg9gwCjpeTEuQbg/exec'; 

    const payload = {
        action: "save_ct",
        username: activeUser,
        materi: "Gelombang",
        tipe_tes: "Diagnostik ATI",
        dekomposisi: ctResults.dekomposisi,
        pola: ctResults.pola,
        abstraksi: ctResults.abstraksi,
        algoritma: ctResults.algoritma,
        total: finalScore
    };

    Swal.fire({
        title: "Menyimpan Progres...",
        text: "Mohon tunggu sebentar, data sedang dikirim ke database.",
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    const queryString = new URLSearchParams(payload).toString();

    try {
        await fetch(`${scriptURL}?${queryString}`, { 
            method: 'POST',
            mode: 'no-cors' 
        });
        
        Swal.fire({
            title: "Data Tersimpan!",
            text: `Skor CT: ${finalScore}. Jalur Belajar: ${levelATI}.`,
            icon: "success",
            confirmButtonText: "Mulai Tantangan 1: Gelombang"
        }).then(() => {
            window.location.href = `../materi/gelombang.html?level=${levelATI}`;
        });

    } catch (err) {
        console.error("Error:", err);
        window.location.href = `../materi/gelombang.html?level=${levelATI}`;
    }
}

loadQuestion();