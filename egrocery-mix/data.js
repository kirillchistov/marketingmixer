// Market Data Constants
const EGROCERY_PLATFORMS = {
  ozon: {
    id: 'ozon',
    name: 'Ozon',
    annual_sales: 2523000,
    growth: 0.62,
    avg_check: 1790,
    category_share: 7.83,
    commission_range: [0.05, 0.25],
    base_roas_range: [3.2, 4.5],
    position: 'leader'
  },
  wb: {
    id: 'wb',
    name: 'Wildberries',
    annual_sales: 3320000,
    growth: 0.55,
    avg_check: 870,
    category_share: 24.4,
    commission_range: [0.05, 0.20],
    base_roas_range: [2.8, 4.2],
    position: 'leader'
  },
  yandex: {
    id: 'yandex',
    name: 'Яндекс.Маркет',
    annual_sales: 535300,
    growth: 0.45,
    avg_check: 4250,
    category_share: 6.62,
    commission_range: [0.03, 0.15],
    base_roas_range: [3.5, 4.8],
    ecosystem_bonus: 0.25,
    position: 'top5'
  },
  samokat: {
    id: 'samokat',
    name: 'Самокат',
    annual_sales: 244200,
    growth: 0.53,
    avg_check: 960,
    category_share: 56.5,
    commission_range: [0.10, 0.20],
    base_roas_range: [3.8, 5.2],
    delivery_type: 'express',
    express_bonus: 0.25,
    position: 'top5'
  },
  lavka: {
    id: 'lavka',
    name: 'Яндекс Лавка',
    annual_sales: 133700,
    growth: 0.73,
    avg_check: 1260,
    category_share: 26.48,
    commission_range: [0.10, 0.20],
    base_roas_range: [3.6, 5.0],
    delivery_type: 'express',
    express_bonus: 0.25,
    position: 'top5'
  },
  kuper: {
    id: 'kuper',
    name: 'Купер (СберМаркет)',
    annual_sales: 173000,
    growth: 0.36,
    avg_check: 2390,
    commission_range: [0.08, 0.18],
    base_roas_range: [2.8, 3.8],
    position: 'major'
  },
  pyaterochka: {
    id: 'pyaterochka',
    name: 'Пятёрочка доставка',
    annual_sales: 84900,
    growth: 1.0,
    avg_check: 1510,
    commission_range: [0.10, 0.20],
    base_roas_range: [2.5, 3.8],
    position: 'growing'
  },
  yeda: {
    id: 'yeda',
    name: 'Яндекс Еда',
    annual_sales: 69400,
    growth: 1.04,
    avg_check: 2070,
    commission_range: [0.15, 0.30],
    base_roas_range: [3.2, 4.5],
    delivery_type: 'food',
    position: 'growing'
  },
  lenta: {
    id: 'lenta',
    name: 'Лента',
    annual_sales: 42200,
    growth: 0.30,
    avg_check: 3060,
    commission_range: [0.08, 0.18],
    base_roas_range: [2.4, 3.5],
    position: 'mid'
  },
  perekrestok: {
    id: 'perekrestok',
    name: 'Перекрёсток',
    annual_sales: 43200,
    growth: 0.53,
    avg_check: 2160,
    commission_range: [0.08, 0.18],
    base_roas_range: [2.6, 3.6],
    position: 'mid'
  },
  magnit: {
    id: 'magnit',
    name: 'Магнит',
    annual_sales: 33700,
    growth: 1.17,
    avg_check: 1550,
    commission_range: [0.10, 0.20],
    base_roas_range: [2.8, 4.0],
    position: 'fastgrowing'
  }
};

