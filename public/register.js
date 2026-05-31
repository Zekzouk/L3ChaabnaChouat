

let currentMode = 'buyer';

const btnBuyer = document.getElementById('btn-buyer');
const btnSeller = document.getElementById('btn-seller');
const buyerForm = document.getElementById('buyer-form');
const sellerForm = document.getElementById('seller-form');
const submitBtn = document.getElementById('submit-btn');
const registerForm = document.getElementById('registerForm');

function toggleRequired(mode) {
    if (!buyerForm || !sellerForm) return;
    
    const buyerInputs = buyerForm.querySelectorAll('input');
    const sellerInputs = sellerForm.querySelectorAll('input:not([type="file"]), select');

    if(mode === 'buyer') {
        buyerInputs.forEach(el => el.required = true);
        sellerInputs.forEach(el => el.required = false);
    } else {
        buyerInputs.forEach(el => el.required = false);
        sellerInputs.forEach(el => el.required = true);
    }
}

function setMode(mode) {
    currentMode = mode;
    toggleRequired(mode);

    if (btnBuyer && btnSeller && buyerForm && sellerForm && submitBtn) {
        if(mode === 'buyer') {
            btnBuyer.classList.add('active');
            btnSeller.classList.remove('active');
            buyerForm.classList.add('active');
            sellerForm.classList.remove('active');
            submitBtn.textContent = 'إنشاء حساب زبون';
        } else {
            btnSeller.classList.add('active');
            btnBuyer.classList.remove('active');
            sellerForm.classList.add('active');
            buyerForm.classList.remove('active');
            submitBtn.textContent = 'تقديم طلب فتح متجر';
        }
    }
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let body;
        if (currentMode === 'buyer') {
            body = JSON.stringify({
                name: document.getElementById('buyer-name').value,
                email: document.getElementById('buyer-email').value,
                password: document.getElementById('buyer-password').value,
                role: 'buyer'
            });
        } else {
            body = new FormData();
            body.append('name', document.getElementById('seller-name').value);
            body.append('email', document.getElementById('seller-email').value);
            body.append('password', document.getElementById('seller-password').value);
            body.append('phone', document.getElementById('seller-phone').value);
            body.append('wilaya', document.getElementById('seller-wilaya').value);
            body.append('role', 'seller');
            body.append('shopName', document.getElementById('shop-name').value);
            
            const fileInput = document.getElementById('shop-file');
            if (fileInput && fileInput.files[0]) {
                body.append('shopFile', fileInput.files[0]);
            }
        }

        showToast('جارٍ معالجة الطلب...');
        
        const { ok, data } = await apiFetch('/api/auth/register', {
            method: 'POST',
            body: body
        });

        if (ok) {
            showToast(currentMode === 'buyer' ? 'تم إنشاء الحساب بنجاح!' : 'تم تقديم طلب المتجر بنجاح!');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showToast('خطأ: ' + (data?.message || 'حدث خطأ ما'), 'danger');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    if (role === 'seller') {
        setMode('seller');
    } else {
        setMode('buyer');
    }
});

