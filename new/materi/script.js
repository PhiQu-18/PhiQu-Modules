// Navigation variables
let currentStep = 0;
const sectionIds = [
    'section-0', 'section-1', 'section-2', 'section-3', 
    'ct-dashboard', 
    'section-4', 'section-5'
];
const totalSections = sectionIds.length;

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
});

function navigate(direction) {
    // JIKA pindah maju dari Section 3 ke Dashboard (Layar Transisi)
    if (currentStep === 3 && direction === 1) {
        showCTDashboard();
    } else {
        let nextStep = currentStep + direction;
        if (nextStep >= 0 && nextStep < totalSections) {
            currentStep = nextStep;
            updateDisplay();
        }
    }
}

function updateDisplay() {
    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active');
            el.style.display = 'none';
        }
    });

    const currentId = sectionIds[currentStep];
    const el = document.getElementById(currentId);
    if (el) {
        el.classList.add('active');
        el.style.display = 'block';
    }

    updateNavigationButtons();
    updateProgressIndicator();
}

function showCTDashboard() {
    currentStep = 4; // Index Dashboard CT
    updateDisplay();

    const loader = document.getElementById('sync-loader');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');

    // Reset loader bar
    loader.style.transition = 'none';
    loader.style.width = '0%';

    // Sembunyikan navigasi agar siswa fokus pada loading
    if(nextBtn) nextBtn.style.display = 'none';
    if(backBtn) backBtn.style.display = 'none';

    // Munculkan skor saat ini (akan tetap 0 jika belum ada soal yang dikerjakan)
    loadCTScores();

    // Jalankan Animasi Loading Bar (5 detik)
    setTimeout(() => {
        loader.style.transition = 'width 5s linear';
        loader.style.width = '100%';
    }, 50);

    // Otomatis pindah ke Section 4 setelah 5 detik
    setTimeout(() => {
        currentStep = 5; 
        if(nextBtn) nextBtn.style.display = 'flex';
        if(backBtn) backBtn.style.display = 'flex';
        updateDisplay();
    }, 5100);
}

// Fungsi Mengambil Skor Asli
function loadCTScores() {
    const pilar = ['dekom', 'pola', 'abs', 'algo'];
    
    pilar.forEach(p => {
        // Mengambil dari localStorage. Jika tidak ada, maka default 0.
        const score = localStorage.getItem('ct_' + p) || 0;
        const element = document.getElementById('score-' + p);
        
        if (element) {
            // Karena ini baseline, angka akan tampil sesuai data tersimpan (0)
            // Tetap menggunakan animasi kecil untuk estetika
            animateNumber(element, parseInt(score));
        }
    });
}

function animateNumber(element, target) {
    let current = 0;
    if (target === 0) {
        element.innerText = "0";
        return;
    }
    
    const duration = 1500;
    const steps = 30;
    const increment = target / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.innerText = Math.floor(current);
    }, intervalTime);
}

// FUNGSI PENTING: Panggil ini nanti di bagian soal untuk menambah nilai
// Contoh penggunaan: updateScore('dekom', 25);
function updateScore(pilar, points) {
    let currentScore = parseInt(localStorage.getItem('ct_' + pilar)) || 0;
    localStorage.setItem('ct_' + pilar, currentScore + points);
}

function updateNavigationButtons() {
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');

    if (backBtn && nextBtn) {
        backBtn.disabled = currentStep === 0;
        nextBtn.disabled = currentStep === totalSections - 1;
        
        // Sembunyikan permanen jika di dashboard
        if (currentStep === 4) {
            backBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }
}

function updateProgressIndicator() {
    const progressEl = document.getElementById('current-slide');
    if (progressEl) progressEl.textContent = currentStep + 1;
}

// Modal functions
function openModal() { document.getElementById('help-modal').style.display = 'block'; }
function openTaRLModal() { document.getElementById('tarl-modal').style.display = 'block'; }
function openCodingModal() { document.getElementById('coding-modal').style.display = 'block'; }
function openCTModal() { document.getElementById('ct-modal').style.display = 'block'; }

function closeModal(modalId) {
    if (modalId) {
        document.getElementById(modalId).style.display = 'none';
    } else {
        const modals = ['help-modal', 'tarl-modal', 'coding-modal', 'ct-modal'];
        modals.forEach(id => {
            const m = document.getElementById(id);
            if(m) m.style.display = 'none';
        });
    }
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

function goHome() { window.location.href = '../index.html'; }

function contactSupport() {
    const noWA = "6283182514910";
    const pesan = encodeURIComponent("Halo Admin Phi-R, saya butuh bantuan teknis.");
    window.open(`https://wa.me/${noWA}?text=${pesan}`, '_blank');
}

document.addEventListener('keydown', (e) => {
    if (currentStep === 4) return; 
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
});

