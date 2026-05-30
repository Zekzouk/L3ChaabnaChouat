

const Auth = {
    getToken: () => localStorage.getItem('sayaratiToken'),
    getUser: () => JSON.parse(localStorage.getItem('sayaratiUser')),
    setUser: (user) => localStorage.setItem('sayaratiUser', JSON.stringify(user)),
    setToken: (token) => localStorage.setItem('sayaratiToken', token),
    clear: () => {
        localStorage.removeItem('sayaratiToken');
        localStorage.removeItem('sayaratiUser');
    },
    logout: () => {
        Auth.clear();
        window.location.href = 'login.html';
    },
    isAuthenticated: () => !!Auth.getToken(),
    checkRole: (role) => {
        const user = Auth.getUser();
        if (!user || user.role !== role) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

async function apiFetch(url, options = {}) {
    const token = Auth.getToken();
    const headers = { ...(options.headers || {}) };

    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['x-auth-token'] = token;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);
        
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {

            const text = await response.text();

            if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
                data = { message: `Error ${response.status}: ${response.statusText || 'حدث خطأ في الخادم'}` };
            } else {
                data = { message: text || `Error ${response.status}` };
            }
        }
        
        return {
            ok: response.ok,
            status: response.status,
            data
        };
    } catch (err) {
        console.error(`API Fetch Error (${url}):`, err);
        return {
            ok: false,
            status: 0,
            data: { message: 'خطأ في الاتصال بالسيرفر: ' + err.message }
        };
    }
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer') || document.getElementById('toastMsg');
    if (!container) return;

    if (container.id === 'toastMsg') {
        container.textContent = msg;
        container.classList.add('show');
        setTimeout(() => container.classList.remove('show'), 3000);
    } else {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        if (type === 'danger') toast.style.background = 'var(--danger)';
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

function translateStatus(status) {
    const map = {
        'active': 'نشط',
        'pending': '⏳ قيد المراجعة',
        'banned': 'محظور',
        'shipped': 'تم الشحن',
        'delivered': 'تم التسليم',
        'canceled': 'ملغى'
    };
    return map[status] || status;
}

function getEmojiForCategory(cat) {
    if (!cat) return '📦';
    const c = cat.toLowerCase();
    if (c.includes('engine')) return '⚙️'; 
    if (c.includes('brake')) return '🛑'; 
    if (c.includes('cooling')) return '❄️'; 
    if (c.includes('electrical') || c.includes('lighting')) return '💡'; 
    if (c.includes('body')) return '🚙'; 
    if (c.includes('suspension') || c.includes('steering')) return '🛠️'; 
    if (c.includes('transmission')) return '🕹️'; 
    if (c.includes('fuel') || c.includes('air')) return '⛽'; 
    if (c.includes('wheel') || c.includes('tire')) return '🛞'; 
    if (c.includes('interior')) return '🛋️'; 
    if (c.includes('hoses') || c.includes('hardware')) return '🔩'; 
    if (c.includes('tool') || c.includes('fluid') || c.includes('chemical')) return '🧴'; 
    return '📦';
}

const Cart = {
    storageKey: 'sayaratiCart',
    load: () => JSON.parse(localStorage.getItem(Cart.storageKey)) || [],
    save: (cart) => localStorage.setItem(Cart.storageKey, JSON.stringify(cart)),
    add: (product) => {
        const cart = Cart.load();
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        Cart.save(cart);
        return cart;
    },
    remove: (id) => {
        const cart = Cart.load().filter(item => item.id !== id);
        Cart.save(cart);
        return cart;
    },
    clear: () => localStorage.removeItem(Cart.storageKey)
};

document.addEventListener('DOMContentLoaded', () => {
    const globalLogoutBtn = document.getElementById('logoutBtn');
    if (globalLogoutBtn) {
        globalLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }

    const user = Auth.getUser();
    const loginLink = document.getElementById('userAccountLink');
    const guestLinks = document.querySelectorAll('.guest-only');

    if (user && loginLink) {
        guestLinks.forEach(link => link.style.display = 'none');
        loginLink.textContent = `حسابي (${user.name})`;
        loginLink.href = user.role === 'seller' ? 'seller_dashboard.html' : 
                         user.role === 'admin' ? 'admin_dashboard.html' : 'buyer_dashboard.html';
    }
});
