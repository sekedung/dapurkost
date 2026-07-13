/* ==================== paket.js ====================
   Script khusus halaman kelola-paket.html
   Membutuhkan assets/js/admin.js (tampilkanToast, dsb) sudah dimuat lebih dulu.
   ==================================================== */

/* ==================== JENIS PAKET (pengganti input icon manual) ==================== */
const JENIS_PAKET = {
  hemat:      { icon: "bi-piggy-bank",  badgeLabel: "Paling Hemat", badgeIcon: "bi-piggy-bank" },
  favorit:    { icon: "bi-heart-fill",  badgeLabel: "Favorit",      badgeIcon: "bi-heart-fill" },
  premium:    { icon: "bi-gem",         badgeLabel: "Premium",      badgeIcon: "bi-gem" },
  bestseller: { icon: "bi-award-fill",  badgeLabel: "Best Seller",  badgeIcon: "bi-trophy-fill" }
};

/* ==================== DATA PAKET (sesuai paket.html customer) ==================== */
let paketList = [
  {
    id: 1,
    name: "Paket Harian",
    jenis: "favorit",
    price: 15000,
    period: "/ 1x makan",
    durasi: "1 Hari",
    estimasi: "± 45 Menit",
    menuGanti: "Setiap Hari",
    benefits: [
      "Cocok untuk coba-coba dulu",
      "Tanpa kontrak jangka panjang",
      "Bisa pesan kapan saja"
    ],
    ongkir: false,
    konsultasi: false,
    prioritas: false
  },
  {
    id: 2,
    name: "Paket Mingguan",
    jenis: "bestseller",
    price: 95000,
    period: "/ 7 hari (2x makan/hari)",
    durasi: "7 Hari",
    estimasi: "± 30 Menit",
    menuGanti: "Setiap Hari",
    benefits: [
      "Gratis ongkir seluruh area kost",
      "Bisa ganti menu 2x dalam seminggu",
      "Prioritas jadwal pengantaran"
    ],
    ongkir: true,
    konsultasi: false,
    prioritas: true
  },
  {
    id: 3,
    name: "Paket Bulanan",
    jenis: "hemat",
    price: 350000,
    period: "/ 30 hari (2x makan/hari)",
    durasi: "30 Hari",
    estimasi: "± 30 Menit",
    menuGanti: "Setiap Hari",
    benefits: [
      "Harga per porsi paling murah",
      "Konsultasi menu mingguan gratis",
      "Bebas pilih semua menu tersedia"
    ],
    ongkir: true,
    konsultasi: true,
    prioritas: true
  }
];

function formatRupiah(num){
  return "Rp" + num.toLocaleString("id-ID");
}

/* ==================== RENDER GRID PAKET ==================== */
function renderGrid(){
  const grid = document.getElementById("paketGrid");
  document.getElementById("totalPaket").textContent = paketList.length;

  grid.innerHTML = paketList.map(p => {
    const jenisInfo = JENIS_PAKET[p.jenis] || { icon: "bi-box-seam", badgeLabel: "", badgeIcon: "" };
    const badgeHtml = p.jenis
      ? `<div class="paket-badge ${p.jenis}"><i class="bi ${jenisInfo.badgeIcon}"></i> ${jenisInfo.badgeLabel}</div>`
      : "";

    const benefitsHtml = p.benefits.map(b => `<li><i class="bi bi-check-circle-fill"></i> ${b}</li>`).join("");

    return `
    <div class="col-lg-4 col-md-6">
      <div class="paket-card ${p.jenis || ''}">
        ${badgeHtml}
        <div class="paket-icon"><i class="bi ${jenisInfo.icon}"></i></div>
        <h4>${p.name}</h4>
        <span class="paket-price">${formatRupiah(p.price)}</span>
        <span class="paket-period">${p.period}</span>

        <div class="paket-info-row"><span><i class="bi bi-clock"></i> Durasi</span><span>${p.durasi}</span></div>
        <div class="paket-info-row"><span><i class="bi bi-truck"></i> Estimasi Antar</span><span>${p.estimasi}</span></div>
        <div class="paket-info-row"><span><i class="bi bi-arrow-repeat"></i> Menu Berganti</span><span>${p.menuGanti}</span></div>

        <ul class="paket-benefit-list">${benefitsHtml}</ul>

        <div class="paket-extra">
          <span class="tag ${p.ongkir ? 'tag-yes' : 'tag-no'}"><i class="bi ${p.ongkir ? 'bi-check-circle' : 'bi-x-circle'}"></i> Gratis Ongkir</span>
          <span class="tag ${p.konsultasi ? 'tag-yes' : 'tag-no'}"><i class="bi ${p.konsultasi ? 'bi-check-circle' : 'bi-x-circle'}"></i> Konsultasi Menu</span>
          <span class="tag ${p.prioritas ? 'tag-yes' : 'tag-no'}"><i class="bi ${p.prioritas ? 'bi-check-circle' : 'bi-x-circle'}"></i> Prioritas Antar</span>
        </div>

        <div class="paket-actions">
          <button class="btn btn-outline-dark" onclick="openEditModal(${p.id})"><i class="bi bi-pencil-square"></i> Edit</button>
          <button class="btn btn-outline-danger" onclick="deletePaket(${p.id})"><i class="bi bi-trash"></i> Hapus</button>
        </div>
      </div>
    </div>`;
  }).join("");

  renderCompareTable();
}

