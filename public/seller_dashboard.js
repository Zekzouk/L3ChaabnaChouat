
const modal = document.getElementById('productModal');
const productForm = document.getElementById('addProductForm');
const productsTable = document.getElementById('myProductsTable');
const ordersTable = document.getElementById('ordersTableBody');

let user = Auth.getUser();

document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.checkRole('seller')) return;

    const { ok, data } = await apiFetch('/api/auth/profile');
    if (ok) {
        user = data.user;
        user.id = user._id;
        Auth.setUser(user);
    }

    if (user.status === 'pending') {
        renderPendingScreen();
        return;
    }

    if (document.getElementById('welcomeMsg')) {
        document.getElementById('welcomeMsg').textContent = `أهلاً بك، ${user.name} 👋`;
    }

    loadMyProducts();
    loadMyOrders();
    loadProfileData();
});

function renderPendingScreen() {
    document.body.innerHTML = `
        <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0B1526; color:white; font-family:'Cairo', sans-serif; text-align:center; padding:20px;">
            <div style="font-size:5rem;">⏳</div>
            <h2 style="color:#F26522; margin-top:20px;">حسابك قيد المراجعة</h2>
            <p style="margin-top:10px; color:#94A3B8;">شكراً لتسجيلك في سيارتي! متجرك الآن قيد المراجعة من قبل الإدارة.<br>سنقوم بتفعيل حسابك قريباً جداً لتتمكن من عرض منتجاتك.</p>
            <button onclick="Auth.logout()" style="margin-top:30px; padding:10px 20px; background:#152238; color:white; border:1px solid #2e3e56; border-radius:8px; cursor:pointer;">تسجيل الخروج</button>
        </div>
    `;
}

function loadProfileData() {
    if (user) {
        const nameField = document.getElementById('set-name');
        const phoneField = document.getElementById('set-phone');
        const shopNameField = document.getElementById('set-shopName');
        if (nameField) nameField.value = user.name || '';
        if (phoneField) phoneField.value = user.phone || '';
        if (shopNameField) shopNameField.value = user.shopName || '';
    }
}

// Profile form submit handler
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('set-name').value.trim();
        const shopName = document.getElementById('set-shopName').value.trim();
        const phone = document.getElementById('set-phone').value.trim();

        if (!name) {
            showToast('الرجاء إدخال الاسم الكامل', 'danger');
            return;
        }

        showToast('جارٍ حفظ التغييرات...');
        const { ok, data } = await apiFetch('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, shopName, phone })
        });

        if (ok) {
            // Update local user data
            user.name = data.user.name;
            user.shopName = data.user.shopName;
            user.phone = data.user.phone;
            Auth.setUser(user);

            // Update welcome message
            if (document.getElementById('welcomeMsg')) {
                document.getElementById('welcomeMsg').textContent = `أهلاً بك، ${user.name} 👋`;
            }

            showToast('تم حفظ التغييرات بنجاح ✅');
        } else {
            showToast('فشل في حفظ التغييرات: ' + (data?.message || 'خطأ غير متوقع'), 'danger');
        }
    });
}

let allMyProducts = [];

async function loadMyProducts() {
    const { ok, data } = await apiFetch('/api/products?limit=200');
    if (!ok || !productsTable) return;

    const products = data.products || data; 
    allMyProducts = products.filter(p => p.seller._id === user.id || p.seller === user.id);
    renderProducts(allMyProducts);

    const searchInput = document.getElementById('productSearchInput');
    if (searchInput && !searchInput.dataset.listening) {
        searchInput.addEventListener('input', filterMyProducts);
        searchInput.dataset.listening = "true";
    }
}

