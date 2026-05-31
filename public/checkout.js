

const itemsList = document.getElementById('orderItemsList');
const subtotalDisplay = document.getElementById('subtotal-cost');
const shippingDisplay = document.getElementById('shipping-cost-display');
const totalDisplay = document.getElementById('total-cost-display');
const wilayaSelect = document.getElementById('wilaya-select');
const confirmBtn = document.getElementById('confirmOrderBtn');

let cart = Cart.load();
let subtotal = 0;
let shippingCost = 0;

document.addEventListener('DOMContentLoaded', () => {
    if (cart.length === 0) {
        alert('سلتك فارغة!');
        window.location.href = 'index.html';
        return;
    }
    renderSummary();
});

function renderSummary() {
    subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    itemsList.innerHTML = cart.map(item => `
        <div class="order-item" style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <div>
                <div style="font-weight:bold;">${item.title}</div>
                <div style="font-size:0.8rem; color:var(--text-secondary);">الكمية: ${item.qty}</div>
            </div>
            <div style="font-family:var(--font-en);">${(item.price * item.qty).toLocaleString()} DZD</div>
        </div>
    `).join('');

    subtotalDisplay.textContent = `${subtotal.toLocaleString()} DZD`;
    updateTotal();
}

function updateShipping() {
    shippingCost = parseInt(wilayaSelect.value) || 0;
    shippingDisplay.textContent = `${shippingCost.toLocaleString()} DZD`;
    updateTotal();
}

function updateTotal() {
    const total = subtotal + shippingCost;
    totalDisplay.textContent = `${total.toLocaleString()} DZD`;
}

if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
        const name = document.getElementById('c-name').value;
        const phone = document.getElementById('c-phone').value;
        const address = document.getElementById('c-address').value;
        const wilayaText = wilayaSelect.options[wilayaSelect.selectedIndex].text;

        if (!name || !phone || !address || shippingCost === 0) {
            alert('يرجى ملء جميع البيانات واختيار الولاية');
            return;
        }

        const orderData = {
            items: cart.map(item => ({
                product: item.id,
                title: item.title,
                price: item.price,
                quantity: item.qty,
                seller: item.seller
            })),
            shippingDetails: {
                name,
                phone,
                address,
                wilaya: wilayaText
            },
            totalPrice: subtotal + shippingCost,
            shippingCost: shippingCost
        };

        confirmBtn.disabled = true;
        confirmBtn.textContent = 'جارٍ معالجة الطلب...';

        const { ok, data } = await apiFetch('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        if (ok) {
            Cart.clear();
            document.getElementById('successModal').classList.add('active');
        } else {
            alert('فشل في تأكيد الطلب: ' + (data?.message || 'يرجى المحاولة لاحقاً.'));
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'تأكيد الطلب والدفع عند الاستلام';
        }
    });
}