const FMCG_CATEGORIES = {
  dairy: {
    id: 'dairy',
    name: 'Молочная продукция',
    type: 'ultra_fresh',
    optimal_platforms: ['samokat', 'lavka', 'pyaterochka'],
    roas_modifier: 1.15,
    express_bonus: 1.25
  },
  meat: {
    id: 'meat',
    name: 'Мясо и деликатесы',
    type: 'ultra_fresh',
    optimal_platforms: ['samokat', 'ozon', 'perekrestok'],
    roas_modifier: 1.10,
    express_bonus: 1.20
  },
  grocery: {
    id: 'grocery',
    name: 'Бакалея',
    type: 'basic',
    optimal_platforms: ['wb', 'ozon', 'yandex'],
    roas_modifier: 1.0,
    promo_sensitivity: 'high'
  },
  beverages: {
    id: 'beverages',
    name: 'Напитки',
    type: 'basic',
    optimal_platforms: ['wb', 'ozon', 'kuper'],
    roas_modifier: 0.95,
    promo_sensitivity: 'high'
  },
  confectionery: {
    id: 'confectionery',
    name: 'Кондитерские изделия',
    type: 'basic',
    optimal_platforms: ['wb', 'ozon', 'magnit'],
    roas_modifier: 1.05,
    impulse_purchase: true
  },
  snacks: {
    id: 'snacks',
    name: 'Снеки и чипсы',
    type: 'basic',
    optimal_platforms: ['samokat', 'lavka', 'wb'],
    roas_modifier: 1.20,
    impulse_purchase: true,
    express_bonus: 1.30
  },
  baby: {
    id: 'baby',
    name: 'Детское питание',
    type: 'basic',
    optimal_platforms: ['wb', 'ozon', 'yandex'],
    roas_modifier: 1.25,
    loyalty_factor: 'high'
  },
  frozen: {
    id: 'frozen',
    name: 'Замороженные продукты',
    type: 'basic',
    optimal_platforms: ['ozon', 'kuper', 'lenta'],
    roas_modifier: 1.0
  },
  ready: {
    id: 'ready',
    name: 'Готовая еда',
    type: 'ready_to_eat',
    optimal_platforms: ['samokat', 'yeda', 'lavka'],
    roas_modifier: 1.35,
    growth_rate: 0.40,
    express_bonus: 1.40
  },
  fruits: {
    id: 'fruits',
    name: 'Фрукты и овощи',
    type: 'ultra_fresh',
    optimal_platforms: ['samokat', 'lavka', 'ozon'],
    roas_modifier: 1.10,
    express_bonus: 1.30
  }
};

const EXTERNAL_CHANNELS = {
  external_direct: {
    id: 'external_direct',
    name: 'Яндекс.Директ',
    base_roas_range: [3.0, 4.8],
    type: 'external',
    synergy: { yandex: 0.30 }
  },
  external_vk: {
    id: 'external_vk',
    name: 'VK Реклама',
    base_roas_range: [2.5, 3.8],
    type: 'external'
  },
  external_telegram: {
    id: 'external_telegram',
    name: 'Telegram Ads',
    base_roas_range: [2.8, 4.2],
    type: 'external'
  },
  tv: {
    id: 'tv',
    name: 'ТВ реклама',
    base_roas_range: [1.5, 2.5],
    type: 'traditional',
    awareness_weight: 0.8
  },
  outdoor: {
    id: 'outdoor',
    name: 'Outdoor',
    base_roas_range: [1.2, 2.0],
    type: 'traditional',
    awareness_weight: 0.7
  },
  radio: {
    id: 'radio',
    name: 'Радио',
    base_roas_range: [1.3, 2.2],
    type: 'traditional',
    awareness_weight: 0.6
  },
  content: {
    id: 'content',
    name: 'Контент-маркетинг',
    base_roas_range: [2.0, 3.5],
    type: 'traditional',
    awareness_weight: 0.5
  }
};

const POSITIONING_MODIFIERS = {
  economy: {
    wb: 1.15,
    samokat: 1.12,
    magnit: 1.15,
    yandex: 0.85,
    ozon: 0.90
  },
  mid: {
    universal: 1.0
  },
  premium: {
    yandex: 1.20,
    ozon: 1.15,
    wb: 0.90,
    samokat: 0.85
  }
};

const MARKET_CONTEXT = {
  total_market_2025: 1700000,
  growth_2025: 0.33,
  total_orders: 1100,
  avg_check: 1480,
  online_share: 5.6,
  express_share: 0.67,
  express_growth: 0.40
};