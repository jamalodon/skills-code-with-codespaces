// Data Keranjang
let cart = [];
const waNumber = "6281234567890"; // GANTI dengan nomor WhatsApp Anda!

// Elemen DOM
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart-icon');
const closeBtn = document.querySelector('.close-btn');
const cartItemsList = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Fungsi Format Angka ke Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Fungsi Menambahkan Produk ke Keranjang
function addToCart(event) {
    const button = event.target;
    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartDisplay();
    alert(`"${name}" telah ditambahkan ke keranjang!`);
}

// Fungsi Mengupdate Tampilan Keranjang
function updateCartDisplay() {
    let total = 0;
    cartItemsList.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.name} (${formatRupiah(item.price)})</span>
            <span>${item.quantity} x = ${formatRupiah(itemTotal)}</span>
        `;
        cartItemsList.appendChild(listItem);
    });

    cartTotalSpan.textContent = formatRupiah(total);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Tampilkan tombol checkout hanya jika keranjang tidak kosong
    checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
}

// === Event Listeners ===

// Event listener untuk tombol "Tambah ke Keranjang"
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', addToCart);
});

// Event listener untuk ikon keranjang (membuka modal)
cartIcon.onclick = function() {
    cartModal.style.display = "block";
}

// Event listener untuk tombol close modal
closeBtn.onclick = function() {
    cartModal.style.display = "none";
}

// Event listener untuk menutup modal jika klik di luar area modal
window.onclick = function(event) {
    if (event.target == cartModal) {
        cartModal.style.display = "none";
    }
}

// Fungsi Checkout via WhatsApp
checkoutBtn.onclick = function() {
    if (cart.length === 0) {
        alert("Keranjang belanja Anda masih kosong!");
        return;
    }

    let message = "Halo, saya ingin memesan produk berikut:\n\n";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        // Membuat baris produk
        message += `${index + 1}. ${item.name} x ${item.quantity} = ${formatRupiah(itemTotal)}\n`;
    });

    message += `\nTotal Belanja: ${formatRupiah(total)}`;
    message += "\n\nMohon konfirmasi ketersediaan produk dan total biaya (termasuk ongkir). Terima kasih!";

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    window.open(waLink, '_blank');
    cartModal.style.display = "none";
    
    // Opsional: kosongkan keranjang setelah checkout
    // cart = [];
    // updateCartDisplay(); 
}

// Inisialisasi tampilan saat halaman dimuat
updateCartDisplay();
