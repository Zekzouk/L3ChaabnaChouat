

const STATIC_PRODUCTS = [
  {
    _id: 'static-01',
    title: 'بنو Michelin Pilot Sport 4 — 205/55 R16',
    description: 'إطار رياضي عالي الأداء من ميشلان. مثالي للطرق الجزائرية، ثبات ممتاز في التفريمات.',
    price: 12500,
    category: 'Wheels & Tires',
    condition: 'new',
    authenticity: 'original',
    brand: 'Michelin',
    carModel: 'Peugeot 308 / Renault Megane / Golf',
    reference: 'PS4-205-55-R16',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Michelin_Tyre_at_the_2012_Paris_Motor_Show_Metadata.jpg/640px-Michelin_Tyre_at_the_2012_Paris_Motor_Show_Metadata.jpg'],
    stock: 20,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-02',
    title: 'بنو Michelin Energy Saver+ — 185/65 R15',
    description: 'إطار اقتصادي من ميشلان. أقل استهلاكاً للوقود، مناسب للسيارات الصغيرة والتنقل اليومي في المدينة.',
    price: 9800,
    category: 'Wheels & Tires',
    condition: 'new',
    authenticity: 'original',
    brand: 'Michelin',
    carModel: 'Renault Clio / Symbol / Logan',
    reference: 'ES-185-65-R15',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Michelin_Tyre_at_the_2012_Paris_Motor_Show_Metadata.jpg/640px-Michelin_Tyre_at_the_2012_Paris_Motor_Show_Metadata.jpg'],
    stock: 25,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-03',
    title: 'بنو Iris VAN Summer — 195/70 R15C',
    description: 'إطار مصنوع في الجزائر من شركة Iris. مخصص للسيارات التجارية والنقل. متوفر في جميع الولايات.',
    price: 6800,
    category: 'Wheels & Tires',
    condition: 'new',
    authenticity: 'original',
    brand: 'Iris',
    carModel: 'Renault Kangoo / Peugeot Partner / Citroën Berlingo',
    reference: 'IRIS-VAN-195-70-R15C',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Continental_automotive_tire.jpg/640px-Continental_automotive_tire.jpg'],
    stock: 30,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-04',
    title: 'شمعة الإشعال NGK BKR6E — بواجي',
    description: 'بواجي NGK الأصلي موديل BKR6E. يستخدم في أغلب سيارات رينو وبيجو وسيتروان. ضمان أداء محرك مثالي.',
    price: 850,
    category: 'Engine',
    condition: 'new',
    authenticity: 'original',
    brand: 'NGK',
    carModel: 'Renault Clio / Symbol / Logan / Peugeot 206',
    reference: 'NGK-BKR6E',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sparkplug_ngk_01.jpg/640px-Sparkplug_ngk_01.jpg'],
    stock: 100,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-05',
    title: 'كيت سير التوقيت Bosch — شنكل كامل',
    description: 'كيت سير التوقيت الكامل من Bosch. يشمل السير، البكرات، ومضخة الماء. أصلي 100٪ مع ضمان سنتين.',
    price: 9200,
    category: 'Engine',
    condition: 'new',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'Renault Megane 2 / Scenic 2 — 1.9 dCi',
    reference: '1987946520',
    images: ['/uploads/media__1780186450458.jpg'],
    stock: 15,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-06',
    title: 'حزام التسيير ContiTech 6PK1548 — Courroie',
    description: 'حزام التسيير الخارجي من Continental ContiTech. يشغل المكيف، المولد ومضخة التوجيه. جودة OEM.',
    price: 2100,
    category: 'Engine',
    condition: 'new',
    authenticity: 'original',
    brand: 'ContiTech',
    carModel: 'Peugeot 308 / 407 / Citroën C5 — 1.6 HDi',
    reference: '6PK1548',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/V-belts.jpg/640px-V-belts.jpg'],
    stock: 25,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-07',
    title: 'طقم جوانات المحرك Elring — K9K كامل',
    description: 'طقم جوانات المحرك الكامل من Elring الألمانية. مقاوم للحرارة والزيت. مثالي لإصلاح الكولاس.',
    price: 4800,
    category: 'Engine',
    condition: 'new',
    authenticity: 'original',
    brand: 'Elring',
    carModel: 'Renault Clio 3 / Modus / Kangoo — 1.5 dCi K9K',
    reference: 'ELR-228.280',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Zylinderkopfdichtung_rechts.jpg/640px-Zylinderkopfdichtung_rechts.jpg'],
    stock: 12,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-08',
    title: 'قرص الفرامل Brembo — Disque avant Peugeot',
    description: 'قرصا الفرامل الأماميان من Brembo الإيطالية. أداء فرملة استثنائي وثبات في درجات الحرارة العالية.',
    price: 8500,
    category: 'Brakes',
    condition: 'new',
    authenticity: 'original',
    brand: 'Brembo',
    carModel: 'Peugeot 308 / 3008 — أمامي',
    reference: '09.A780.10',
    images: ['/uploads/media__1780186450457.jpg'],
    stock: 18,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-09',
    title: 'تيل الفرامل Bosch — Plaquettes avant Logan',
    description: 'طقم تيل فرامل أمامي من Bosch. 4 قطع مع إسبلة الإنذار. مقاوم للحرارة وهادئ جداً.',
    price: 3200,
    category: 'Brakes',
    condition: 'new',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'Renault Logan / Symbol / Sandero',
    reference: '0 986 424 694',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Disc_brake_pads.jpg/640px-Disc_brake_pads.jpg'],
    stock: 40,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-10',
    title: 'رادياتير المحرك Valeo — Clio 3 1.5 dCi',
    description: 'رادياتير المحرك الكامل من Valeo الفرنسية. معدن + بلاستيك. ضمان 2 سنة. سهل التركيب.',
    price: 11500,
    category: 'Cooling & A/C',
    condition: 'new',
    authenticity: 'original',
    brand: 'Valeo',
    carModel: 'Renault Clio 3 / Modus — 1.5 dCi',
    reference: '735099',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Car_radiator.jpg/640px-Car_radiator.jpg'],
    stock: 10,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-11',
    title: 'مضخة الماء Dolz R218 — Pompe à eau',
    description: 'مضخة ماء من Dolz الإسبانية. موثوقة ومعتمدة لدى معظم مراكز الصيانة في الجزائر.',
    price: 3600,
    category: 'Cooling & A/C',
    condition: 'new',
    authenticity: 'original',
    brand: 'Dolz',
    carModel: 'Renault Megane 2 / Laguna 2 — 2.0 16v',
    reference: 'R218',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Wasserpumpe_Auto_P1060933.jpg/640px-Wasserpumpe_Auto_P1060933.jpg'],
    stock: 22,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-12',
    title: 'ترموستات Wahler 4222.87D — Peugeot 206',
    description: 'ترموستات أصلي من Wahler الألمانية. يضمن درجة حرارة المحرك المثلى ويحمي من السخونة.',
    price: 1400,
    category: 'Cooling & A/C',
    condition: 'new',
    authenticity: 'original',
    brand: 'Wahler',
    carModel: 'Peugeot 206 / 207 / 307 — 1.4 HDi',
    reference: '4222.87D',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Thermostat_01.jpg/640px-Thermostat_01.jpg'],
    stock: 35,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-13',
    title: 'بطارية Bosch S4 60Ah — 540A الأكثر مبيعاً',
    description: 'بطارية Bosch S4 مقاومة للحرارة الجزائرية. 60Ah ـ 540A démarrage. ضمان سنتين. الأكثر مبيعاً في الجزائر.',
    price: 16000,
    category: 'Electrical & Lighting',
    condition: 'new',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'عام — كل السيارات الأوروبية',
    reference: '0 092 S40 050',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Lead-acid_car_battery.jpg/640px-Lead-acid_car_battery.jpg'],
    stock: 30,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-14',
    title: 'مولد الكهرباء Valeo 90A — Alternateur Clio',
    description: 'مولد كهرباء Valeo بقدرة 90A. مُعاد تصنيعه بشكل كامل ومعتمد (échangeur standard). ضمان 12 شهراً.',
    price: 14500,
    category: 'Electrical & Lighting',
    condition: 'used',
    authenticity: 'original',
    brand: 'Valeo',
    carModel: 'Renault Clio 2 / Kangoo — 1.9 D',
    reference: 'VAL-436593',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Alternator_1.jpg/640px-Alternator_1.jpg'],
    stock: 8,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-15',
    title: 'مارش Bosch 1.2kW — Démarreur Peugeot 206',
    description: 'مارش (démarreur) من Bosch بقدرة 1.2kW. مُعاد تصنيعه بمعايير المصنع. يشمل الضمان.',
    price: 9800,
    category: 'Electrical & Lighting',
    condition: 'used',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'Peugeot 206 / 207 — 1.4i',
    reference: '0 001 121 404',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Anlasser_P1060938.jpg/640px-Anlasser_P1060938.jpg'],
    stock: 6,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-16',
    title: 'فلتر الزيت Mann-Filter — Filtre à huile W 712/75',
    description: 'فلتر الزيت الدائري الأصلي من Mann-Filter الألمانية. موديل W 712/75. تصفية ممتازة للشوائب لحماية محركات VAG ورينو.',
    price: 850,
    category: 'Fuel & Air',
    condition: 'new',
    authenticity: 'original',
    brand: 'Mann-Filter',
    carModel: 'VW Golf 5,6 / Renault Clio 3 / Audi A3',
    reference: 'W 712/75',
    images: ['/uploads/media__1780186670838.jpg'],
    stock: 150,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-17',
    title: 'فلتر الهواء Purflux A1237 — Clio 3',
    description: 'فلتر الهواء من Purflux الفرنسية. يحمي المحرك من الغبار والشوائب. مناسب للجو الجزائري.',
    price: 780,
    category: 'Fuel & Air',
    condition: 'new',
    authenticity: 'original',
    brand: 'Purflux',
    carModel: 'Renault Clio 3 / Modus — 1.2 & 1.4 16v',
    reference: 'A1237',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Air_filter_of_a_car.jpg/640px-Air_filter_of_a_car.jpg'],
    stock: 80,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-18',
    title: 'فلتر الديزل Delphi HDF530 — Megane 2',
    description: 'فلتر الوقود للسيارات الديزل من Delphi. أصلي. يزيل الماء والشوائب من الوقود.',
    price: 1100,
    category: 'Fuel & Air',
    condition: 'new',
    authenticity: 'original',
    brand: 'Delphi',
    carModel: 'Renault Megane 2 / Scenic 2 — 1.5 dCi & 1.9 dCi',
    reference: 'HDF530',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fuel-filter.jpg/640px-Fuel-filter.jpg'],
    stock: 60,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-19',
    title: 'فلتر الكبين Bosch M2030 — مكيف Clio 3',
    description: 'فلتر كبين المكيف من Bosch. يصفي الهواء الداخلي من الغبار والحبوب. ضروري للجو الجزائري.',
    price: 920,
    category: 'Fuel & Air',
    condition: 'new',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'Renault Clio 3 / Modus / Kangoo 2',
    reference: '1 987 432 030',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Used_and_new_cabin_air_filters.jpg/640px-Used_and_new_cabin_air_filters.jpg'],
    stock: 70,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-20',
    title: 'مساعد كامل Monroe Quick-Strut — Amortisseur complet',
    description: 'مساعد أمامي كامل من نوع Quick-Strut من Monroe الألمانية. يشمل المساعد، الياي (Ressort)، والكرسي العلوي. جاهز للتركيب مباشرة.',
    price: 13500,
    category: 'Suspension & Steering',
    condition: 'new',
    authenticity: 'original',
    brand: 'Monroe',
    carModel: 'Toyota Corolla / Rav4 — أمامي يمين',
    reference: 'MON-172115',
    images: ['/uploads/media__1780186670796.jpg'],
    stock: 12,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-21',
    title: 'كيت البراس Febi Bilstein 42074 — Duster',
    description: 'طقم لحامة كامل يشمل البراس، السيلان، الرولمان الأمامي. من Febi Bilstein الألمانية.',
    price: 5500,
    category: 'Suspension & Steering',
    condition: 'new',
    authenticity: 'original',
    brand: 'Febi Bilstein',
    carModel: 'Renault Logan / Sandero / Duster — أمامي',
    reference: '42074',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Suspension_control_arm.jpg/640px-Suspension_control_arm.jpg'],
    stock: 16,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-22',
    title: 'روتولة التوجيه Meyle — Clio 2 / Symbol',
    description: 'روتولة التوجيه من Meyle الألمانية. تحل مشكلة الاهتزاز وعدم الثبات في الطريق.',
    price: 2400,
    category: 'Suspension & Steering',
    condition: 'new',
    authenticity: 'original',
    brand: 'Meyle',
    carModel: 'Renault Clio 2 / Symbol / Thalia',
    reference: '16-16 020 0020',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Tie_rod_end.jpg/640px-Tie_rod_end.jpg'],
    stock: 28,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-23',
    title: 'مصباح الضباب Hella — Phare antibrouillard',
    description: 'مصباح ضباب دائري (Antibrouillard) عدسة ميتاليك من Hella. إضاءة قوية ومثالية للظروف الجوية الصعبة والضباب.',
    price: 3600,
    category: 'Body Parts',
    condition: 'new',
    authenticity: 'original',
    brand: 'Hella',
    carModel: 'عام — متوافق مع عدة سيارات',
    reference: 'HEL-1NL008090-821',
    images: ['/uploads/media__1780186670784.jpg'],
    stock: 25,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-24',
    title: 'زيت المحرك Total Quartz 9000 — 5W40 — 5L',
    description: 'زيت المحرك التخليقي بالكامل (Fully Synthetic) من توتال. لزوجة 5W40 سعة 5 لتر. حماية ممتازة للمحرك في درجات الحرارة العالية ومناسب للسيارات الحديثة.',
    price: 4900,
    category: 'Tools & Fluids',
    condition: 'new',
    authenticity: 'original',
    brand: 'Total',
    carModel: 'عام — السيارات الحديثة',
    reference: 'TQ9000-5W40-5L',
    images: ['/uploads/media__1780186670779.jpg'],
    stock: 200,
    seller: { name: 'CarFix Demo' }
  },
  {
    _id: 'static-25',
    title: 'زيت Castrol GTX 20W50 — 5L — للمحركات القديمة',
    description: 'زيت Castrol GTX 20W50 الكلاسيكي. مناسب للمحركات القديمة والطقس الحار. الأكثر مبيعاً في الجنوب.',
    price: 3200,
    category: 'Tools & Fluids',
    condition: 'new',
    authenticity: 'original',
    brand: 'Castrol',
    carModel: 'عام — المحركات القديمة',
    reference: 'CASTROL-GTX-20W50-5L',
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Castrol_lubricants.jpg/640px-Castrol_lubricants.jpg'],
    stock: 150,
    seller: { name: 'CarFix Demo' }
  }
];

