

let currentMode = 'buyer';

const btnBuyer = document.getElementById('btn-buyer');
const btnSeller = document.getElementById('btn-seller');
const submitBtn = document.getElementById('submit-btn');
const loginForm = document.getElementById('loginForm');

function setMode(mode) {
    currentMode = mode;
    
    if (btnBuyer && btnSeller && submitBtn) {
        if(mode === 'buyer') {
            btnBuyer.classList.add('active');
            btnSeller.classList.remove('active');
            submitBtn.textContent = 'تسجيل الدخول كزبون';
        } else {
            btnSeller.classList.add('active');
            btnBuyer.classList.remove('active');
            submitBtn.textContent = 'تسجيل الدخول كبائع';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'seller') {
        setMode('seller');
    } else {
        setMode('buyer');
    }
});

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    showToast('جارٍ تسجيل الدخول...');

    const { ok, data } = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (ok) {
        Auth.setToken(data.token);
        Auth.setUser(data.user); 

        showToast('تم تسجيل الدخول بنجاح!');

        setTimeout(() => {
            const user = Auth.getUser();
            if (user.role === 'admin') {
                window.location.href = 'admin_dashboard.html';
            } else if (user.role === 'seller') {
                window.location.href = 'seller_dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    } else {
        const errorMsg = data?.message || 'بيانات الدخول غير صحيحة';
        showToast('خطأ: ' + errorMsg, 'danger');
    }

}

