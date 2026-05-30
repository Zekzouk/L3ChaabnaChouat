

let cart = Cart.load();
let allProducts = [];
let currentPage = 1;
let lastParams = {};

let cartBadge, cartOverlay, cartDrawer, cartItemsList, cartDrawerTotal, productGrid, searchInput, priceRange, priceValue, paginationContainer;

document.addEventListener('DOMContentLoaded', () => {

    cartBadge = document.getElementById('cart-count');
    cartOverlay = document.getElementById('cartOverlay');
    cartDrawer = document.getElementById('cartDrawer');
    cartItemsList = document.getElementById('cartItemsList');
    cartDrawerTotal = document.getElementById('cart-drawer-total');
    productGrid = document.getElementById('mainProductGrid');
    searchInput = document.getElementById('searchInput');
    priceRange = document.getElementById('priceRange');
    priceValue = document.getElementById('priceValue');
    paginationContainer = document.getElementById('paginationContainer');

    updateCartUI();
    fetchProducts();
    checkNavbarAuth();
    initFadeInObserver();
    setupFilters();
});

function checkNavbarAuth() {
    const user = Auth.getUser();
    const loginLink = document.getElementById('userAccountLink');
    const guestLinks = document.querySelectorAll('.guest-only');

    if (user && loginLink) {

        guestLinks.forEach(link => link.style.display = 'none');

        loginLink.textContent = `حسابي (${user.name})`;
        loginLink.href = user.role === 'seller' ? 'seller_dashboard.html' : 
                         user.role === 'admin' ? 'admin_dashboard.html' : 'buyer_dashboard.html';

        if (user.role === 'seller' && user.status === 'active') {
            const sellBtn = document.createElement('a');
            sellBtn.href = 'seller_dashboard.html';
            sellBtn.innerHTML = '📦 أضف منتج';
            sellBtn.style.cssText = "background:var(--primary); color:white; padding:8px 15px; border-radius:8px; margin-left:15px; font-size:0.9rem; font-weight:bold;";
            loginLink.parentElement.insertBefore(sellBtn, loginLink);
        }
    }
}

async function fetchProducts(params = {}, page = 1) {
    if (productGrid) {
        productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><p style="color: var(--text-secondary);">جارٍ البحث عن قطع الغيار...</p></div>`;
    }
    if (paginationContainer) paginationContainer.innerHTML = '';

    lastParams = params;
    currentPage = page;

    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
        } else if (value !== undefined && value !== null) {
            queryParams.append(key, value);
        }
    }
    queryParams.set('page', page);
    queryParams.set('limit', 12);

    const url = `/api/products?${queryParams.toString()}`;
    const { ok, data } = await apiFetch(url);

    if (ok) {
        allProducts = data.products;
        renderProducts(allProducts);
        renderPagination(data.page, data.totalPages, data.total);
    } else {
        if (productGrid) {
            productGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--danger);">خطأ في تحميل البيانات: ${data?.message || 'Unknown error'}</p>`;
        }
    }
}

function renderPagination(page, totalPages, total) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    const makeBtn = (label, targetPage, isActive = false, disabled = false, extraClass = '') => {
        const btn = document.createElement('button');
        btn.className = `page-btn ${extraClass} ${isActive ? 'active' : ''}`.trim();
        btn.textContent = label;
        btn.disabled = disabled;
        if (!disabled && !isActive) {
            btn.onclick = () => {
                fetchProducts(lastParams, targetPage);
                document.getElementById('store').scrollIntoView({ behavior: 'smooth' });
            };
        }
        return btn;
    };

    paginationContainer.appendChild(makeBtn('‹', page - 1, false, page === 1, 'prev-next'));

    const range = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
            range.push(i);
        }
    }
    let prev = null;
    for (const p of range) {
        if (prev && p - prev > 1) {
            const dots = document.createElement('span');
            dots.textContent = '…';
            dots.style.cssText = 'color: var(--text-secondary); padding: 0 4px;';
            paginationContainer.appendChild(dots);
        }
        paginationContainer.appendChild(makeBtn(p, p, p === page));
        prev = p;
    }

    paginationContainer.appendChild(makeBtn('›', page + 1, false, page === totalPages, 'prev-next'));

    const info = document.createElement('p');
    info.className = 'pagination-info';
    info.style.width = '100%';
    info.textContent = `Showing page ${page} of ${totalPages} (${total} products total)`;
    paginationContainer.appendChild(info);
}