function filterStaticProducts(params = {}) {
  let results = [...STATIC_PRODUCTS];

  if (params.search) {
    const q = params.search.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.carModel && p.carModel.toLowerCase().includes(q))
    );
  }

  if (params.category && !params.category.includes('all')) {
    const cats = Array.isArray(params.category) ? params.category : [params.category];
    results = results.filter(p => cats.includes(p.category));
  }

  if (params.condition) {
    const conds = Array.isArray(params.condition) ? params.condition : [params.condition];
    results = results.filter(p => conds.includes(p.condition));
  }

  if (params.authenticity) {
    const auths = Array.isArray(params.authenticity) ? params.authenticity : [params.authenticity];
    results = results.filter(p => auths.includes(p.authenticity));
  }

  if (params.brand) {
    const brands = Array.isArray(params.brand) ? params.brand : [params.brand];
    results = results.filter(p => brands.some(b => p.brand && p.brand.toLowerCase().includes(b.toLowerCase())));
  }

  if (params.maxPrice) {
    results = results.filter(p => p.price <= Number(params.maxPrice));
  }

  if (params.sort === 'price_asc') results.sort((a, b) => a.price - b.price);
  else if (params.sort === 'price_desc') results.sort((a, b) => b.price - a.price);

  return results;
}

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

