const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzIL_2ScjfTJT8InR7zsJkkzkYu2UGieDAJZXS_eOx5aI-OOC7wgFpg9gwCjpeTEuQbg/exec";

const questions = [
    // KEMANDIRIAN BELAJAR (TTI)
    { id: 1, cat: "Kemandirian", q: "Saya mencoba mencari sumber belajar lain (buku/internet) jika penjelasan guru kurang jelas." },
    { id: 2, cat: "Kemandirian", q: "Saya membuat jadwal belajar sendiri tanpa dipaksa orang tua." },
    { id: 3, cat: "Kemandirian", q: "Jika ada soal sulit, saya berusaha mengerjakannya dulu sebelum bertanya." },
    { id: 4, cat: "Kemandirian", q: "Saya merasa bertanggung jawab atas hasil ujian saya sendiri." },
    { id: 5, cat: "Kemandirian", q: "Saya tetap belajar meskipun tidak ada tugas atau ujian dalam waktu dekat." },
    { id: 6, cat: "Kemandirian", q: "Saya mampu mengevaluasi bagian mana dari pelajaran yang belum saya pahami." },
    { id: 7, cat: "Kemandirian", q: "Saya berani mencoba cara baru dalam menyelesaikan masalah fisika." },
    { id: 8, cat: "Kemandirian", q: "Saya mencari bantuan teman/guru hanya setelah saya mentok berusaha." },
    { id: 9, cat: "Kemandirian", q: "Saya merasa puas ketika berhasil memecahkan masalah yang sulit secara mandiri." },
    { id: 10, cat: "Kemandirian", q: "Saya selalu mencatat poin-poin penting saat belajar sendiri." },

    // COMPUTATIONAL THINKING SELF-ASSESSMENT
    { id: 11, cat: "CT - Dekomposisi", q: "Saya biasanya memecah masalah besar menjadi bagian-bagian kecil agar lebih mudah dikerjakan." },
    { id: 12, cat: "CT - Pola", q: "Saya sering melihat kemiripan antara masalah yang sedang dihadapi dengan masalah yang pernah diselesaikan." },
    { id: 13, cat: "CT - Abstraksi", q: "Saya bisa fokus pada informasi penting dan mengabaikan detail yang tidak relevan." },
    { id: 14, cat: "CT - Algoritma", q: "Saya suka menyusun langkah-langkah sistematis sebelum mulai mengerjakan tugas." },
    { id: 15, cat: "CT - Logika", q: "Saya terbiasa berpikir sebab-akibat ketika melihat suatu fenomena sains." },
    { id: 16, cat: "CT - Pola", q: "Dalam fisika, saya lebih suka mencari rumus umum daripada menghafal satu per satu." },
    { id: 17, cat: "CT - Dekomposisi", q: "Ketika membuat proyek, saya membaginya menjadi beberapa tahapan waktu." },
    { id: 18, cat: "CT - Algoritma", q: "Saya merasa mudah mengikuti petunjuk langkah-demi-langkah (seperti resep/tutorial)." },
    { id: 19, cat: "CT - Abstraksi", q: "Saya mampu merangkum inti sari dari bacaan yang panjang dengan cepat." },
    { id: 20, cat: "CT - Logika", q: "Saya sering mempertanyakan 'mengapa' sebuah solusi bisa berhasil atau gagal." },

    // APTITUDE TREATMENT INTERACTION (ATI) - Kemampuan Awal & Bakat Fisika-Coding
    { id: 21, cat: "ATI - Logika", q: "Saya merasa mudah memahami rumus fisika yang melibatkan banyak variabel fisis." },
    { id: 22, cat: "ATI - Digital", q: "Saya sudah familiar dengan logika pemrograman dasar (seperti penggunaan perintah If-Else)." },
    { id: 23, cat: "ATI - Minat", q: "Saya tertarik mempelajari bagaimana sebuah aplikasi atau simulasi fisika dibuat menggunakan kode program." },
    { id: 24, cat: "ATI - Visualisasi", q: "Saya mampu membayangkan pergerakan benda (seperti gelombang) hanya dengan melihat persamaannya." },
    { id: 25, cat: "ATI - Prosedural", q: "Saya lebih suka menyelesaikan masalah dengan urutan langkah yang jelas daripada menebak-nebak." },
    { id: 26, cat: "ATI - Matematika", q: "Saya tidak merasa kesulitan saat harus memanipulasi persamaan fisika (pindah ruas/substitusi)." },
    { id: 27, cat: "ATI - Algoritmik", q: "Saya sering membuat urutan kerja (to-do list) agar tugas saya selesai tepat waktu." },
    { id: 28, cat: "ATI - Teknologi", q: "Saya terbiasa menggunakan aplikasi simulasi (seperti PhET) untuk memahami konsep sains." },
    { id: 29, cat: "ATI - Kognitif", q: "Saya lebih cepat paham jika materi fisika disajikan dalam bentuk diagram atau bagan alir (flowchart)." },
    { id: 30, cat: "ATI - Analisis", q: "Saya merasa tertantang jika diberikan soal fisika yang membutuhkan logika berpikir tingkat tinggi." }
];

