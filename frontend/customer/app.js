// ============================================================
// DAPURKOST - DATA MANAGER (app.js)
// Compatible dengan: menu.html, paket.html, checkout.html, pembayaran.html, riwayat.html
// ============================================================

// ============ STORAGE KEYS ============
const STORAGE_KEYS = {
  CART: 'dapurkost_cart',
  SELECTED_PAKET: 'dapurkost_selected_paket',
  PENDING_ORDER: 'pendingOrder',
  ORDER_HISTORY: 'dapurkost_order_history'
};

// ============ CART MANAGER ============
class CartManager {
  static getCart() {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  }

  static addToCart(item) {
    const cart = this.getCart();
    const existing = cart.find(c => c.id === item.id);
    
    if (existing) {
      existing.qty = (existing.qty || 1) + (item.qty || 1);
    } else {
      cart.push({
        id: item.id,
        name: item.name || item.nama,
        price: item.price || item.harga,
        img: item.img || item.image,
        qty: item.qty || 1
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  static updateQty(itemId, qty) {
    const cart = this.getCart();
    const item = cart.find(c => c.id === itemId);
    
    if (item) {
      if (qty <= 0) {
        return this.removeFromCart(itemId);
      }
      item.qty = qty;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }
    
    return cart;
  }

  static removeFromCart(itemId) {
    let cart = this.getCart();
    cart = cart.filter(c => c.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  static clearCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
  }

  static getTotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  }

  static getItemCount() {
    return this.getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
  }
}

// ============ PACKAGE MANAGER ============
class PackageManager {
  static PACKAGES = {
    harian: {
      id: 'harian',
      key: 'harian',
      name: 'Paket Harian',
      nama: 'Paket Harian',
      price: 60000,
      harga: 60000,
      duration: 1,
      periode: '1 Hari',
      meals: 3,
      description: '1 Hari - 3x Makan',
      icon: '🍱'
    },
    mingguan: {
      id: 'mingguan',
      key: 'mingguan',
      name: 'Paket Mingguan',
      nama: 'Paket Mingguan',
      price: 315000,
      harga: 315000,
      duration: 7,
      periode: '7 Hari',
      meals: 2,
      description: '7 Hari - 2x Makan/Hari (Gratis Ongkir)',
      icon: '📦'
    },
    bulanan: {
      id: 'bulanan',
      key: 'bulanan',
      name: 'Paket Bulanan',
      nama: 'Paket Bulanan',
      price: 1260000,
      harga: 1260000,
      duration: 30,
      periode: '30 Hari',
      meals: 3,
      description: '30 Hari - 3x Makan/Hari (Konsultasi Gratis)',
      icon: '📅'
    }
  };

  static selectPackage(packageId) {
    const pkg = this.PACKAGES[packageId];
    if (!pkg) return null;
    
    // Hapus cart saat pilih paket (mode eksklusif)
    CartManager.clearCart();
    
    localStorage.setItem(STORAGE_KEYS.SELECTED_PAKET, JSON.stringify(pkg));
    return pkg;
  }

  static getSelectedPackage() {
    const data = localStorage.getItem(STORAGE_KEYS.SELECTED_PAKET);
    return data ? JSON.parse(data) : null;
  }

  static clearPackage() {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_PAKET);
  }

  static getAllPackages() {
    return Object.values(this.PACKAGES);
  }
}

// ============ ORDER MANAGER ============
class OrderManager {
  static createPendingOrder(formData) {
    const cart = CartManager.getCart();
    const selectedPackage = PackageManager.getSelectedPackage();
    const source = selectedPackage ? 'paket' : 'menu';

    // Generate order ID
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const orderId = `#DK-${today}-${random}`;

    // Hitung pricing
    let subtotal = 0;
    let items = [];

    if (source === 'paket') {
      subtotal = selectedPackage.price;
      items = [selectedPackage];
    } else {
      subtotal = CartManager.getTotal();
      items = cart;
    }

    const ongkir = (subtotal === 0 || subtotal >= 100000) ? 0 : 8000;
    const discount = 0;
    const total = subtotal + ongkir - discount;

    const pendingOrder = {
      id: orderId,
      type: source, // 'paket' atau 'menu'
      items: items,
      formData: {
        address: formData.address,
        startDate: formData.startDate,
        notes: formData.notes
      },
      pricing: {
        subtotal: subtotal,
        ongkir: ongkir,
        discount: discount,
        total: total
      },
      payment: {
        method: null,
        proof: null,
        status: 'pending' // pending, waiting_confirmation, confirmed
      },
      status: 'Pending Pembayaran',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.PENDING_ORDER, JSON.stringify(pendingOrder));
    return pendingOrder;
  }

  static getPendingOrder() {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_ORDER);
    return data ? JSON.parse(data) : null;
  }

  static updatePaymentMethod(method, proof = null) {
    const order = this.getPendingOrder();
    if (!order) return null;

    order.payment.method = method;
    if (proof) order.payment.proof = proof;
    order.payment.status = proof ? 'waiting_confirmation' : 'pending';
    order.status = 'Menunggu Verifikasi';
    order.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.PENDING_ORDER, JSON.stringify(order));
    return order;
  }

  static confirmPayment() {
    const order = this.getPendingOrder();
    if (!order) return null;

    order.payment.status = 'confirmed';
    order.status = 'Diproses';
    order.updatedAt = new Date().toISOString();

    // Pindahkan ke history
    const history = this.getOrderHistory();
    history.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(history));

    // Clear
    localStorage.removeItem(STORAGE_KEYS.PENDING_ORDER);
    CartManager.clearCart();
    PackageManager.clearPackage();

    return order;
  }

