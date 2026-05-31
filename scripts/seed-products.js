/**
 * SAYARATI — Seed Script: 25 Real Car Parts
 * Run: node scripts/seed-products.js
 *
 * - Creates a demo seller account (if not exists)
 * - Inserts 25 real auto parts with real product images & DZD prices
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
const User     = require('../models/User');
const Product  = require('../models/Product');

dotenv.config();

// ─── 25 REAL PARTS ──────────────────────────────────────────────────────────
// Prices are realistic DZD estimates (2025) for the Algerian market.
// Images are direct product photos from manufacturer / distributor sites.
const PARTS = [
  // ── WHEELS & TIRES ─────────────────────────────────────────────────────
  {
    title: 'بنو Michelin Pilot Sport 4 — 205/55 R16',
    description: 'إطار رياضي عالي الأداء من ميشلان. مثالي للطرق الجزائرية، ثبات ممتاز في التفريمات ومقاومة تآكل استثنائية. مناسب لـ Peugeot 308, Renault Megane, Golf.',
    price: 12500,
    category: 'Wheels & Tires',
    condition: 'new',
    authenticity: 'original',
    brand: 'Michelin',
    carModel: 'Peugeot 308 / Renault Megane / Golf VI',
    reference: 'PS4-205-55-R16',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Michelin_Tyre_at_the_2012_Paris_Motor_Show_Metadata.jpg/640px-Michelin_Tyre_at_the_2012_Paris_Motor_Show_Metadata.jpg',
    stock: 20
  },
  {
    title: 'بنو Iris VAN Summer — 195/70 R15C',
    description: 'إطار مصنوع في الجزائر من شركة Iris. مخصص للسيارات التجارية والنقل. متوفر في جميع ولايات الجزائر.',
    price: 6800,
    category: 'Wheels & Tires',
    condition: 'new',
    authenticity: 'original',
    brand: 'Iris',
    carModel: 'Renault Kangoo / Peugeot Partner / Citroën Berlingo',
    reference: 'IRIS-VAN-195-70-R15C',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Continental_automotive_tire.jpg/640px-Continental_automotive_tire.jpg',
    stock: 30
  },

  // ── ENGINE ──────────────────────────────────────────────────────────────
  {
    title: 'شمعة إشعال NGK BKR6E — بواجي',
    description: 'بواجي NGK الأصلي موديل BKR6E. يستخدم في أغلب سيارات رينو وبيجو وسيتروان المنتشرة في الجزائر. ضمان أداء محرك مثالي واقتصاد في الوقود.',
    price: 850,
    category: 'Engine',
    condition: 'new',
    authenticity: 'original',
    brand: 'NGK',
    carModel: 'Renault Clio / Symbol / Logan / Peugeot 206',
    reference: 'NGK-BKR6E',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sparkplug_ngk_01.jpg/640px-Sparkplug_ngk_01.jpg',
    stock: 100
  },
  {
    title: 'سير التوقيت Bosch — كيت شنكل',
    description: 'كيت سير التوقيت الكامل من Bosch. يشمل السير، البكرات، ومضخة الماء. أصلي 100٪ مع ضمان 2 سنة.',
    price: 9200,
    category: 'Engine',
    condition: 'new',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'Renault Megane 2 / Scenic 2 / Laguna 2 — 1.9 dCi',
    reference: '1987946520',
    image: '/uploads/media__1780186450458.jpg',
    stock: 15
  },
  {
    title: 'حزام التسيير (Courroie accessoires) Contitech — 6PK1548',
    description: 'حزام التسيير الخارجي من Continental ContiTech. يشغل المكيف، المولد ومضخة التوجيه. جودة OEM.',
    price: 2100,
    category: 'Engine',
    condition: 'new',
    authenticity: 'original',
    brand: 'ContiTech',
    carModel: 'Peugeot 308 / 407 / Citroën C5 — 1.6 HDi',
    reference: '6PK1548',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/V-belts.jpg/640px-V-belts.jpg',
    stock: 25
  },
  {
    title: 'جوان المحرك Elring — طقم كامل',
    description: 'طقم جوانات المحرك الكامل من Elring الألمانية. عالي الجودة، مقاوم للحرارة والزيت. مثالي لإصلاح الغاز (culasse) أو تجديد المحرك.',
    price: 4800,
    category: 'Engine',
    condition: 'new',
    authenticity: 'original',
    brand: 'Elring',
    carModel: 'Renault Clio 3 / Modus / Kangoo — 1.5 dCi K9K',
    reference: 'ELR-228.280',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Zylinderkopfdichtung_rechts.jpg/640px-Zylinderkopfdichtung_rechts.jpg',
    stock: 12
  },

  // ── BRAKES ──────────────────────────────────────────────────────────────
  {
    title: 'طقم ديسك Brembo — Disques de frein avant',
    description: 'قرصا الفرامل الأماميان من Brembo الإيطالية. أصلي OEM. أداء فرملة استثنائي وثبات في درجات الحرارة العالية.',
    price: 8500,
    category: 'Brakes',
    condition: 'new',
    authenticity: 'original',
    brand: 'Brembo',
    carModel: 'Peugeot 308 / 3008 — أمامي',
    reference: '09.A780.10',
    image: '/uploads/media__1780186450457.jpg',
    stock: 18
  },
  {
    title: 'تيل الفرامل Bosch — Plaquettes de frein avant',
    description: 'طقم تيل فرامل أمامي من Bosch. يشمل 4 قطع مع إسبلة الإنذار. مقاوم للحرارة العالية وهادئ جداً.',
    price: 3200,
    category: 'Brakes',
    condition: 'new',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'Renault Logan / Symbol / Sandero',
    reference: '0 986 424 694',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Disc_brake_pads.jpg/640px-Disc_brake_pads.jpg',
    stock: 40
  },

  // ── COOLING & A/C ───────────────────────────────────────────────────────
  {
    title: 'رادياتير المحرك Valeo — Radiateur moteur',
    description: 'رادياتير المحرك الكامل من Valeo الفرنسية. معدن + بلاستيك. ضمان 2 سنة. سهل التركيب بدون تعديل.',
    price: 11500,
    category: 'Cooling & A/C',
    condition: 'new',
    authenticity: 'original',
    brand: 'Valeo',
    carModel: 'Renault Clio 3 / Modus — 1.5 dCi',
    reference: '735099',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Car_radiator.jpg/640px-Car_radiator.jpg',
    stock: 10
  },
  {
    title: 'مضخة الماء Dolz — Pompe à eau',
    description: 'مضخة ماء من Dolz الإسبانية. موثوقة ومعتمدة لدى معظم مراكز الصيانة في الجزائر.',
    price: 3600,
    category: 'Cooling & A/C',
    condition: 'new',
    authenticity: 'original',
    brand: 'Dolz',
    carModel: 'Renault Megane 2 / Laguna 2 — 2.0 16v',
    reference: 'R218',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Wasserpumpe_Auto_P1060933.jpg/640px-Wasserpumpe_Auto_P1060933.jpg',
    stock: 22
  },
  {
    title: 'ترموستات Wahler — Thermostat',
    description: 'ترموستات أصلي من Wahler الألمانية. يضمن درجة حرارة المحرك المثلى ويحمي من السخونة الزائدة.',
    price: 1400,
    category: 'Cooling & A/C',
    condition: 'new',
    authenticity: 'original',
    brand: 'Wahler',
    carModel: 'Peugeot 206 / 207 / 307 — 1.4 HDi',
    reference: '4222.87D',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Thermostat_01.jpg/640px-Thermostat_01.jpg',
    stock: 35
  },

  // ── ELECTRICAL & LIGHTING ───────────────────────────────────────────────
  {
    title: 'بطارية Bosch S4 — 60Ah 540A',
    description: 'بطارية Bosch S4 مقاومة للحرارة الجزائرية. 60Ah ـ 540 Ampères de démarrage. ضمان 2 سنة. الأكثر مبيعاً في الجزائر.',
    price: 16000,
    category: 'Electrical & Lighting',
    condition: 'new',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'متوافق مع معظم السيارات الأوروبية',
    reference: '0 092 S40 050',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Lead-acid_car_battery.jpg/640px-Lead-acid_car_battery.jpg',
    stock: 30
  },
  {
    title: 'مولد الكهرباء Valeo — Alternateur 90A',
    description: 'مولد كهرباء Valeo بقدرة 90A. مُعاد تصنيعه بشكل كامل ومعتمد (échangeur standard). ضمان 12 شهراً.',
    price: 14500,
    category: 'Electrical & Lighting',
    condition: 'used',
    authenticity: 'original',
    brand: 'Valeo',
    carModel: 'Renault Clio 2 / Kangoo — 1.9 D',
    reference: 'VAL-436593',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Alternator_1.jpg/640px-Alternator_1.jpg',
    stock: 8
  },
  {
    title: 'ديناموس Bosch — Démarreur 1.2kW',
    description: 'مارش (démarreur) من Bosch بقدرة 1.2kW. مُعاد تصنيعه بمعايير المصنع. يشمل الضمان.',
    price: 9800,
    category: 'Electrical & Lighting',
    condition: 'used',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'Peugeot 206 / 207 — 1.4i',
    reference: '0 001 121 404',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Anlasser_P1060938.jpg/640px-Anlasser_P1060938.jpg',
    stock: 6
  },

  // ── FILTERS & FUEL ──────────────────────────────────────────────────────
  {
    title: 'فلتر الزيت Mann-Filter — Filtre à huile W 712/75',
    description: 'فلتر الزيت الدائري الأصلي من Mann-Filter الألمانية. موديل W 712/75. تصفية ممتازة للشوائب لحماية محركات VAG ورينو.',
    price: 850,
    category: 'Fuel & Air',
    condition: 'new',
    authenticity: 'original',
    brand: 'Mann-Filter',
    carModel: 'VW Golf 5,6 / Renault Clio 3 / Audi A3',
    reference: 'W 712/75',
    image: '/uploads/media__1780186670838.jpg',
    stock: 150
  },
  {
    title: 'فلتر الهواء Purflux — Filtre à air A1237',
    description: 'فلتر الهواء من Purflux الفرنسية. يحمي المحرك من الغبار والشوائب. مناسب للجو الجزائري.',
    price: 780,
    category: 'Fuel & Air',
    condition: 'new',
    authenticity: 'original',
    brand: 'Purflux',
    carModel: 'Renault Clio 3 / Modus — 1.2 & 1.4 16v',
    reference: 'A1237',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Air_filter_of_a_car.jpg/640px-Air_filter_of_a_car.jpg',
    stock: 80
  },
  {
    title: 'فلتر الديزل Delphi — Filtre gazole HDF530',
    description: 'فلتر الوقود للسيارات الديزل من Delphi. أصلي. يزيل الماء والشوائب من الوقود.',
    price: 1100,
    category: 'Fuel & Air',
    condition: 'new',
    authenticity: 'original',
    brand: 'Delphi',
    carModel: 'Renault Megane 2 / Scenic 2 — 1.5 dCi & 1.9 dCi',
    reference: 'HDF530',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fuel-filter.jpg/640px-Fuel-filter.jpg',
    stock: 60
  },
  {
    title: 'فلتر مكيف (HABITACLE) Bosch M2030',
    description: 'فلتر كبين المكيف من Bosch. يصفي الهواء الداخلي من الغبار والحبوب. ضروري للجو الجزائري.',
    price: 920,
    category: 'Fuel & Air',
    condition: 'new',
    authenticity: 'original',
    brand: 'Bosch',
    carModel: 'Renault Clio 3 / Modus / Kangoo 2',
    reference: '1 987 432 030',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Used_and_new_cabin_air_filters.jpg/640px-Used_and_new_cabin_air_filters.jpg',
    stock: 70
  },

  // ── SUSPENSION & STEERING ────────────────────────────────────────────────
  {
    title: 'مساعد كامل Monroe Quick-Strut — Amortisseur complet',
    description: 'مساعد أمامي كامل من نوع Quick-Strut من Monroe الألمانية. يشمل المساعد، الياي (Ressort)، والكرسي العلوي. جاهز للتركيب مباشرة.',
    price: 13500,
    category: 'Suspension & Steering',
    condition: 'new',
    authenticity: 'original',
    brand: 'Monroe',
    carModel: 'Toyota Corolla / Rav4 — أمامي يمين',
    reference: 'MON-172115',
    image: '/uploads/media__1780186670796.jpg',
    stock: 12
  },
  {
    title: 'طقم لحامة Febi Bilstein — Kit bras de suspension',
    description: 'طقم لحامة كامل يشمل البراس، السيلان، الرولمان الأمامي. من Febi Bilstein الألمانية.',
    price: 5500,
    category: 'Suspension & Steering',
    condition: 'new',
    authenticity: 'original',
    brand: 'Febi Bilstein',
    carModel: 'Renault Logan / Sandero / Duster — أمامي',
    reference: '42074',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Suspension_control_arm.jpg/640px-Suspension_control_arm.jpg',
    stock: 16
  },
  {
    title: 'شبكة التوجيه Meyle — Rotule direction',
    description: 'روتولة التوجيه من Meyle الألمانية. تحل مشكلة الاهتزاز وعدم الثبات في الطريق.',
    price: 2400,
    category: 'Suspension & Steering',
    condition: 'new',
    authenticity: 'original',
    brand: 'Meyle',
    carModel: 'Renault Clio 2 / Symbol / Thalia',
    reference: '16-16 020 0020',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Tie_rod_end.jpg/640px-Tie_rod_end.jpg',
    stock: 28
  },

  // ── BODY PARTS ──────────────────────────────────────────────────────────
  {
    title: 'مصباح الضباب Hella — Phare antibrouillard',
    description: 'مصباح ضباب دائري (Antibrouillard) عدسة ميتاليك من Hella. إضاءة قوية ومثالية للظروف الجوية الصعبة والضباب.',
    price: 3600,
    category: 'Body Parts',
    condition: 'new',
    authenticity: 'original',
    brand: 'Hella',
    carModel: 'عام — متوافق مع عدة سيارات',
    reference: 'HEL-1NL008090-821',
    image: '/uploads/media__1780186670784.jpg',
    stock: 25
  },
  {
    title: 'مرايا جانبية كهربائية — Rétroviseur électrique droit',
    description: 'مرايا جانبية يمنى كهربائية كاملة مع زجاج وغطاء. متوافقة 100٪ مع الأصل.',
    price: 4500,
    category: 'Body Parts',
    condition: 'new',
    authenticity: 'original',
    brand: 'Valeo',
    carModel: 'Peugeot 308 — يمين',
    reference: '045168',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Wing_mirror.jpg/640px-Wing_mirror.jpg',
    stock: 11
  },

  // ── TOOLS & FLUIDS ──────────────────────────────────────────────────────
  {
    title: 'زيت المحرك Total Quartz 9000 — 5W40 — 5L',
    description: 'زيت المحرك التخليقي بالكامل (Fully Synthetic) من توتال. لزوجة 5W40 سعة 5 لتر. حماية ممتازة للمحرك في درجات الحرارة العالية ومناسب للسيارات الحديثة.',
    price: 4900,
    category: 'Tools & Fluids',
    condition: 'new',
    authenticity: 'original',
    brand: 'Total',
    carModel: 'عام — السيارات الحديثة',
    reference: 'TQ9000-5W40-5L',
    image: '/uploads/media__1780186670779.jpg',
    stock: 200
  },
  {
    title: 'عصا الصواني Castrol GTX — 20W50 — 5L',
    description: 'زيت Castrol GTX 20W50 الكلاسيكي. مناسب للمحركات القديمة والطقس الحار. الأكثر مبيعاً في ولايات الجنوب.',
    price: 3200,
    category: 'Tools & Fluids',
    condition: 'new',
    authenticity: 'original',
    brand: 'Castrol',
    carModel: 'عام — المحركات القديمة',
    reference: 'CASTROL-GTX-20W50-5L',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Castrol_lubricants.jpg/640px-Castrol_lubricants.jpg',
    stock: 150
  }
];

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function seedProducts() {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas...');

    // 1. Find or create demo seller
    let seller = await User.findOne({ email: 'demo-seller@sayarati.com' });
    if (!seller) {
      const salt   = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash('seller123', salt);
      seller = new User({
        name:     'متجر سيارتي التجريبي',
        shopName: 'SAYARATI Demo Shop',
        email:    'demo-seller@sayarati.com',
        password: hashed,
        role:     'seller',
        status:   'active',
        wilaya:   'Alger'
      });
      await seller.save();
      console.log('✅ Demo seller created: demo-seller@sayarati.com / seller123');
    } else {
      console.log('ℹ️  Demo seller already exists, reusing it.');
    }

    // 2. Remove old seeded products from this seller (idempotent)
    const deleted = await Product.deleteMany({ seller: seller._id });
    console.log(`🗑️  Removed ${deleted.deletedCount} old seeded products.`);

    // 3. Insert all 25 parts
    const docs = PARTS.map(p => ({ ...p, seller: seller._id, status: 'active' }));
    const inserted = await Product.insertMany(docs);
    console.log(`\n🎉 SUCCESS! Inserted ${inserted.length} products.\n`);
    inserted.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}  →  ${p.price.toLocaleString()} DZD`));

    console.log('\n────────────────────────────────────────────────────────');
    console.log('Demo Seller Login:');
    console.log('  Email   : demo-seller@sayarati.com');
    console.log('  Password: seller123');
    console.log('────────────────────────────────────────────────────────\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedProducts();
} else {
  module.exports = { PARTS };
}
