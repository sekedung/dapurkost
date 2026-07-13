/* ==================== pembayaran.js ====================
   Script khusus halaman pembayaran-admin.html
   Membutuhkan assets/js/admin.js (tampilkanToast, dsb) sudah dimuat lebih dulu.
   ==================================================== */

// Pencarian + filter status + filter metode (client-side, data dummy)
const searchInput = document.getElementById("searchPembayaran");
const filterStatus = document.getElementById("filterStatus");
const filterMetode = document.getElementById("filterMetode");
const tabel = document.getElementById("tabelPembayaran");
const emptyState = document.getElementById("emptyState");

function terapkanFilter(){

    const kataKunci = searchInput.value.toLowerCase().trim();
    const status = filterStatus.value;
    const metode = filterMetode.value;
    const baris = tabel.querySelectorAll("tbody tr");
    let jumlahTampil = 0;

    baris.forEach(function(tr){

        const teks = tr.innerText.toLowerCase();
        const statusBaris = tr.dataset.status;
        const metodeBaris = tr.dataset.metode;

        const cocokKataKunci = teks.includes(kataKunci);
        const cocokStatus = (status === "semua") || (status === statusBaris);
        const cocokMetode = (metode === "semua") || (metode === metodeBaris);

        if(cocokKataKunci && cocokStatus && cocokMetode){

            tr.style.display = "";
            jumlahTampil++;

        } else {

            tr.style.display = "none";

        }

    });

    emptyState.classList.toggle("d-none", jumlahTampil !== 0);

}

searchInput.addEventListener("input", terapkanFilter);
filterStatus.addEventListener("change", terapkanFilter);
filterMetode.addEventListener("change", terapkanFilter);

/* ==================== AMBIL DATA DARI BARIS ==================== */
function ambilDataBaris(tr){
    return {
        idPembayaran: tr.children[0].innerText.trim(),
        idPesanan: tr.children[1].innerText.trim(),
        nama: tr.querySelector(".nama-cell strong").innerText.trim(),
        metode: tr.querySelector(".metode-cell").innerText.trim(),
        total: tr.children[4].innerText.trim(),
        tanggal: tr.children[5].innerText.trim(),
        status: tr.dataset.status
    };
}

function badgeStatus(status){
    if(status === "terverifikasi") return '<span class="badge badge-selesai">Terverifikasi</span>';
    if(status === "ditolak") return '<span class="badge badge-dibatalkan">Ditolak</span>';
    return '<span class="badge badge-menunggu">Menunggu Verifikasi</span>';
}

/* ==================== DETAIL (ICON MATA) ==================== */
const detailModal = new bootstrap.Modal(document.getElementById("detailModal"));

tabel.addEventListener("click", function(e){
    const btnDetail = e.target.closest('[title="Detail"]');
    if(!btnDetail) return;

    const tr = btnDetail.closest("tr");
    const data = ambilDataBaris(tr);

    document.getElementById("detailAvatar").textContent = data.nama.charAt(0);
    document.getElementById("detailNama").textContent = data.nama;
    document.getElementById("detailTanggal").textContent = data.tanggal;
    document.getElementById("detailIdPembayaran").textContent = data.idPembayaran;
    document.getElementById("detailIdPesanan").textContent = data.idPesanan;
    document.getElementById("detailMetode").textContent = data.metode;
    document.getElementById("detailTotal").textContent = data.total;
    document.getElementById("detailStatus").innerHTML = badgeStatus(data.status);

    detailModal.show();
});

/* ==================== VERIFIKASI (Bootstrap Modal Konfirmasi) ==================== */
// TODO Backend: PUT /api/admin/pembayaran/{id}/verifikasi
const verifyModal = new bootstrap.Modal(document.getElementById("verifyModal"));
let barisAkanDiverifikasi = null;

tabel.addEventListener("click", function(e){
    const btnVerif = e.target.closest('[title="Verifikasi"]');
    if(!btnVerif) return;

    const tr = btnVerif.closest("tr");
    const data = ambilDataBaris(tr);
    barisAkanDiverifikasi = tr;

    document.getElementById("verifyNama").textContent = data.nama;
    document.getElementById("verifyNominal").textContent = data.total;
    document.getElementById("verifyTanggal").textContent = data.tanggal;
    document.getElementById("verifyStatus").innerHTML = badgeStatus(data.status);

    verifyModal.show();
});

document.getElementById("confirmVerifyBtn").addEventListener("click", function(){
    if(!barisAkanDiverifikasi) return;

    const tr = barisAkanDiverifikasi;
    const data = ambilDataBaris(tr);

    tr.dataset.status = "terverifikasi";
    tr.children[6].innerHTML = badgeStatus("terverifikasi");
    const btnVerif = tr.querySelector('[title="Verifikasi"]');
    if(btnVerif) btnVerif.remove();

    verifyModal.hide();
    terapkanFilter();
    tampilkanToast(`Pembayaran ${data.idPembayaran} berhasil diverifikasi!`, "success");
    barisAkanDiverifikasi = null;
});

/* ==================== HAPUS (Bootstrap Modal) ==================== */
// TODO Backend: DELETE /api/admin/pembayaran/{id}
const deletePembayaranModal = new bootstrap.Modal(document.getElementById("deletePembayaranModal"));
let barisPembayaranAkanDihapus = null;

tabel.addEventListener("click", function(e){
    const btnHapus = e.target.closest('[title="Hapus"]');
    if(!btnHapus) return;

    const tr = btnHapus.closest("tr");
    const data = ambilDataBaris(tr);

    barisPembayaranAkanDihapus = tr;
    document.getElementById("deletePembayaranName").textContent = `${data.idPembayaran} (${data.nama})`;
    deletePembayaranModal.show();
});

document.getElementById("confirmDeletePembayaranBtn").addEventListener("click", function(){
    if(!barisPembayaranAkanDihapus) return;
    barisPembayaranAkanDihapus.remove();
    terapkanFilter();
    deletePembayaranModal.hide();
    tampilkanToast("Data pembayaran berhasil dihapus!", "danger");
    barisPembayaranAkanDihapus = null;
});
