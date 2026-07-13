/* ==================== menu.js ====================
   Script khusus halaman kelola-menu.html
   Membutuhkan assets/js/admin.js (tampilkanToast, dsb) sudah dimuat lebih dulu.
   ==================================================== */

/* ==================== DATA MENU ==================== */
let menuItems = [
  { id: 1,  name: "Nasi Uduk Komplit",        category: "sarapan",      desc: "Nasi uduk gurih dengan ayam suwir, telur, dan sambal kacang.", price: 12000,  img: "https://thumb.viva.id/vivapurwasuka/665x374/2025/01/30/679a9491b8f3d-nasi-uduk_purwasuka.jpg" },
  { id: 2,  name: "Bubur Ayam Spesial",       category: "sarapan",      desc: "Bubur lembut dengan suwiran ayam, cakwe, dan kerupuk.",         price: 10000, img: "https://asset.kompas.com/crops/Xd5p_ptNeya-LsNQ0CxWomaW0KI=/0x0:1000x667/1200x800/data/photo/2020/07/11/5f09e008e7fee.jpg" },
  { id: 3,  name: "Roti Bakar Coklat Keju",   category: "sarapan",      desc: "Roti bakar renyah isi coklat leleh dan keju parut melimpah.",   price: 8000,  img: "https://tse2.mm.bing.net/th/id/OIP.9zEoX0bYgJ2iOOy9AInoKgHaFU?r=0&pid=Api&P=0&h=180" },
  { id: 4,  name: "Nasi Goreng Spesial",      category: "makan-siang",  desc: "Nasi goreng bumbu rumahan dengan telur, ayam, dan acar segar.", price: 15000, img: "https://tse1.mm.bing.net/th/id/OIP.tIZlQzdzEnwjkP8FAeDJ-QHaE1?r=0&pid=Api&P=0&h=180" },
  { id: 5,  name: "Ayam Geprek Sambal Bawang",category: "makan-siang",  desc: "Ayam crispy digeprek dengan sambal bawang pedas nampol.",       price: 16000, img: "https://thumbs.dreamstime.com/b/ayam-geprek-indonesian-food-crispy-fried-chicken-hot-spicy-sambal-chili-sauce-currently-found-indonesia-215159626.jpg" },
  { id: 6,  name: "Nasi Padang Rendang",      category: "makan-siang",  desc: "Nasi hangat dengan rendang empuk dan sayur nangka.",            price: 18000, img: "https://tse4.mm.bing.net/th/id/OIP.EADz9vBbtZf0DNyXvYdPeQHaE8?r=0&pid=Api&P=0&h=180" },
  { id: 7,  name: "Mie Goreng Jawa",          category: "makan-siang",  desc: "Mie goreng khas Jawa dengan telur, kol, dan bakso iris.",       price: 14000, img: "https://tse4.mm.bing.net/th/id/OIP.CB8rXfkckwuZVVQm1spX-gHaEK?r=0&pid=Api&P=0&h=180" },
  { id: 8,  name: "Soto Ayam Kampung",        category: "makan-malam",  desc: "Kuah bening segar dengan ayam kampung dan koya gurih.",         price: 15000, img: "https://www.dapurkobe.co.id/wp-content/uploads/soto-ayam.jpg" },
  { id: 9,  name: "Nasi Bakar Ayam Suwir",    category: "makan-malam",  desc: "Nasi dibakar daun pisang, isi ayam suwir bumbu meresap.",       price: 17000, img: "https://img-global.cpcdn.com/recipes/8d586dec2273f9ac/1200x630cq70/photo.jpg" },
  { id: 10, name: "Sate Ayam Madura",         category: "makan-malam",  desc: "Sate ayam empuk dengan bumbu kacang khas Madura.",              price: 16000, img: "https://2.bp.blogspot.com/-Q417tM9i4sc/UeAjUYDVfPI/AAAAAAAAAWg/MCZp4ZxhXUI/s1600/sate+ayam+madura.jpeg" },
  { id: 11, name: "Es Teh Manis",             category: "minuman",      desc: "Teh manis dingin segar, pelepas dahaga sehari-hari.",           price: 4000,  img: "https://tse3.mm.bing.net/th/id/OIP.2f0ccJB5cfeLh3hCKGdBbQHaFE?r=0&pid=Api&P=0&h=180" },
  { id: 12, name: "Es Jeruk Peras",           category: "minuman",      desc: "Perasan jeruk segar asli tanpa pemanis buatan.",                price: 6000,  img: "https://img-global.cpcdn.com/recipes/07049e233488cb67/680x482cq70/es-jeruk-peras-foto-resep-utama.jpg" },
  { id: 13, name: "Kopi Susu Gula Aren",      category: "minuman",      desc: "Kopi susu creamy dengan manis alami gula aren.",                price: 8000,  img: "https://img.okezone.com/content/2019/10/11/298/2115704/tips-bikin-es-kopi-susu-gula-aren-ala-coffee-shop-C2nLIqHPDk.jpg" },
  { id: 14, name: "Risoles Mayo",             category: "snack",        desc: "Risoles isi sayur, sosis, dan mayo lumer di dalamnya.",         price: 5000,  img: "https://i.pinimg.com/originals/5f/31/a2/5f31a212ec9ec5aaa4746cf7de936a69.jpg" },
  { id: 15, name: "Pisang Goreng Crispy",     category: "snack",        desc: "Pisang goreng renyah di luar, lembut manis di dalam.",          price: 6000,  img: "https://fibercreme.com/wp-content/uploads/2025/06/Header-3.webp" },
  { id: 16, name: "Tahu Isi Sayur",           category: "snack",        desc: "Tahu goreng renyah berisi tumisan sayur gurih.",                price: 5000,  img: "https://img.herstory.co.id/articles/archive_20230309/resep-masakan-20230309-112018.jpg" }
];

