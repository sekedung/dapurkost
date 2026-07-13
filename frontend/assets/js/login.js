/* ==================== login.js ====================
   Script khusus halaman login-admin.html
   Membutuhkan assets/js/admin.js (tampilkanToast, dsb) sudah dimuat lebih dulu.
   ==================================================== */

// toggle show/hide password
function togglePassword(){

    const password = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");

    if(password.type === "password"){
        password.type = "text";
        eyeIcon.classList.remove("bi-eye");
        eyeIcon.classList.add("bi-eye-slash");
    }else{
        password.type = "password";
        eyeIcon.classList.remove("bi-eye-slash");
        eyeIcon.classList.add("bi-eye");
    }

}

// LOGIN VALIDASI + REDIRECT
// TODO Backend: ganti validasi dummy ini dengan POST ke endpoint auth
// (mis. POST /api/admin/login) mengirim {email, password} sebagai JSON,
// lalu simpan session/token dari response sebelum redirect ke dashboard.
// Kredensial dummy simulasi: admin@dapurkost.id / 123456
const DUMMY_ADMIN_EMAIL = "admin@dapurkost.id";
const DUMMY_ADMIN_PASSWORD = "123456";

document.getElementById("loginForm").addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(email === "" || password === ""){
        tampilkanToast("Email dan password harus diisi!", "danger");
        return;
    }

    if(email === DUMMY_ADMIN_EMAIL && password === DUMMY_ADMIN_PASSWORD){

        tampilkanToast("Login berhasil! Mengalihkan ke dashboard...", "success");

        setTimeout(function(){
            window.location.href = "dashboard-admin.html";
        }, 900);

    }else{

        tampilkanToast("Email atau password salah!", "danger");

    }

});

// LOGIN GOOGLE (Dummy)
// TODO Backend: integrasikan Google OAuth di sisi backend PHP Native.
const googleLoginBtn = document.getElementById("googleLoginBtn");
if(googleLoginBtn){
    googleLoginBtn.addEventListener("click", function(){
        tampilkanToast("Fitur Google Login akan tersedia setelah integrasi backend.", "info");
    });
}