  static getOrderHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY);
    return data ? JSON.parse(data) : [];
  }

  static getOrderById(orderId) {
    // Cek pending order dulu
    const pending = this.getPendingOrder();
    if (pending && pending.id === orderId) return pending;

    // Cek history
    const history = this.getOrderHistory();
    return history.find(o => o.id === orderId);
  }

  static updateOrderStatus(orderId, status) {
    let order = null;
    const pending = this.getPendingOrder();
    
    if (pending && pending.id === orderId) {
      pending.status = status;
      pending.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PENDING_ORDER, JSON.stringify(pending));
      order = pending;
    } else {
      const history = this.getOrderHistory();
      order = history.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(history));
      }
    }
    return order;
  }

  static cancelOrder(orderId) {
    const order = this.getOrderById(orderId);
    if (order) {
      order.status = 'Dibatalkan';
      order.updatedAt = new Date().toISOString();

      const pending = this.getPendingOrder();
      if (pending && pending.id === orderId) {
        localStorage.setItem(STORAGE_KEYS.PENDING_ORDER, JSON.stringify(order));
      } else {
        const history = this.getOrderHistory();
        const idx = history.findIndex(o => o.id === orderId);
        if (idx >= 0) {
          history[idx] = order;
          localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(history));
        }
      }
    }
    return order;
  }
}

// ============ UTILITY FUNCTIONS ============
function formatRupiah(angka) {
  if (!angka) return 'Rp0';
  return 'Rp' + Math.round(angka).toLocaleString('id-ID');
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  return formatDate(dateString) + ' ' + formatTime(dateString);
}

function getDayFromDate(dateString) {
  if (!dateString) return '-';
  const options = { weekday: 'long' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function getStatusBadge(status) {
  const statuses = {
    'Pending Pembayaran': { icon: '⏳', color: 'warning', label: 'Menunggu Pembayaran' },
    'Menunggu Verifikasi': { icon: '👀', color: 'info', label: 'Menunggu Verifikasi' },
    'Diproses': { icon: '🔄', color: 'info', label: 'Diproses' },
    'Dikirim': { icon: '🚚', color: 'primary', label: 'Dikirim' },
    'Selesai': { icon: '✓', color: 'success', label: 'Selesai' },
    'Dibatalkan': { icon: '✗', color: 'danger', label: 'Dibatalkan' }
  };
  return statuses[status] || statuses['Pending Pembayaran'];
}

// ============ EXPORT UNTUK BROWSER ============
// Fungsi-fungsi ini bisa diakses langsung dari HTML yang include app.js
window.CartManager = CartManager;
window.PackageManager = PackageManager;
window.OrderManager = OrderManager;
window.formatRupiah = formatRupiah;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatDateTime = formatDateTime;
window.getDayFromDate = getDayFromDate;
window.getStatusBadge = getStatusBadge;