const categoryLabel = {
  "sarapan": "Sarapan",
  "makan-siang": "Makan Siang",
  "makan-malam": "Makan Malam",
  "minuman": "Minuman",
  "snack": "Snack"
};

let activeCategory = "semua";
let searchQuery = "";

/* ==================== FORMAT RUPIAH ==================== */
function formatRupiah(num){
  return "Rp" + num.toLocaleString("id-ID");
}

/* ==================== RENDER FILTER TABS ==================== */
function renderTabs(){
  const tabs = document.getElementById("filterTabs");
  let html = `<button class="${activeCategory==='semua'?'active':''}" onclick="setCategory('semua')">Semua</button>`;
  for(const key in categoryLabel){
    html += `<button class="${activeCategory===key?'active':''}" onclick="setCategory('${key}')">${categoryLabel[key]}</button>`;
  }
  tabs.innerHTML = html;
}

function setCategory(cat){
  activeCategory = cat;
  renderTabs();
  renderGrid();
}

/* ==================== RENDER GRID MENU ==================== */
function renderGrid(){
  const grid = document.getElementById("menuGrid");

  let filtered = menuItems.filter(item => {
    const matchCategory = activeCategory === "semua" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if(filtered.length === 0){
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="bi bi-cup-hot"></i>
          <p>Menu tidak ditemukan.</p>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="col-lg-3 col-md-6">
      <div class="menu-card">
        <img src="${item.img}" alt="${item.name}">
        <div class="body">
          <span class="cat-badge">${categoryLabel[item.category]}</span>
          <h5>${item.name}</h5>
          <p class="desc">${item.desc}</p>
          <div class="price">${formatRupiah(item.price)}</div>
          <div class="actions">
            <button class="btn btn-outline-dark" onclick="openEditModal(${item.id})">
              <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button class="btn btn-outline-danger" onclick="deleteMenu(${item.id})">
              <i class="bi bi-trash"></i> Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

/* ==================== SEARCH ==================== */
document.getElementById("searchInput").addEventListener("input", function(e){
  searchQuery = e.target.value;
  renderGrid();
});

/* ==================== UPLOAD FOTO (dummy preview) ==================== */
const menuImgFile = document.getElementById("menuImgFile");
const uploadPreviewImg = document.getElementById("uploadPreviewImg");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");

function tampilkanPreviewFoto(url){
    if(url){
        uploadPreviewImg.src = url;
        uploadPreviewImg.style.display = "block";
        uploadPlaceholder.style.display = "none";
    } else {
        uploadPreviewImg.src = "";
        uploadPreviewImg.style.display = "none";
        uploadPlaceholder.style.display = "block";
    }
}

menuImgFile.addEventListener("change", function(e){
    const file = e.target.files[0];
    if(!file) return;

    // Dummy preview via FileReader — belum diupload ke server manapun.
    const reader = new FileReader();
    reader.onload = function(ev){
        tampilkanPreviewFoto(ev.target.result);
        document.getElementById("menuImg").value = ev.target.result;
    };
    reader.readAsDataURL(file);
});

/* ==================== MODAL TAMBAH ==================== */
function openAddModal(){
  document.getElementById("modalTitle").textContent = "Tambah Menu";
  document.getElementById("menuForm").reset();
  document.getElementById("menuId").value = "";
  tampilkanPreviewFoto("");
}

/* ==================== MODAL EDIT ==================== */
function openEditModal(id){
  const item = menuItems.find(m => m.id === id);
  if(!item) return;

  document.getElementById("modalTitle").textContent = "Edit Menu";
  document.getElementById("menuId").value = item.id;
  document.getElementById("menuName").value = item.name;
  document.getElementById("menuCategory").value = item.category;
  document.getElementById("menuDesc").value = item.desc;
  document.getElementById("menuPrice").value = item.price;
  document.getElementById("menuImg").value = item.img;
  tampilkanPreviewFoto(item.img);

  const modal = new bootstrap.Modal(document.getElementById("menuModal"));
  modal.show();
}

/* ==================== SIMPAN (TAMBAH / EDIT) ==================== */
// TODO Backend: ganti manipulasi array menuItems ini dengan panggilan REST API:
// - Tambah  : POST   /api/admin/menu
// - Edit    : PUT    /api/admin/menu/{id}
// - Ambil   : GET    /api/admin/menu
document.getElementById("menuForm").addEventListener("submit", function(e){
  e.preventDefault();

  const id = document.getElementById("menuId").value;
  const name = document.getElementById("menuName").value;
  const category = document.getElementById("menuCategory").value;
  const desc = document.getElementById("menuDesc").value;
  const price = parseInt(document.getElementById("menuPrice").value);
  const img = document.getElementById("menuImg").value || "https://placehold.co/500x375/E5D0AC/6D2323?font=poppins&text=" + encodeURIComponent(name);

  if(id){
    // EDIT
    const item = menuItems.find(m => m.id == id);
    item.name = name;
    item.category = category;
    item.desc = desc;
    item.price = price;
    item.img = img;
  } else {
    // TAMBAH BARU
    const newId = menuItems.length ? Math.max(...menuItems.map(m => m.id)) + 1 : 1;
    menuItems.push({ id: newId, name, category, desc, price, img });
  }

  renderGrid();
  bootstrap.Modal.getInstance(document.getElementById("menuModal")).hide();
  tampilkanToast(id ? "Menu berhasil diperbarui!" : "Menu berhasil ditambahkan!", "success");
});

/* ==================== HAPUS MENU (Bootstrap Modal) ==================== */
// TODO Backend: DELETE /api/admin/menu/{id}
let menuIdAkanDihapus = null;
const deleteMenuModalEl = document.getElementById("deleteMenuModal");
const deleteMenuModal = new bootstrap.Modal(deleteMenuModalEl);

function deleteMenu(id){
  const item = menuItems.find(m => m.id === id);
  if(!item) return;
  menuIdAkanDihapus = id;
  document.getElementById("deleteMenuName").textContent = `"${item.name}"`;
  deleteMenuModal.show();
}

document.getElementById("confirmDeleteMenuBtn").addEventListener("click", function(){
  if(menuIdAkanDihapus === null) return;
  menuItems = menuItems.filter(m => m.id !== menuIdAkanDihapus);
  renderGrid();
  deleteMenuModal.hide();
  tampilkanToast("Menu berhasil dihapus!", "danger");
  menuIdAkanDihapus = null;
});

/* ==================== INIT ==================== */
renderTabs();
renderGrid();
