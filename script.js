// Admin functions
function displayAdminProducts() {
    const list = document.getElementById('adminProducts');
    if (!list) return;
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name} - ${p.price} €</h3>
            <p>${p.desc || ''}</p>
            <button onclick="editProduct(${p.id})" style="background: #ffc107;"><i class="fas fa-edit"></i> Éditer</button>
            <button onclick="deleteProduct(${p.id})" style="background: #dc3545;"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
    `).join('');
}

// Ajouter produit
document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('prodName').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const image = document.getElementById('prodImage').value;
    const desc = document.getElementById('prodDesc').value;
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, price, image, desc });
    localStorage.setItem('products', JSON.stringify(products)); // Persistance
    displayProducts(); // Refresh shop si ouvert
    displayAdminProducts();
    e.target.reset();
    alert('Produit ajouté!');
});

// Éditer/Supprimer
function editProduct(id) {
    const prod = products.find(p => p.id === id);
    const newName = prompt('Nouveau nom:', prod.name);
    const newPrice = prompt('Nouveau prix:', prod.price);
    const newImage = prompt('Nouvelle image URL:', prod.image);
    if (newName && newPrice && newImage) {
        prod.name = newName;
        prod.price = parseFloat(newPrice);
        prod.image = newImage;
        localStorage.setItem('products', JSON.stringify(products));
        displayAdminProducts();
        displayProducts(); // Refresh
    }
}

function deleteProduct(id) {
    if (confirm('Supprimer ce produit?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        displayAdminProducts();
        displayProducts();
    }
}

// Charger produits depuis localStorage au démarrage
window.addEventListener('load', () => {
    const saved = localStorage.getItem('products');
    if (saved) products.push(...JSON.parse(saved));
    displayProducts();
});

// Bouton admin dans shop (ajoutez dans index.html après logoutBtn)
document.getElementById('auth-section')?.insertAdjacentHTML('beforeend', '<button id="adminBtn" style="display:none; background: #ff6b6b;"><i class="fas fa-user-shield"></i> Admin</button>');
document.getElementById('adminBtn')?.onclick = () => { localStorage.setItem('isAdmin', true); window.location.href = 'admin.html'; };
if (user && localStorage.getItem('isAdmin')) document.getElementById('adminBtn').style.display = 'block';