function renderProducts(data) {
    if (data.length === 0) {
        productsTable.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">لا توجد منتجات مطابقة</td></tr>`;
        return;
    }

    productsTable.innerHTML = data.map(p => `
        <tr>
            <td>
                <div style="font-weight:600;">${p.title}</div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">👀 ${p.views || 0} مشاهدة | 📦 المخزون: ${p.stock || 0}${p.brand ? ` | 🏷️ ${p.brand}` : ''}${p.carModel ? ` | 🚗 ${p.carModel}` : ''}</div>
            </td>
            <td>${getEmojiForCategory(p.category)} ${p.category}</td>
            <td style="font-weight:bold; color:#F26522;">${p.price.toLocaleString()} DZD</td>
            <td><span class="status-badge ${p.status === 'active' ? 'status-active' : 'status-pending'}">${translateStatus(p.status)}</span></td>
            <td class="action-btns">
                <button title="تعديل" onclick="openEditModal('${p._id}')" style="background:none; border:none; cursor:pointer;">✏️</button>
                <button title="حذف" onclick="handleDeleteProduct('${p._id}')" style="background:none; border:none; cursor:pointer;">🗑️</button>
            </td>
        </tr>
    `).join('');
    

    const countBadge = document.getElementById('activeProductsCount');
    if (countBadge) countBadge.textContent = allMyProducts.length;
}

function filterMyProducts() {
    const searchTerm = document.getElementById('productSearchInput')?.value.toLowerCase() || '';
    
    const filtered = allMyProducts.filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(searchTerm) || false;
        const brandMatch = p.brand?.toLowerCase().includes(searchTerm) || false;
        const carModelMatch = p.carModel?.toLowerCase().includes(searchTerm) || false;
        const referenceMatch = p.reference?.toLowerCase().includes(searchTerm) || false;

        return searchTerm === '' || titleMatch || brandMatch || carModelMatch || referenceMatch;
    });

    renderProducts(filtered);
}

if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', document.getElementById('p-title').value);
        formData.append('category', document.getElementById('p-category').value);
        formData.append('condition', document.getElementById('p-condition').value);
        formData.append('authenticity', document.getElementById('p-authenticity').value);
        formData.append('reference', document.getElementById('p-reference').value);
        formData.append('brand', document.getElementById('p-brand').value);
        formData.append('carModel', document.getElementById('p-carModel').value);
        formData.append('description', document.getElementById('p-description').value);
        formData.append('price', Number(document.getElementById('p-price').value));
        formData.append('stock', Number(document.getElementById('p-stock').value));
        
        const imageFile = document.getElementById('p-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const pId = document.getElementById('p-id').value;
        const method = pId ? 'PUT' : 'POST';
        const url = pId ? `/api/products/${pId}` : '/api/products';

        showToast(pId ? 'جارٍ تحديث المنتج...' : 'جارٍ إضافة المنتج...');
        const { ok, data } = await apiFetch(url, {
            method: method,
            body: formData 
        });

        if (ok) {
            showToast(pId ? 'تم تحديث المنتج بنجاح!' : 'تمت إضافة المنتج بنجاح!');
            closeModal();
            productForm.reset();
            document.getElementById('p-id').value = '';
            loadMyProducts();
        } else {
            showToast('خطأ: ' + (data?.message || 'فشل العملية'), 'danger');
        }
    });
}

async function handleDeleteProduct(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    const { ok } = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    if (ok) {
        showToast('تم حذف المنتج');
        loadMyProducts();
    } else {
        showToast('فشل الحذف', 'danger');
    }
}

async function openEditModal(id) {
    const { ok, data } = await apiFetch(`/api/products/${id}`);
    if (ok) {
        document.getElementById('p-id').value = data._id;
        document.getElementById('p-title').value = data.title;
        document.getElementById('p-category').value = data.category;
        document.getElementById('p-condition').value = data.condition;
        document.getElementById('p-authenticity').value = data.authenticity || '';
        document.getElementById('p-reference').value = data.reference || '';
        document.getElementById('p-brand').value = data.brand || '';
        document.getElementById('p-carModel').value = data.carModel || '';
        document.getElementById('p-description').value = data.description;
        document.getElementById('p-price').value = data.price;
        

        document.getElementById('p-image').required = false;

        if (document.getElementById('modalTitle')) {
            document.getElementById('modalTitle').textContent = '✏️ تعديل المنتج';
        }
        
        if (modal) modal.classList.add('active');
    } else {
        showToast('فشل في جلب بيانات المنتج', 'danger');
    }
}

let allMyOrders = [];

async function loadMyOrders() {
    const { ok, data } = await apiFetch('/api/orders/seller');
    if (!ok || !ordersTable) return;

    allMyOrders = data;
    renderOrders(allMyOrders);

    const searchInput = document.getElementById('orderSearchInput');
    const dateFilter = document.getElementById('orderDateFilter');
    
    if (searchInput && !searchInput.dataset.listening) {
        searchInput.addEventListener('input', filterOrders);
        searchInput.dataset.listening = "true";
    }
    if (dateFilter && !dateFilter.dataset.listening) {
        dateFilter.addEventListener('change', filterOrders);
        dateFilter.dataset.listening = "true";
    }
}

