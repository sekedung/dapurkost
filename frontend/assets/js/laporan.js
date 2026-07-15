/* ==================== laporan.js ====================
   Script khusus halaman laporan-admin.html
   Membutuhkan assets/js/admin.js (tampilkanToast, dsb) sudah dimuat lebih dulu.
   ==================================================== */

/* ==================== DATA LAPORAN (dummy) ==================== */
const dataLaporan = {
  ringkasan: {
    pendapatan: "Rp 8.700.000",
    pesanan: 325,
    pelanggan: 125,
    menuAktif: 25
  },
  pendapatanBulanan: [
    { bulan: "Januari",  nilai: 2000000 },
    { bulan: "Februari", nilai: 2500000 },
    { bulan: "Maret",    nilai: 3000000 },
    { bulan: "April",    nilai: 4000000 },
    { bulan: "Mei",      nilai: 6000000 },
    { bulan: "Juni",     nilai: 8700000 }
  ],
  pesananMingguan: [
    { hari: "Sen", jumlah: 15 },
    { hari: "Sel", jumlah: 22 },
    { hari: "Rab", jumlah: 18 },
    { hari: "Kam", jumlah: 25 },
    { hari: "Jum", jumlah: 30 },
    { hari: "Sab", jumlah: 35 },
    { hari: "Min", jumlah: 28 }
  ],
  menuTerlaris: [
    { nama: "Nasi Ayam Geprek", jumlah: 120 },
    { nama: "Ayam Bakar",       jumlah: 95 },
    { nama: "Capcay",           jumlah: 80 },
    { nama: "Nasi Goreng Spesial", jumlah: 64 }
  ],
  paketFavorit: [
    { nama: "Mingguan", total: 52, warna: "#A31D1D" },
    { nama: "Bulanan",  total: 35, warna: "#D4A017" },
    { nama: "Harian",   total: 18, warna: "#2E8B57" }
  ]
};

function formatRupiah(num){
  return "Rp" + num.toLocaleString("id-ID");
}

/* ==================== RENDER PENDAPATAN BULANAN (BAR CSS) ==================== */
function renderPendapatanBulanan(){
  const box = document.getElementById("pendapatanBulananBox");
  const max = Math.max(...dataLaporan.pendapatanBulanan.map(d => d.nilai));

  box.innerHTML = dataLaporan.pendapatanBulanan.map(d => `
    <div class="bar-row">
      <div class="bar-label">${d.bulan}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(d.nilai/max*100).toFixed(0)}%"></div></div>
      <div class="bar-value">${formatRupiah(d.nilai)}</div>
    </div>
  `).join("");
}

/* ==================== RENDER PESANAN MINGGUAN (BAR VERTIKAL CSS) ==================== */
function renderPesananMingguan(){
  const box = document.getElementById("pesananMingguanBox");
  const max = Math.max(...dataLaporan.pesananMingguan.map(d => d.jumlah));

  box.innerHTML = dataLaporan.pesananMingguan.map(d => `
    <div class="week-col">
      <div class="week-bar-num">${d.jumlah}</div>
      <div class="week-bar" style="height:${(d.jumlah/max*100).toFixed(0)}%"></div>
      <div class="week-day">${d.hari}</div>
    </div>
  `).join("");
}

/* ==================== RENDER MENU TERLARIS ==================== */
function renderMenuTerlaris(){
  const box = document.getElementById("menuTerlarisBox");
  const max = Math.max(...dataLaporan.menuTerlaris.map(d => d.jumlah));
  const badgeClass = ["gold","silver","bronze",""];

  box.innerHTML = dataLaporan.menuTerlaris.map((d, i) => `
    <div class="rank-item">
      <div class="rank-badge ${badgeClass[i] || ''}">${i+1}</div>
      <div class="rank-info">
        <strong>${d.nama}</strong>
        <small>${d.jumlah} Pesanan</small>
        <div class="rank-track"><div class="rank-fill" style="width:${(d.jumlah/max*100).toFixed(0)}%"></div></div>
      </div>
    </div>
  `).join("");
}