function renderProducts(products) {
    if (!productGrid) return;
    
    if (products.length === 0) {
        productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><p style="color: var(--text-secondary);">لا توجد نتائج مطابقة لبحثك.</p></div>`;
        return;
    }

    productGrid.innerHTML = products.map(p => `
        <div class="product-card">
            <button class="wishlist-btn">🤍</button>
            <div class="product-media" style="cursor:pointer;" onclick="window.location.href='product.html?id=${p._id}'">
                ${p.images && p.images[0] && !p.images[0].includes('placeholder') ? 
                    `<img src="${p.images[0]}" style="width:100%; height:180px; object-fit:cover; border-bottom:1px solid var(--border-color);" alt="${p.title}">` : 
                    `<div class="product-emoji-placeholder" style="width:100%; height:180px; background:#1a2942; display:flex; align-items:center; justify-content:center; font-size:4rem; border-bottom:1px solid var(--border-color);">${getEmojiForCategory(p.category)}</div>`
                }
            </div>

            <div class="product-info">
                <span class="product-brand">${p.condition === 'new' ? 'جديد' : 'مستعمل'}${p.authenticity ? (p.authenticity === 'original' ? ' - أصلي' : ' - مقلد') : ''}</span>
                <h3 class="product-title" onclick="window.location.href='product.html?id=${p._id}'">${p.title}</h3>
                <div class="product-rating">★★★★★ <span>(0 تقييم)</span></div>
                <div class="product-bottom">
                    <span class="product-price">${p.price.toLocaleString()} DZD</span>
                    <button class="btn-add-cart" onclick="handleAddToCart('${p._id}')">أضف للسلة</button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const searchBtn = document.getElementById('searchBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const sortSelect = document.getElementById('sortSelect');

    if (searchBtn) searchBtn.onclick = applyFilters;
    if (applyFiltersBtn) applyFiltersBtn.onclick = applyFilters;
    if (sortSelect) sortSelect.onchange = applyFilters;
    
    if (resetFiltersBtn) {
        resetFiltersBtn.onclick = () => {
            if (searchInput) searchInput.value = '';
            if (priceRange) {
                priceRange.value = 1000000;
                if (priceValue) priceValue.textContent = `1,000,000 DZD`;
            }
            if (sortSelect) sortSelect.value = 'newest';
            document.querySelectorAll('input[type="checkbox"]').forEach(i => {
                i.checked = i.value === 'all';
            });
            applyFilters();
        };
    }

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            if (priceValue) priceValue.textContent = `${Number(e.target.value).toLocaleString()} DZD`;
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyFilters();
        });
    }

    document.querySelectorAll('input[name="category"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const isAll = e.target.value === 'all';
            if (isAll && e.target.checked) {
                document.querySelectorAll('input[name="category"]:not([value="all"])').forEach(i => i.checked = false);
            } else if (!isAll && e.target.checked) {
                const allCheckbox = document.querySelector('input[name="category"][value="all"]');
                if (allCheckbox) allCheckbox.checked = false;
            }
        });
    });
}

function applyFilters() {
    currentPage = 1; 
    const params = {};
    
    const searchTerm = searchInput?.value.trim();
    if (searchTerm) params.search = searchTerm;

    const maxPriceValue = priceRange?.value;
    if (maxPriceValue) params.maxPrice = maxPriceValue;

    ['category', 'condition', 'authenticity', 'brand', 'model'].forEach(name => {
        const checked = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
        if (checked.length > 0 && !checked.includes('all')) {
            params[name === 'model' ? 'carModel' : name] = checked;
        }
    });

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && sortSelect.value) {
        params.sort = sortSelect.value;
    }

    fetchProducts(params, 1);
}

function handleAddToCart(id) {
    const p = allProducts.find(item => item._id === id);
    if (!p) return;

    cart = Cart.add({ 
        id: p._id, 
        title: p.title, 
        price: p.price, 
        seller: p.seller?._id || p.seller 
    });
    
    updateCartUI();
    showToast(`تم إضافة ${p.title} إلى السلة`);
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) cartBadge.textContent = count;

    if (cartItemsList) {
        if (cart.length === 0) {
            cartItemsList.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 20px;">السلة فارغة حالياً.</p>`;
            if (cartDrawerTotal) cartDrawerTotal.textContent = '0 DZD';
            return;
        }

        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px;">
                <div>
                    <h5 style="margin:0; font-size:0.9rem;">${item.title}</h5>
                    <small style="color:var(--primary);">${item.price.toLocaleString()} DZD x ${item.qty}</small>
                </div>
                <button onclick="handleRemoveFromCart('${item.id}')" style="background:none; border:none; color:var(--danger); cursor:pointer;">🗑️</button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (cartDrawerTotal) cartDrawerTotal.textContent = `${total.toLocaleString()} DZD`;
    }
}

function handleRemoveFromCart(id) {
    cart = Cart.remove(id);
    updateCartUI();
}

function toggleCartDrawer() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }
}

function initFadeInObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
