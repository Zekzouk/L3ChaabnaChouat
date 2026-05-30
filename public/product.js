

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const productContainer = document.getElementById('productContainer');

document.addEventListener('DOMContentLoaded', () => {
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }
    fetchProductDetails();
});

async function fetchProductDetails() {
    const { ok, data } = await apiFetch(`/api/products/${productId}`);
    
    if (ok) {
        renderProduct(data);
    } else {
        if (productContainer) {
            productContainer.innerHTML = `<div style="padding:100px; text-align:center;"><h3>المنتج غير موجود</h3><a href="index.html">العودة للمتجر</a></div>`;
        }
    }
}

let currentProduct = null;

function renderProduct(p) {
    if (!productContainer) return;
    currentProduct = p;

    productContainer.innerHTML = `
        <div class="product-layout">
            <!-- Left: Image & Gallery -->
            <div class="product-visuals">
                <div class="main-image-container" style="height: 400px; display:flex; align-items:center; justify-content:center; background:var(--bg-card); border-radius:12px; overflow:hidden; border:1px solid var(--border-color);">
                    <img id="mainDisplayImage" src="${p.image || (p.images && p.images[0]) || 'placeholder.jpg'}" style="width:100%; height:100%; object-fit:contain;">
                </div>
                
                ${p.images && p.images.length > 1 ? `
                    <div class="image-gallery" style="display:flex; gap:10px; margin-top:15px; overflow-x:auto; padding-bottom:5px;">
                        ${p.images.map(img => `
                            <img src="${img}" class="gallery-thumb" style="width:70px; height:70px; border-radius:8px; cursor:pointer; border:2px solid transparent; object-fit:cover;"
                                 onclick="document.getElementById('mainDisplayImage').src='${img}'">
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <!-- Right: Details -->
            <div class="product-info">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span class="product-brand">${p.condition === 'new' ? 'جديد' : 'مستعمل'}${p.authenticity ? (p.authenticity === 'original' ? ' - أصلي' : ' - مقلد') : ''}</span>
                    <span style="font-size:0.85rem; color:var(--text-secondary);">👀 ${p.views || 0} مشاهدة</span>
                </div>
                <h1>${p.title}</h1>
                <div style="color: #fbbf24; margin-bottom:15px;">★★★★★ <span style="color: var(--text-secondary);">(0 تقييم)</span></div>

                <div class="product-price">${p.price.toLocaleString()} DZD</div>
                
                <div class="stock-status" style="margin: 15px 0; font-weight: 600; color: ${p.stock > 0 ? '#10B981' : '#EF4444'};">
                    ${p.stock > 0 ? `📦 متوفر في المخزون (${p.stock} قطعة)` : '❌ نفد من المخزون'}
                </div>

                <div class="seller-info" style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; margin:20px 0;">
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">يباع بواسطة:</div>
                        <div style="font-weight: bold;">${p.seller.shopName || p.seller.name}</div>
                    </div>
                    <button class="btn btn-outline" style="width: auto; padding: 8px 15px; font-size: 0.9rem; margin-top:10px;"
                        onclick="alert('خدمة الدردشة ستتوفر قريباً!')">💬 تواصل مع البائع</button>
                </div>

                <div style="margin-bottom: 30px;">
                    <strong style="display:block; margin-bottom: 10px;">الفئة: <span style="color: var(--primary);">${p.category}</span></strong>
                    ${p.reference ? `<strong style="display:block; margin-bottom: 10px;">رقم المرجع (Part Number): <span style="color: var(--text-secondary); font-family: monospace; font-size: 1.1rem;">${p.reference}</span></strong>` : ''}
                </div>

                <div style="display:flex; gap:10px;">
                    <button class="btn btn-primary" ${p.stock <= 0 ? 'disabled' : ''} onclick="handleBuyNow(currentProduct)">شراء الآن</button>
                    <button class="btn btn-outline" ${p.stock <= 0 ? 'disabled' : ''} onclick="handleAddToCart(currentProduct)">أضف للسلة 🛒</button>
                </div>
            </div>
        </div>

        <div class="tabs" style="margin-top:40px; border-bottom:1px solid var(--border-color);">
            <div class="tab active" style="padding:15px; border-bottom:2px solid var(--primary); display:inline-block;">الوصف والمواصفات</div>
        </div>

        <div class="description-content" style="padding:20px 0;">
            <p>${p.description || 'لا يوجد وصف متوفر لهذا المنتج حالياً.'}</p>
        </div>
    `;
}

function handleAddToCart(p) {
    Cart.add({ 
        id: p._id, 
        title: p.title, 
        price: p.price, 
        seller: p.seller?._id || p.seller 
    });
    showToast(`تم إضافة ${p.title} إلى السلة`);
}

function handleBuyNow(p) {
    Cart.add({ 
        id: p._id, 
        title: p.title, 
        price: p.price, 
        seller: p.seller?._id || p.seller 
    });
    window.location.href = 'checkout.html';
}

