const ordersTable = document.getElementById('buyerOrdersTable');
const profileForm = document.getElementById('profileForm');

let user = Auth.getUser();

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.checkRole('buyer')) return;

    if (document.getElementById('welcomeMsg')) {
        document.getElementById('welcomeMsg').textContent = `أهلاً بك، ${user.name} 👋`;
    }

    loadOrders();
    loadProfileData();
});

function loadProfileData() {
    if (user) {
        const nameField = document.getElementById('set-name');
        const emailField = document.getElementById('set-email');
        const phoneField = document.getElementById('set-phone');
        if (nameField) nameField.value = user.name;
        if (emailField) emailField.value = user.email;
        if (phoneField) phoneField.value = user.phone || '';
    }
}

async function loadOrders() {
    const { ok, data: orders } = await apiFetch('/api/orders/buyer');
    if (!ok || !ordersTable) return;

    if (orders.length === 0) {
        ordersTable.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-secondary);">لم تقم بإجراء أي طلبات حتى الآن. <a href="index.html" style="color:var(--primary);">اذهب للمتجر الآن</a></td></tr>`;
        return;
    }

    ordersTable.innerHTML = orders.map(o => `
        <tr>
            <td style="font-family: var(--font-en); font-size: 0.85rem;">#${o._id.slice(-6).toUpperCase()}</td>
            <td>${o.items.map(i => i.title).join(', ')}</td>
            <td style="font-family: var(--font-en); font-weight: bold; color: var(--primary);">${o.totalPrice.toLocaleString()} DZD</td>
            <td>
                <span class="status-badge status-${o.status}">
                    ${translateStatus(o.status)}
                </span>
            </td>
            <td>${new Date(o.createdAt).toLocaleDateString('ar-DZ')}</td>
            <td class="action-btns">
                <button title="حذف الطلب نهائياً" onclick="handleDeleteOrder('${o._id}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem;">🗑️</button>
            </td>
        </tr>
    `).join('');

    const notifiedOrders = JSON.parse(localStorage.getItem('notifiedOrders')) || {};
    let newlyDelivered = 0;
    let newlyShipped = 0;
    const isFirstTime = !localStorage.getItem('notifiedOrders');

    orders.forEach(o => {
        if (o.status === 'delivered' || o.status === 'shipped') {
            if (notifiedOrders[o._id] !== o.status) {
                if (!isFirstTime) {
                    if (o.status === 'delivered') newlyDelivered++;
                    if (o.status === 'shipped') newlyShipped++;
                }
                notifiedOrders[o._id] = o.status;
            }
        }
    });

    if (newlyDelivered > 0 || newlyShipped > 0 || isFirstTime) {
        localStorage.setItem('notifiedOrders', JSON.stringify(notifiedOrders));
    }

    if (newlyDelivered === 1) showToast('🎉 رائع! تم تسليم أحد طلباتك بنجاح.', 'success');
    else if (newlyDelivered > 1) showToast(`🎉 رائع! تم تسليم ${newlyDelivered} طلبات بنجاح.`, 'success');
    
    if (newlyShipped === 1) setTimeout(() => showToast('🚚 طلبك الآن في الطريق إليك!', 'success'), newlyDelivered ? 3500 : 0);
    else if (newlyShipped > 1) setTimeout(() => showToast(`🚚 لديك ${newlyShipped} طلبات في الطريق إليك!`, 'success'), newlyDelivered ? 3500 : 0);
}

if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const profileData = {
            name: document.getElementById('set-name').value,
            phone: document.getElementById('set-phone').value
        };

        showToast('جارٍ تحديث البيانات...');
        const { ok, data } = await apiFetch('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });

        if (ok) {
            Auth.setUser(data.user);
            showToast('تم تحديث الملف الشخصي بنجاح');
        } else {
            showToast('خطأ: ' + (data?.message || 'فشل التحديث'), 'danger');
        }
    });
}

async function handleCancelOrder(id) {
    if (!confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟')) return;

    showToast('جارٍ إلغاء الطلب...');
    const { ok, data } = await apiFetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'canceled' })
    });

    if (ok) {
        showToast('تم إلغاء الطلب بنجاح', 'success');
        loadOrders();
    } else {
        showToast('فشل الإلغاء: ' + (data?.message || 'خطأ غير متوقع'), 'danger');
    }
}

async function handleDeleteOrder(id) {
    if (!confirm('هل تريد إخفاء هذا الطلب من قائمتك؟ (سيبقى محفوظاً في قاعدة البيانات للمراجعة)')) return;

    showToast('جارٍ الإخفاء...');
    const { ok, data } = await apiFetch(`/api/orders/${id}`, {
        method: 'DELETE'
    });

    if (ok) {
        showToast('تم إخفاء الطلب بنجاح', 'success');
        loadOrders();
    } else {
        showToast('فشل العملية: ' + (data?.message || 'خطأ غير متوقع'), 'danger');
    }
}