function renderOrders(data) {
    if (data.length === 0) {
        ordersTable.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #94A3B8;">لا توجد طلبات مطابقة</td></tr>`;
        return;
    }

    ordersTable.innerHTML = data.map(o => {

        const itemsHtml = o.items.map(i => {
            const imgSrc = i.product?.image || '/uploads/placeholder.webp';
            return `
                <div style="display:flex; gap:15px; margin-bottom:10px; padding:10px; background:var(--bg-card); border-radius:8px;">
                    <img src="${imgSrc}" style="width:60px; height:60px; object-fit:cover; border-radius:6px; border:1px solid var(--border-color);">
                    <div>
                        <div style="font-weight:600;">${i.title}</div>
                        <div style="font-size:0.85rem; color:var(--text-secondary);">الكمية: ${i.quantity} | اللون/المقاس: غير محدد</div>
                        <div style="font-weight:bold; color:var(--primary);">${(i.price * i.quantity).toLocaleString()} DZD</div>
                    </div>
                </div>
            `;
        }).join('');

        const orderDate = new Date(o.createdAt).toLocaleString('ar-DZ', { dateStyle: 'medium', timeStyle: 'short' });
        const updateDate = new Date(o.updatedAt).toLocaleString('ar-DZ', { dateStyle: 'medium', timeStyle: 'short' });

        return `
            <tr style="cursor:pointer; transition:background 0.2s;" onclick="toggleOrderDetails('${o._id}')" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                <td style="font-family: inherit; font-size:0.8rem;">
                    <span style="display:inline-block; margin-left:5px; transition:transform 0.3s;" id="icon_${o._id}">▶</span>
                    #${o._id.slice(-6).toUpperCase()}
                </td>
                <td>${o.items.length} منتج(ات)</td>
                <td>
                    <div style="font-weight:bold;">👤 ${o.shippingDetails.name || 'غير متوفر'}</div>
                    <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">📍 ${o.shippingDetails.wilaya || ''}</div>
                </td>
                <td style="font-weight:bold; color:#F26522;">${o.totalPrice.toLocaleString()} DZD</td>
                <td><span class="status-badge status-${o.status}">${translateStatus(o.status)}</span></td>
                <td class="action-btns" onclick="event.stopPropagation()">
                    <select onchange="updateOrderStatus('${o._id}', this.value)" style="background:#0B1526; color:white; border:1px solid #2e3e56; border-radius:4px; padding:2px;">
                        <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                        <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>تم الشحن</option>
                        <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>تم التسليم</option>
                        <option value="canceled" ${o.status === 'canceled' ? 'selected' : ''}>إلغاء</option>
                    </select>
                    <button title="حذف الطلب نهائياً" onclick="handleDeleteOrder('${o._id}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem; margin-right: 8px;">🗑️</button>
                </td>
            </tr>
            <tr id="details_${o._id}" style="display:none; background:rgba(0,0,0,0.2);">
                <td colspan="6" style="padding:0;">
                    <div style="padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:20px; border-bottom:1px solid var(--border-color);">
                        
                        <!-- Order Items Info -->
                        <div>
                            <h4 style="margin-bottom:15px; color:var(--text-main); border-bottom:1px solid var(--border-color); padding-bottom:5px;">📦 تفاصيل المنتجات</h4>
                            ${itemsHtml}
                        </div>

                        <!-- Delivery & Payment Info -->
                        <div>
                            <h4 style="margin-bottom:15px; color:var(--text-main); border-bottom:1px solid var(--border-color); padding-bottom:5px;">🚚 معلومات التوصيل والدفع</h4>
                            
                            <div style="display:grid; grid-template-columns:120px 1fr; gap:10px; margin-bottom:15px; font-size:0.9rem;">
                                <div style="color:var(--text-secondary);">طريقة الدفع:</div>
                                <div style="font-weight:600;">💵 الدفع عند الاستلام (COD)</div>

                                <div style="color:var(--text-secondary);">طريقة التوصيل:</div>
                                <div style="font-weight:600;">${o.shippingDetails.deliveryType === 'desk' ? '🏢 توصيل للمكتب (Yalidine)' : '🏠 توصيل للمنزل'}</div>

                                <div style="color:var(--text-secondary);">العنوان الكامل:</div>
                                <div>${o.shippingDetails.address || ''}، ${o.shippingDetails.commune || ''}، ${o.shippingDetails.wilaya || ''}</div>

                                <div style="color:var(--text-secondary);">رقم الهاتف:</div>
                                <div style="direction:ltr; text-align:right;">${o.shippingDetails.phone || ''}</div>
                                
                                <div style="color:var(--text-secondary);">ملاحظات الزبون:</div>
                                <div style="color:var(--text-secondary); font-style:italic;">لا توجد ملاحظات إضافية</div>
                            </div>

                            <h4 style="margin-bottom:15px; margin-top:25px; color:var(--text-main); border-bottom:1px solid var(--border-color); padding-bottom:5px;">⏱️ السجل الزمني (Timeline)</h4>
                            <div style="font-size:0.85rem;">
                                <div style="margin-bottom:8px;">🔵 <b>تم الطلب:</b> ${orderDate}</div>
                                <div>🟢 <b>آخر تحديث للحالة:</b> ${updateDate}</div>
                            </div>

                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const pendingBadge = document.getElementById('pendingOrdersCount');
    if (pendingBadge) pendingBadge.textContent = allMyOrders.filter(o => o.status === 'pending').length;
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearchInput')?.value.toLowerCase() || '';
    const dateValue = document.getElementById('orderDateFilter')?.value || 'all';

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    

    const dayOfWeek = now.getDay();
    const weekStart = new Date(todayStart - (dayOfWeek * 24 * 60 * 60 * 1000)).getTime();

    const filtered = allMyOrders.filter(o => {

        const orderIdMatch = o._id.toLowerCase().includes(searchTerm);
        const buyerMatch = o.shippingDetails?.name?.toLowerCase().includes(searchTerm) || false;
        const phoneMatch = o.shippingDetails?.phone?.includes(searchTerm) || false;

        const matchesSearch = searchTerm === '' || orderIdMatch || buyerMatch || phoneMatch;

        const orderTime = new Date(o.createdAt).getTime();
        let matchesDate = true;
        if (dateValue === 'today') {
            matchesDate = orderTime >= todayStart;
        } else if (dateValue === 'week') {
            matchesDate = orderTime >= weekStart;
        }

        return matchesSearch && matchesDate;
    });

    renderOrders(filtered);
}

async function updateOrderStatus(id, status) {
    const { ok } = await apiFetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });

    if (ok) {
        showToast('تم تحديث حالة الطلب');
        loadMyOrders();
    } else {
        showToast('فشل التحديث', 'danger');
    }
}

async function handleDeleteOrder(id) {
    if (!confirm('هل تريد إخفاء هذا الطلب من لوحة التحكم؟ (سيبقى مسجلاً في النظام لكنه لن يظهر في القائمة)')) return;

    showToast('جارٍ الإخفاء...');
    const { ok, data } = await apiFetch(`/api/orders/${id}`, {
        method: 'DELETE'
    });

    if (ok) {
        showToast('تم إخفاء الطلب بنجاح', 'success');
        loadMyOrders();
    } else {
        showToast('فشل العملية: ' + (data?.message || 'خطأ غير متوقع'), 'danger');
    }
}

function openModal() { 
    if (document.getElementById('modalTitle')) {
        document.getElementById('modalTitle').textContent = '📦 إضافة منتج جديد';
    }
    if (productForm) {
        productForm.reset();
        document.getElementById('p-id').value = '';
        document.getElementById('p-brand').value = '';
        document.getElementById('p-carModel').value = '';
        document.getElementById('p-image').required = true;
    }
    if (modal) modal.classList.add('active'); 
}
function closeModal() { if (modal) modal.classList.remove('active'); }

window.toggleOrderDetails = function(orderId) {
    const detailsRow = document.getElementById('details_' + orderId);
    const icon = document.getElementById('icon_' + orderId);
    if (!detailsRow || !icon) return;

    if (detailsRow.style.display === 'none') {
        detailsRow.style.display = 'table-row';
        icon.style.transform = 'rotate(90deg)';
    } else {
        detailsRow.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
};

