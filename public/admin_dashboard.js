
document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.checkRole('admin')) return;

    loadStats();
    loadUsers();
    loadProducts();
    setupNavigation();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.logout)');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (!target) return;

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === target) s.classList.add('active');
            });
        });
    });
}

async function loadStats() {
    const { ok, data } = await apiFetch('/api/admin/stats');
    if (ok) {
        document.getElementById('totalUsersCount').textContent = data.totalUsers;
        document.getElementById('totalSellersCount').textContent = data.totalSellers;
        document.getElementById('totalProductsCount').textContent = data.totalProducts;
    }
}

async function loadUsers() {
    const { ok: okUsers, data: users } = await apiFetch('/api/admin/users');
    if (!okUsers) return;

   
    const allUsersTable = document.getElementById('allUsersTable');
    if (allUsersTable) {
        allUsersTable.innerHTML = users.map(u => `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role === 'admin' ? '🛡️ مدير' : u.role === 'seller' ? '🏪 بائع' : '🛍️ زبون'}</td>
                <td><span class="status-badge status-${u.status}">${translateStatus(u.status)}</span></td>
                <td class="action-btns">
                    ${u.role !== 'admin' ? `
                        <button class="${u.status === 'active' ? 'ban' : 'approve'}" 
                             onclick="handleUpdateStatus('${u._id}', '${u.status}')">
                            ${u.status === 'active' ? 'حظر' : u.status === 'pending' ? 'موافقة' : 'تفعيل'}
                        </button>
                    ` : '<span style="color:var(--text-secondary)">-</span>'}
                </td>
            </tr>
        `).join('');
    }

    
    const { ok: okReqs, data: shopRequests } = await apiFetch('/api/admin/shop-requests');
    const pendingSellers = okReqs ? shopRequests.filter(r => r.status === 'pending') : [];

    
    const dashPendingTable = document.getElementById('dashPendingSellersTable');
    if (dashPendingTable) {
        if (pendingSellers.length === 0) {
            dashPendingTable.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px; color: var(--text-secondary);">لا توجد طلبات معلقة حالياً ✅</td></tr>`;
        } else {
            dashPendingTable.innerHTML = pendingSellers.map(r => `
                <tr style="background: rgba(242,101,34,0.05);">
                    <td><strong>${r.user?.name || 'مستخدم غير معروف'}</strong></td>
                    <td>${r.user?.email || '-'}</td>
                    <td><span class="status-badge status-pending">⏳ قيد المراجعة</span></td>
                    <td class="action-btns">
                        <button class="approve" onclick="handleShopAction('${r.user?._id}', 'active', 'تم تفعيل المتجر')">✅ موافقة</button>
                        <button class="ban" onclick="handleShopAction('${r.user?._id}', 'banned', 'تم رفض الطلب')">❌ رفض</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    
    const pendingTable = document.getElementById('pendingSellersTable');
    if (pendingTable) {
        if (pendingSellers.length === 0) {
            pendingTable.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 30px; color: var(--text-secondary);">لا توجد طلبات معلقة حالياً ✅</td></tr>`;
        } else {
            pendingTable.innerHTML = pendingSellers.map(r => `
                <tr style="background: rgba(242,101,34,0.05);">
                    <td><strong>${r.user?.name || 'مستخدم غير معروف'}</strong></td>
                    <td>${r.storeName || '<span style="color:var(--text-secondary)">غير محدد</span>'}</td>
                    <td><code>${r.commercialRegisterNumber || 'N/A'}</code></td>
                    <td>
                        ${r.documentUrl ? `
                            <a href="${r.documentUrl}" target="_blank" class="approve" style="padding: 4px 8px; font-size: 0.75rem; text-decoration: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                                📄 عرض المستند
                            </a>
                        ` : '<span style="color:var(--text-secondary)">لا يوجد ملف</span>'}
                    </td>
                    <td>${r.user?.email || '-'}</td>
                    <td>${r.user?.phone || '-'}</td>
                    <td>${r.user?.wilaya || '-'}</td>
                    <td class="action-btns">
                        <button class="approve" onclick="handleShopAction('${r.user?._id}', 'active', 'تم تفعيل المتجر')">✅ موافقة</button>
                        <button class="ban" onclick="handleShopAction('${r.user?._id}', 'banned', 'تم رفض الطلب')">❌ رفض</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    const dashPendingCount = document.getElementById('dashPendingCount');
    if (dashPendingCount) dashPendingCount.textContent = pendingSellers.length;

    
    const allSellersTable = document.getElementById('allSellersTable');
    if (allSellersTable) {
        const sellers = users.filter(u => u.role === 'seller');
        allSellersTable.innerHTML = sellers.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.shopName || '-'}</td>
                <td>${s.email}</td>
                <td><span class="status-badge status-${s.status}">${translateStatus(s.status)}</span></td>
                <td class="action-btns">
                    <button class="${s.status === 'active' ? 'ban' : 'approve'}" onclick="handleUpdateStatus('${s._id}', '${s.status}')">
                        ${s.status === 'active' ? 'تعليق' : 'تفعيل'}
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

async function handleShopAction(id, status, successMsg) {
    if (status === 'banned' && !confirm('هل تريد رفض هذا الطلب؟')) return;

    const { ok } = await apiFetch(`/api/admin/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });

    if (ok) {
        showToast(`✅ ${successMsg}`);
        loadUsers();
        loadStats();
    } else {
        showToast('خطأ في العملية', 'danger');
    }
}

async function handleUpdateStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const { ok } = await apiFetch(`/api/admin/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
    });

    if (ok) {
        showToast('تم تحديث الحالة');
        loadUsers();
        loadStats();
    } else {
        showToast('خطأ في العملية', 'danger');
    }
}

async function loadProducts() {
    const { ok, data: products } = await apiFetch('/api/admin/products');
    if (!ok) return;

    const allProductsTable = document.getElementById('allProductsTable');
    if (allProductsTable) {
        if (products.length === 0) {
            allProductsTable.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">لا توجد منتجات معروضة حالياً</td></tr>`;
            return;
        }

        allProductsTable.innerHTML = products.map(p => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image || 'placeholder.jpg'}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
                        <div>
                            <div style="font-weight:600;">${p.title}</div>
                            <div style="font-size:0.75rem; color:var(--text-secondary);">REF: ${p.reference || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td>${p.category}</td>
                <td>
                    <div style="font-weight:600;">${p.seller?.shopName || p.seller?.name || 'غير معروف'}</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${p.seller?.name || ''}</div>
                </td>
                <td style="color:var(--primary); font-weight:700;">${p.price.toLocaleString()} DZD</td>
                <td><span class="status-badge status-${p.status || 'active'}">${translateStatus(p.status || 'active')}</span></td>
                <td class="action-btns">
                    <button class="ban" onclick="handleDeleteProduct('${p._id}')">🗑️ حذف</button>
                </td>
            </tr>
        `).join('');
    }
}

async function handleDeleteProduct(id) {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر؟ لا يمكن التراجع عن هذه العملية.')) return;

    const { ok } = await apiFetch(`/api/products/${id}`, {
        method: 'DELETE'
    });

    if (ok) {
        showToast('✅ تم حذف المنتج بنجاح');
        loadProducts();
        loadStats();
    } else {
        showToast('❌ فشل حذف المنتج', 'danger');
    }
}