/* ==================== RENDER PAKET FAVORIT ==================== */
function renderPaketFavorit(){
  const tbody = document.querySelector("#paketFavoritTable tbody");
  const total = dataLaporan.paketFavorit.reduce((a,b) => a + b.total, 0);

  tbody.innerHTML = dataLaporan.paketFavorit.map(p => {
    const persen = ((p.total/total)*100).toFixed(0);
    return `
      <tr>
        <td><span class="paket-dot" style="background:${p.warna}"></span>${p.nama}</td>
        <td>${p.total}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="bar-track" style="height:8px;">
              <div class="bar-fill" style="width:${persen}%; background:${p.warna};"></div>
            </div>
            <small>${persen}%</small>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

/* ==================== EXPORT EXCEL ==================== */
function exportExcel(){
  const wb = XLSX.utils.book_new();

  // Sheet 1: Ringkasan
  const ringkasanData = [
    ["Laporan Bisnis DapurKost"],
    [],
    ["Pendapatan", dataLaporan.ringkasan.pendapatan],
    ["Total Pesanan", dataLaporan.ringkasan.pesanan],
    ["Pelanggan Aktif", dataLaporan.ringkasan.pelanggan],
    ["Menu Aktif", dataLaporan.ringkasan.menuAktif]
  ];
  const wsRingkasan = XLSX.utils.aoa_to_sheet(ringkasanData);
  XLSX.utils.book_append_sheet(wb, wsRingkasan, "Ringkasan");

  // Sheet 2: Pendapatan Bulanan
  const pendapatanData = [["Bulan", "Pendapatan"]];
  dataLaporan.pendapatanBulanan.forEach(d => pendapatanData.push([d.bulan, d.nilai]));
  const wsPendapatan = XLSX.utils.aoa_to_sheet(pendapatanData);
  XLSX.utils.book_append_sheet(wb, wsPendapatan, "Pendapatan Bulanan");

  // Sheet 3: Pesanan Mingguan
  const mingguanData = [["Hari", "Jumlah Pesanan"]];
  dataLaporan.pesananMingguan.forEach(d => mingguanData.push([d.hari, d.jumlah]));
  const wsMingguan = XLSX.utils.aoa_to_sheet(mingguanData);
  XLSX.utils.book_append_sheet(wb, wsMingguan, "Pesanan Mingguan");

  // Sheet 4: Menu Terlaris
  const menuData = [["Menu", "Jumlah Pesanan"]];
  dataLaporan.menuTerlaris.forEach(d => menuData.push([d.nama, d.jumlah]));
  const wsMenu = XLSX.utils.aoa_to_sheet(menuData);
  XLSX.utils.book_append_sheet(wb, wsMenu, "Menu Terlaris");

  // Sheet 5: Paket Favorit
  const paketData = [["Paket", "Total Pemesan"]];
  dataLaporan.paketFavorit.forEach(d => paketData.push([d.nama, d.total]));
  const wsPaket = XLSX.utils.aoa_to_sheet(paketData);
  XLSX.utils.book_append_sheet(wb, wsPaket, "Paket Favorit");

  const tanggal = new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb, `Laporan-DapurKost-${tanggal}.xlsx`);
}

/* ==================== EXPORT PDF ==================== */
function exportPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(163, 29, 29);
  doc.text("Laporan Bisnis DapurKost", 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}`, 14, 24);

  // Ringkasan
  doc.autoTable({
    startY: 30,
    head: [["Ringkasan", "Nilai"]],
    body: [
      ["Pendapatan", dataLaporan.ringkasan.pendapatan],
      ["Total Pesanan", dataLaporan.ringkasan.pesanan],
      ["Pelanggan Aktif", dataLaporan.ringkasan.pelanggan],
      ["Menu Aktif", dataLaporan.ringkasan.menuAktif]
    ],
    theme: "grid",
    headStyles: { fillColor: [163, 29, 29] }
  });

  // Pendapatan Bulanan
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Bulan", "Pendapatan"]],
    body: dataLaporan.pendapatanBulanan.map(d => [d.bulan, formatRupiah(d.nilai)]),
    theme: "grid",
    headStyles: { fillColor: [163, 29, 29] }
  });

  // Menu Terlaris
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Menu Terlaris", "Jumlah Pesanan"]],
    body: dataLaporan.menuTerlaris.map(d => [d.nama, d.jumlah]),
    theme: "grid",
    headStyles: { fillColor: [163, 29, 29] }
  });

  // Paket Favorit
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Paket Favorit", "Total Pemesan"]],
    body: dataLaporan.paketFavorit.map(d => [d.nama, d.total]),
    theme: "grid",
    headStyles: { fillColor: [163, 29, 29] }
  });

  const tanggal = new Date().toISOString().slice(0,10);
  doc.save(`Laporan-DapurKost-${tanggal}.pdf`);
}

/* ==================== RINGKASAN SEBELUM EXPORT ==================== */
function renderRingkasanExport(){
  document.getElementById("ringkasanTransaksi").textContent = dataLaporan.ringkasan.pesanan;
  document.getElementById("ringkasanPendapatan").textContent = dataLaporan.ringkasan.pendapatan;
  document.getElementById("ringkasanPesanan").textContent = dataLaporan.ringkasan.pesanan + " pesanan";
}

/* ==================== PREVIEW DATA EXPORT ==================== */
function renderPreviewExport(){
  const tbody = document.querySelector("#previewExportTable tbody");
  if(!tbody) return;

  const baris = [
    {
      sheet: "Ringkasan",
      isi: `Pendapatan ${dataLaporan.ringkasan.pendapatan}, ${dataLaporan.ringkasan.pesanan} pesanan, ${dataLaporan.ringkasan.pelanggan} pelanggan, ${dataLaporan.ringkasan.menuAktif} menu aktif`
    },
    {
      sheet: "Pendapatan Bulanan",
      isi: dataLaporan.pendapatanBulanan.map(d => `${d.bulan}: ${formatRupiah(d.nilai)}`).join(" &middot; ")
    },
    {
      sheet: "Pesanan Mingguan",
      isi: dataLaporan.pesananMingguan.map(d => `${d.hari}: ${d.jumlah}`).join(" &middot; ")
    },
    {
      sheet: "Menu Terlaris",
      isi: dataLaporan.menuTerlaris.map(d => `${d.nama} (${d.jumlah}x)`).join(" &middot; ")
    },
    {
      sheet: "Paket Favorit",
      isi: dataLaporan.paketFavorit.map(d => `${d.nama}: ${d.total} pemesan`).join(" &middot; ")
    }
  ];

  tbody.innerHTML = baris.map(b => `
    <tr>
      <td class="fw-semibold" style="width:180px;">${b.sheet}</td>
      <td class="text-muted small">${b.isi}</td>
    </tr>
  `).join("");
}

/* ==================== INIT ==================== */
renderRingkasanExport();
renderPendapatanBulanan();
renderPesananMingguan();
renderMenuTerlaris();
renderPaketFavorit();
renderPreviewExport();