// Produits globaux (chargés depuis localStorage)
let products = [
    { id: 1, name: 'T-shirt Premium', price: 25, image: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=T-SHIRT', desc: '100% coton' },
    { id: 2, name: 'Jeans Slim', price: 60, image: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=JEANS', desc: 'Denim résistant' },
    { id: 3, name: 'Sneakers', price: 90, image: 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=SNEAKERS', desc: 'Confort max' }
];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let user = JSON.parse(localStorage.getItem('user')) || null;
let isAdmin = localStorage.getItem('isAdmin') === 'true';

// CHARGEMENT AU DÉMARRAGE
function loadData() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    displayProducts();
    if (cart.length) displayCart();
    updateAuthUI();
}

// Affichage produits (avec grid)
function displayProducts() {
    const list = document.getElementById('productsList');
    if (!list) return;
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.price.toFixed(2)} €</p>
            <p>${p.desc || ''}</p>
            <button onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Ajouter</button>
        </div>
    `).join('');
}

// Autres fonctions identiques (addToCart, displayCart, removeFromCart, auth forms)...

// Admin functions
function displayAdminProducts() {
    const list = document.getElementById('adminProducts');
    if (!list) return;
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name} - ${p.price} €</h3>
            <p>${p.desc || ''}</p>
            <button onclick="editProduct(${p.id})"><i class="fas fa-edit"></i> Éditer</button>
            <button onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
    `).join('');
}

// Ajout produit
function addProduct() {
    const name = document.getElementById('prodName').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const image = document.getElementById('prodImage').value;
    const desc = document.getElementById('prodDesc').value;
    const id = Date.now(); // Unique ID
    products.unshift({ id, name, price, image, desc }); // Ajout en haut
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
    document.getElementById('addProductForm').reset();
    alert('Produit ajouté et visible sur le shop !');
}

// Update UI auth + admin
function updateAuthUI() {
    const welcome = document.getElementById('userWelcome');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    if (user) {
        welcome.textContent = `Bonjour, ${user.name}! `;
        welcome.style.display = 'inline';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline';
        if (isAdmin) adminBtn.style.display = 'block';
    } else {
        welcome.style.display = 'none';
        loginBtn.style.display = 'inline';
        registerBtn.style.display = 'inline';
        logoutBtn.style.display = 'none';
        adminBtn.style.display = 'none';
    }
}

// Événements (simplifiés)
document.addEventListener('DOMContentLoaded', loadData);

// Bouton admin
document.getElementById('adminBtn').onclick = () => {
    localStorage.setItem('isAdmin', 'true');
    window.open('admin.html', '_blank');
};