$(document).ready(function() {
    $('#user-display').text(localStorage.getItem('nama') || "Siswa");
    renderQuestions();

    // Update progress bar saat input diklik
    $(document).on('change', 'input[type="radio"]', function() {
        let totalAnswered = $('input[type="radio"]:checked').length;
        let percent = (totalAnswered / questions.length) * 100;
        $('#progress-fill').css('width', percent + '%');
        $('#progress-text').text(totalAnswered + '/20');
    });
});

function renderQuestions() {
    let html = "";
    questions.forEach((q, index) => {
        html += `
            <div class="q-card">
                <div class="category-badge">${q.cat}</div>
                <div class="question">${index + 1}. ${q.q}</div>
                <div class="options">
                    ${[1, 2, 3, 4, 5].map(num => `
                        <div class="option-item">
                            <input type="radio" name="q${q.id}" id="q${q.id}_${num}" value="${num}" required>
                            <label for="q${q.id}_${num}">${num}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    $('#questions-container').html(html);
}

$('#ttiForm').on('submit', function(e) {
    e.preventDefault();
    
    // 1. Tampilkan loading agar user tahu proses sedang berjalan
    const submitBtn = $(this).find('button[type="submit"]');
    submitBtn.prop('disabled', true).text('Menyimpan...');

    // 2. Hitung total skor
    let totalScore = 0;
    questions.forEach(q => {
        let val = parseInt($(`input[name="q${q.id}"]:checked`).val());
        totalScore += val;
    });

    // 3. Tentukan Jalur Belajar
    let jalur = (totalScore >= 75) ? "MANDIRI (Fast Track)" : "TERBIMBING (Regular)";
    
    // 4. Ambil username dari login
    const username = localStorage.getItem('username');

    if (!username) {
        alert("Sesi berakhir, silakan login ulang.");
        window.location.href = "index.html";
        return;
    }

    // 5. KIRIM KE GOOGLE SHEETS (API CALL)
    const formData = new URLSearchParams();
    formData.append("action", "update_tti");
    formData.append("username", username);
    formData.append("skor_tti", totalScore);
    formData.append("jalur", jalur);

    fetch(SCRIPT_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors" // Menghindari masalah CORS di browser
    })
    .then(() => {
        // Simpan ke LocalStorage untuk tampilan di Dashboard
        localStorage.setItem('skor_tti', totalScore);
        localStorage.setItem('jalur', jalur);

        alert(`Berhasil! Skor: ${totalScore}\nJalur: ${jalur}`);
        window.location.href = "dashboard.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Gagal menyimpan ke database. Cek koneksi internet.");
        submitBtn.prop('disabled', false).text('Simpan & Selesai');
    });
});