let products = [];
    let total = 0;
    let totalPages = 1;
    let usedStatic = false;

    try {
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

        if (ok && data && data.products) {
            products = data.products;
            total = data.total;
            totalPages = data.totalPages;
        } else {
            usedStatic = true;
        }
    } catch (e) {
        usedStatic = true;
    }

    if (usedStatic) {
        const filtered = filterStaticProducts(params);
        total = filtered.length;
        const limit = 12;
        totalPages = Math.max(1, Math.ceil(total / limit));
        const start = (page - 1) * limit;
        products = filtered.slice(start, start + limit);
    }

    allProducts = products;
    renderProducts(allProducts);
    renderPagination(page, totalPages, total);
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
    info.textContent = `صفحة ${page} من ${totalPages} — ${total} منتج`;
    paginationContainer.appendChild(info);
}

function renderProducts(products) {
    if (!productGrid) return;

    if (products.length === 0) {
        productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><p style="color: var(--text-secondary);">لا توجد نتائج مطابقة لبحثك.</p></div>`;
        return;
    }

    productGrid.innerHTML = products.map(p => {
        const imgSrc = p.image || (p.images && p.images[0]) || '';
        const hasImg = imgSrc && !imgSrc.includes('placeholder');
        return `
        <div class="product-card">
            <button class="wishlist-btn">🤍</button>
            <div class="product-media" style="cursor:pointer;" onclick="window.location.href='product.html?id=${p._id}'">
                ${hasImg
                    ? `<img src="${imgSrc}" style="width:100%; height:180px; object-fit:cover; border-bottom:1px solid var(--border-color);" alt="${p.title}" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:180px;background:#1a2942;display:flex;align-items:center;justify-content:center;font-size:4rem;border-bottom:1px solid var(--border-color);\\'>'+getEmojiForCategory('${p.category}')+'</div>'">`
                    : `<div class="product-emoji-placeholder" style="width:100%; height:180px; background:#1a2942; display:flex; align-items:center; justify-content:center; font-size:4rem; border-bottom:1px solid var(--border-color);">${getEmojiForCategory(p.category)}</div>`
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
        </div>`;
    }).join('');
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
        priceRange.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyFilters();
        });
    }

    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.name === 'category') {
                const isAll = e.target.value === 'all';
                if (isAll && e.target.checked) {
                    document.querySelectorAll('input[name="category"]:not([value="all"])').forEach(i => i.checked = false);
                } else if (!isAll && e.target.checked) {
                    const allCheckbox = document.querySelector('input[name="category"][value="all"]');
                    if (allCheckbox) allCheckbox.checked = false;
                }
            }
            applyFilters();
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
