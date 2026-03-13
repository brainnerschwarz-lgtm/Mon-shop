// ============================================
// SHOP KINSHASA - TOUS LES FONCTIONNEMENTS
// ============================================

// Données initiales (tes produits congolais)
let products = [
    { id: 1, name: 'iPhone 15 Pro', price: 950000, image: 'https://via.placeholder.com/400x300/333/fff?text=iPhone15', desc: '128Go état neuf' },
    { id: 2, name: 'Perruque Brésilienne', price: 45000, image: 'https://via.placeholder.com/400x300/f39c12/fff?text=PERruQUE', desc: 'Longueur 24"' },
    { id: 3, name: 'Sac Gucci Original', price: 125000, image: 'https://via.placeholder.com/400x300/ff6b6b/fff?text=GUCCI', desc: 'Cuir véritable' },
    { id: 4, name: 'Batterie iPhone', price: 18000, image: 'https://via.placeholder.com/400x300/4ecdc4/fff?text=BATTERIE', desc: 'Pour tous modèles' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let user = JSON.parse(localStorage.getItem('user')) || null;

// ============================================
// INITIALISATION - EXÉCUTE TOUT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Shop chargé !');
    
    // Charger produits depuis localStorage (admin)
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
        console.log('Produits admin chargés:', products.length);
    }
    
    // TOUS LES ÉVÉNEMENTS
    initAllEvents();
    
    // Afficher
    displayProducts();
    updateAuthUI();
    if (cart.length) displayCart();
});

function initAllEvents() {
    // 🔑 CONNEXION/INSCRIPTION
    document.getElementById('loginBtn').onclick = () => showModal('loginModal');
    document.getElementById('registerBtn').onclick = () => showModal('registerModal');
    document.getElementById('registerForm').onsubmit = registerUser;
    document.getElementById('loginForm').onsubmit = loginUser;
    document.getElementById('logoutBtn').onclick = logoutUser;
    
    // 🛒 PANIER
    document.getElementById('checkoutBtn')?.onclick = () => showModal('checkoutModal');
    document.getElementById('checkoutForm').onsubmit = processOrder;
    document.getElementById('adminBtn').onclick = () => window.open('admin.html', '_blank');
    
    // ❌ FERMER MODALS
    document.querySelectorAll('.close').forEach(btn => {
        btn.onclick = hideAllModals;
    });
    
    // Clic dehors
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) hideAllModals();
    };
}

// ============================================
// MODALS
// ============================================
function showModal(modalId) {
    hideAllModals();
    document.getElementById(modalId).classList.add('active');
}

function hideAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

// ============================================
// PRODUITS
// ============================================
function displayProducts() {
    const list = document.getElementById('productsList');
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p><strong>${p.price.toLocaleString()} FC</strong></p>
            <p>${p.desc}</p>
            <button class="add-cart-btn" data-id="${p.id}">
                <i class="fas fa-cart-plus"></i> Ajouter
            </button>
        </div>
    `).join('');
    
    // Réattacher événements boutons produits
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.onclick = function() {
            addToCart(parseInt(this.dataset.id));
        };
    });
}

// ============================================
// PANIER
// ============================================
function addToCart(id) {
    if (!user) {
        alert('👤 Connectez-vous pour acheter !');
        showModal('loginModal');
        return;
    }
    
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ ${product.name} ajouté ! (${cart.length} articles)`);
    displayCart();
}

function displayCart() {
    const section = document.getElementById('cartSection');
    const items = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    
    let total = 0;
    items.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.price.toLocaleString()} FC x ${item.qty}</small>
                </div>
                <div>
                    <button onclick="changeQty(${index}, -1)" style="background: #ffc107;">-</button>
                    <span style="margin: 0 10px;">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)" style="background: #28a745;">+</button>
                    <button onclick="removeFromCart(${index})" style="background: #dc3545; margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    totalEl.innerHTML = `<h3>Total: <strong>${total.toLocaleString()} FC</strong></h3>`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// ============================================
// AUTHENTIFICATION
// ============================================
function registerUser(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    
    user = { name, email };
    localStorage.setItem('user', JSON.stringify(user));
    updateAuthUI();
    hideAllModals();
    alert(`🎉 Bienvenue ${name} !`);
}

function loginUser(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (savedUser && savedUser.email === email) {
        user = savedUser;
        updateAuthUI();
        hideAllModals();
        alert(`👋 Bonjour ${user.name} !`);
    } else {
        alert('❌ Email ou mot de passe incorrect');
    }
}

function logoutUser() {
    user = null;
    cart = [];
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    updateAuthUI();
    document.getElementById('cartSection')?.classList.add('hidden');
    alert('👋 Déconnecté !');
}

function updateAuthUI() {
    const welcome = document.getElementById('userWelcome');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    if (user) {
        welcome.innerHTML = `👋 Bonjour <strong>${user.name}</strong> ! `;
        welcome.style.display = 'inline';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline';
        adminBtn.style.display = localStorage.getItem('isAdmin') === 'true' ? 'inline-block' : 'none';
    } else {
        welcome.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        adminBtn.style.display = 'none';
    }
}

// ============================================
// COMMANDE
// ============================================
function processOrder(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const order = {
        client: formData.get('client') || 'Non rempli',
        phone: formData.get('phone') || 'Non rempli',
        address: formData.get('address') || 'Non rempli',
        items: cart.map(item => `${item.name} x${item.qty}`),
        total: total.toLocaleString() + ' FC',
        date: new Date().toLocaleString('fr-CD')
    };
    
    alert(`✅ COMMANDE REÇUE !

📱 ${order.client}
📍 ${order.address}
📞 WhatsApp: ${order.phone}
💰 TOTAL: ${order.total}
⏰ ${order.date}

On vous rappelle !`);
    
    // Vider panier
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    hideAllModals();
    document.getElementById('cartSection').classList.add('hidden');
}

// Console pour debug
console.log('✅ JavaScript chargé - Ouvrez F12 pour voir les logs');
