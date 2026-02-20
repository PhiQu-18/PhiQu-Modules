// Konfigurasi API Google Apps Script - Pastikan URL ini hasil Deploy terbaru (Anyone)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzIL_2ScjfTJT8InR7zsJkkzkYu2UGieDAJZXS_eOx5aI-OOC7wgFpg9gwCjpeTEuQbg/exec";

/**
 * Berfungsi untuk berpindah tab antara Login dan Daftar
 */
function switchTab(type) {
    $('.tab').removeClass('active');
    $('form').hide();
    
    if (type === 'login') {
        $('.tab:first-child').addClass('active');
        $('#loginForm').css('display', 'flex');
    } else {
        $('.tab:last-child').addClass('active');
        $('#registerForm').css('display', 'flex');
    }
}

$(document).ready(function() {
    
// --- 1. LOGIKA DAFTAR (REGISTER) ---
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        const btn = $(this).find('.btn-submit');
        
        btn.text('Mengecek Data...').prop('disabled', true);
        
        const formData = {
            action: "register",
            username: $('#r_user').val().trim(), // Ambil & bersihkan spasi
            password: $('#r_pass').val(),
            nama_lengkap: $('#r_fullname').val(),
            asal_sekolah: $('#r_school').val(),
            no_wa: $('#r_wa').val()
        };

        $.post(SCRIPT_URL, formData, function(response) {
            // Jika Apps Script mengirim tulisan "Success"
            if (response.trim() === "Success") {
                alert("Pendaftaran Berhasil!");
                switchTab('login');
                $('#registerForm')[0].reset();
            } else {
                // Jika Apps Script mengirim pesan error (Username sudah ada)
                alert(response); 
            }
        })
        .fail(function() {
            alert("Terjadi kesalahan koneksi.");
        })
        .always(function() {
            btn.text('DAFTAR AKUN').prop('disabled', false);
        });
    });

    // --- 2. LOGIKA MASUK (LOGIN) ---
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const btn = $(this).find('.btn-submit');
        const originalText = btn.text();
        
        btn.text('Memverifikasi...').prop('disabled', true);

        const username = $('#l_user').val().trim();
        const password = $('#l_pass').val();

        // Menggunakan JSONP (callback=?) untuk mengambil data (Aman dari CORS)
        $.getJSON(SCRIPT_URL + "?callback=?", {
            action: "login",
            username: username,
            password: password
        }, function(res) {
            if (res.status === 'success') {
                // Simpan data user ke localStorage untuk identitas di halaman lain
                localStorage.setItem('username', username);
                localStorage.setItem('nama', res.nama);
                localStorage.setItem('skor_tti', res.skor_tti);
                localStorage.setItem('jalur', res.jalur); // Jalur Belajar (Poin 3)
                
                // LOGIKA ADAPTIF (Poin 2):
                // Jika skor TTI masih 0 atau "0", lempar ke tes kemandirian
                if (parseInt(res.skor_tti) === 0 || res.skor_tti === "0") {
                    alert("Selamat datang " + res.nama + "! Silakan isi Tes Kemandirian (TTI) terlebih dahulu.");
                    window.location.href = "halaman_tti.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            } else {
                alert("Username atau Password salah!");
                btn.text(originalText).prop('disabled', false);
            }
        }).fail(function() {
            alert("Error: Gagal memverifikasi. Pastikan Apps Script di-deploy sebagai 'Anyone'.");
            btn.text(originalText).prop('disabled', false);
        });
    });

    
});