/* ==================== RENDER TABEL PERBANDINGAN ==================== */
function renderCompareTable(){
  const thead = document.querySelector("#compareTable thead tr");
  thead.innerHTML = `<th>Fitur</th>` + paketList.map(p => `<th>${p.name}</th>`).join("");

  const rows = [
    { label: "Harga", getVal: p => formatRupiah(p.price) + " " + p.period },
    { label: "Durasi", getVal: p => p.durasi },
    { label: "Estimasi Pengiriman", getVal: p => p.estimasi },
    { label: "Menu Berganti Setiap Hari", getVal: p => p.menuGanti },
    { label: "Gratis Ongkir", getVal: p => p.ongkir ? `<i class="bi bi-check-circle-fill icon-yes"></i>` : `<i class="bi bi-x-circle icon-no"></i>` },
    { label: "Konsultasi Menu", getVal: p => p.konsultasi ? `<i class="bi bi-check-circle-fill icon-yes"></i>` : `<i class="bi bi-x-circle icon-no"></i>` },
    { label: "Prioritas Pengiriman", getVal: p => p.prioritas ? `<i class="bi bi-check-circle-fill icon-yes"></i>` : `<i class="bi bi-x-circle icon-no"></i>` }
  ];

  const body = document.getElementById("compareBody");
  body.innerHTML = rows.map(row => `
    <tr>
      <td>${row.label}</td>
      ${paketList.map(p => `<td>${row.getVal(p)}</td>`).join("")}
    </tr>
  `).join("");
}

/* ==================== MODAL TAMBAH ==================== */
function openAddModal(){
  document.getElementById("modalTitle").textContent = "Tambah Paket";
  document.getElementById("paketForm").reset();
  document.getElementById("paketId").value = "";
}

/* ==================== MODAL EDIT ==================== */
function openEditModal(id){
  const p = paketList.find(x => x.id === id);
  if(!p) return;

  document.getElementById("modalTitle").textContent = "Edit Paket";
  document.getElementById("paketId").value = p.id;
  document.getElementById("paketName").value = p.name;
  document.getElementById("paketJenis").value = p.jenis || "";
  document.getElementById("paketPrice").value = p.price;
  document.getElementById("paketPeriod").value = p.period;
  document.getElementById("paketDurasi").value = p.durasi;
  document.getElementById("paketEstimasi").value = p.estimasi;
  document.getElementById("paketMenuGanti").value = p.menuGanti;
  document.getElementById("paketBenefits").value = p.benefits.join("\n");
  document.getElementById("paketOngkir").checked = p.ongkir;
  document.getElementById("paketKonsultasi").checked = p.konsultasi;
  document.getElementById("paketPrioritas").checked = p.prioritas;

  const modal = new bootstrap.Modal(document.getElementById("paketModal"));
  modal.show();
}

/* ==================== SIMPAN (TAMBAH / EDIT) ==================== */
// TODO Backend: ganti manipulasi array paketList ini dengan panggilan REST API:
// - Tambah  : POST   /api/admin/paket
// - Edit    : PUT    /api/admin/paket/{id}
// - Ambil   : GET    /api/admin/paket
document.getElementById("paketForm").addEventListener("submit", function(e){
  e.preventDefault();

  const id = document.getElementById("paketId").value;
  const data = {
    name: document.getElementById("paketName").value,
    jenis: document.getElementById("paketJenis").value,
    price: parseInt(document.getElementById("paketPrice").value),
    period: document.getElementById("paketPeriod").value,
    durasi: document.getElementById("paketDurasi").value,
    estimasi: document.getElementById("paketEstimasi").value,
    menuGanti: document.getElementById("paketMenuGanti").value,
    benefits: document.getElementById("paketBenefits").value.split("\n").map(s => s.trim()).filter(Boolean),
    ongkir: document.getElementById("paketOngkir").checked,
    konsultasi: document.getElementById("paketKonsultasi").checked,
    prioritas: document.getElementById("paketPrioritas").checked
  };

  if(id){
    const p = paketList.find(x => x.id == id);
    Object.assign(p, data);
  } else {
    const newId = paketList.length ? Math.max(...paketList.map(x => x.id)) + 1 : 1;
    paketList.push({ id: newId, ...data });
  }

  renderGrid();
  bootstrap.Modal.getInstance(document.getElementById("paketModal")).hide();
  tampilkanToast(id ? "Paket berhasil diperbarui!" : "Paket berhasil ditambahkan!", "success");
});

/* ==================== HAPUS PAKET (Bootstrap Modal) ==================== */
// TODO Backend: DELETE /api/admin/paket/{id}
let paketIdAkanDihapus = null;
const deletePaketModalEl = document.getElementById("deletePaketModal");
const deletePaketModal = new bootstrap.Modal(deletePaketModalEl);

function deletePaket(id){
  const p = paketList.find(x => x.id === id);
  if(!p) return;
  paketIdAkanDihapus = id;
  document.getElementById("deletePaketName").textContent = `"${p.name}"`;
  deletePaketModal.show();
}

document.getElementById("confirmDeletePaketBtn").addEventListener("click", function(){
  if(paketIdAkanDihapus === null) return;
  paketList = paketList.filter(p => p.id !== paketIdAkanDihapus);
  renderGrid();
  deletePaketModal.hide();
  tampilkanToast("Paket berhasil dihapus!", "danger");
  paketIdAkanDihapus = null;
});

/* ==================== INIT ==================== */
renderGrid();
