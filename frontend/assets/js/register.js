/* ==================== register.js ====================
   Script khusus halaman register.html
   Membutuhkan assets/js/admin.js (tampilkanToast, dsb) sudah dimuat lebih dulu.
   ==================================================== */

function togglePassword(inputId,iconId){

const input=document.getElementById(inputId);
const icon=document.getElementById(iconId);

if(input.type==="password"){
input.type="text";
icon.classList.replace("bi-eye","bi-eye-slash");
}else{
input.type="password";
icon.classList.replace("bi-eye-slash","bi-eye");
}

}

/* ==================== PASSWORD STRENGTH (sederhana) ==================== */
function nilaiKekuatanPassword(pass){
    let skor = 0;
    if(pass.length >= 6) skor++;
    if(pass.length >= 10) skor++;
    if(/[A-Z]/.test(pass)) skor++;
    if(/[0-9]/.test(pass)) skor++;
    if(/[^A-Za-z0-9]/.test(pass)) skor++;
    return skor; // 0-5
}

const passwordInput = document.getElementById("password");
const strengthWrap = document.getElementById("passwordStrengthWrap");
const strengthBar = document.getElementById("passwordStrengthBar");
const strengthLabel = document.getElementById("passwordStrengthLabel");

if(passwordInput){
    passwordInput.addEventListener("input", function(){
        const val = passwordInput.value;
        if(val === ""){
            strengthWrap.style.display = "none";
            return;
        }
        strengthWrap.style.display = "block";
        const skor = nilaiKekuatanPassword(val);
        const info = [
            { pct: 20,  color: "#dc3545", label: "Sangat lemah" },
            { pct: 40,  color: "#dc3545", label: "Lemah" },
            { pct: 60,  color: "#fd7e14", label: "Cukup" },
            { pct: 80,  color: "#ffc107", label: "Baik" },
            { pct: 100, color: "#198754", label: "Kuat" }
        ][Math.max(0, skor - 1)] || { pct: 20, color: "#dc3545", label: "Sangat lemah" };

        strengthBar.style.width = info.pct + "%";
        strengthBar.style.background = info.color;
        strengthLabel.textContent = "Kekuatan password: " + info.label;
    });
}

document.getElementById("registerForm").addEventListener("submit",function(e){

e.preventDefault();

const password=document.getElementById("password").value;
const confirm=document.getElementById("confirmPassword").value;
const setuju=document.getElementById("securityCheck").checked;

if(password!==confirm){

tampilkanToast("Konfirmasi password tidak sama!", "danger");

return;

}

if(password.length < 6){

tampilkanToast("Password minimal 6 karakter!", "danger");

return;

}

if(!setuju){

tampilkanToast("Silakan centang persetujuan keamanan akun terlebih dahulu.", "warning");

return;

}

// TODO Backend: kirim {nama, email, password} ke endpoint registrasi
// (mis. POST /api/admin/register) sebagai JSON, validasi email unik
// di server, lalu redirect ke login setelah response sukses.
tampilkanToast("Registrasi berhasil! Mengalihkan ke login...", "success");

setTimeout(function(){
    window.location.href = "login-admin.html";
}, 900);

});
