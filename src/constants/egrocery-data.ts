// Russian eGrocery Market Data 2025
export interface EgroceryPlatform {
  name: string;
  annualSales: number;
  growth: number;
  avgCheck: number;
  categoryShare: number;
  targetAudience: number;
  awarenessFormats: number;
  performanceFormats: number;
  commission: [number, number];
  baseROAS: [number, number];
  position: string;
  ecosystemBonus?: number;
  deliveryType?: 'express' | 'food';
  expressBonus?: number;
}

export interface FmcgCategory {
  name: string;
  type: 'ultra_fresh' | 'basic' | 'ready_to_eat';
  optimalPlatforms: string[];
  roasModifier: number;
  expressBonus?: number;
  promoSensitivity?: 'high';
  impulsePurchase?: boolean;
  loyaltyFactor?: 'high';
  growthRate?: number;
}

export interface ExternalChannel {
  name: string;
  baseROAS: [number, number];
  type: 'external' | 'traditional';
  synergy?: Record<string, number>;
  awarenessWeight?: number;
}

export const egroceryPlatforms: Record<string, EgroceryPlatform> = {
  ozon: {
    name: 'Ozon',
    annualSales: 2523000,
    growth: 0.62,
    avgCheck: 1790,
    categoryShare: 7.83,
    targetAudience: 2413.96,
    awarenessFormats: 9,
    performanceFormats: 5,
    commission: [0.05, 0.25],
    baseROAS: [3.2, 4.5],
    position: 'leader'
  },
  wb: {
    name: 'Wildberries',
    annualSales: 3320000,
    growth: 0.55,
    avgCheck: 870,
    categoryShare: 24.4,
    targetAudience: 6358,
    awarenessFormats: 7,
    performanceFormats: 3,
    commission: [0.05, 0.20],
    baseROAS: [2.8, 4.2],
    position: 'leader'
  },
  yandex: {
    name: 'Яндекс.Маркет',
    annualSales: 535300,
    growth: 0.45,
    avgCheck: 4250,
    categoryShare: 6.62,
    targetAudience: 2687,
    awarenessFormats: 7,
    performanceFormats: 5,
    commission: [0.03, 0.15],
    baseROAS: [3.5, 4.8],
    ecosystemBonus: 0.25,
    position: 'top5'
  },
  samokat: {
    name: 'Самокат',
    annualSales: 244200,
    growth: 0.53,
    avgCheck: 960,
    categoryShare: 56.5,
    targetAudience: 2338,
    awarenessFormats: 10,
    performanceFormats: 11,
    commission: [0.10, 0.20],
    baseROAS: [3.8, 5.2],
    deliveryType: 'express',
    expressBonus: 0.25,
    position: 'top5'
  },
  lavka: {
    name: 'Яндекс Лавка',
    annualSales: 133700,
    growth: 0.73,
    avgCheck: 1260,
    categoryShare: 26.48,
    targetAudience: 812,
    awarenessFormats: 9,
    performanceFormats: 10,
    commission: [0.10, 0.20],
    baseROAS: [3.6, 5.0],
    deliveryType: 'express',
    expressBonus: 0.25,
    position: 'top5'
  },
  kuper: {
    name: 'Купер (СберМаркет)',
    annualSales: 173000,
    growth: 0.36,
    avgCheck: 2390,
    categoryShare: 44.4,
    targetAudience: 2736,
    awarenessFormats: 11,
    performanceFormats: 10,
    commission: [0.08, 0.18],
    baseROAS: [2.8, 3.8],
    position: 'major'
  },
  pyaterochka: {
    name: 'Пятёрочка доставка',
    annualSales: 84900,
    growth: 1.0,
    avgCheck: 1510,
    categoryShare: 44.1,
    targetAudience: 2252,
    awarenessFormats: 2,
    performanceFormats: 6,
    commission: [0.10, 0.20],
    baseROAS: [2.5, 3.8],
    position: 'growing'
  },
  yeda: {
    name: 'Яндекс Еда',
    annualSales: 69400,
    growth: 1.04,
    avgCheck: 2070,
    categoryShare: 20.7,
    targetAudience: 812,
    awarenessFormats: 18,
    performanceFormats: 21,
    commission: [0.15, 0.30],
    baseROAS: [3.2, 4.5],
    deliveryType: 'food',
    position: 'growing'
  },
  lenta: {
    name: 'Лента',
    annualSales: 42200,
    growth: 0.30,
    avgCheck: 3060,
    categoryShare: 33.79,
    targetAudience: 1340,
    awarenessFormats: 11,
    performanceFormats: 11,
    commission: [0.08, 0.18],
    baseROAS: [2.4, 3.5],
    position: 'mid'
  },
  perekrestok: {
    name: 'Перекрёсток',
    annualSales: 43200,
    growth: 0.53,
    avgCheck: 2160,
    categoryShare: 15.0,
    targetAudience: 782,
    awarenessFormats: 5,
    performanceFormats: 7,
    commission: [0.08, 0.18],
    baseROAS: [2.6, 3.6],
    position: 'mid'
  },
  magnit: {
    name: 'Магнит',
    annualSales: 33700,
    growth: 1.17,
    avgCheck: 1550,
    categoryShare: 7.70,
    targetAudience: 1584,
    awarenessFormats: 9,
    performanceFormats: 11,
    commission: [0.10, 0.20],
    baseROAS: [2.8, 4.0],
    position: 'fastgrowing'
  }
};

export const fmcgCategories: Record<string, FmcgCategory> = {
  dairy: {
    name: 'Молочная продукция',
    type: 'ultra_fresh',
    optimalPlatforms: ['samokat', 'lavka', 'pyaterochka'],
    roasModifier: 1.15,
    expressBonus: 1.25
  },
  meat: {
    name: 'Мясо и деликатесы',
    type: 'ultra_fresh',
    optimalPlatforms: ['samokat', 'ozon', 'perekrestok'],
    roasModifier: 1.10,
    expressBonus: 1.20
  },
  grocery: {
    name: 'Бакалея',
    type: 'basic',
    optimalPlatforms: ['wb', 'ozon', 'yandex'],
    roasModifier: 1.0,
    promoSensitivity: 'high'
  },
  beverages: {
    name: 'Напитки',
    type: 'basic',
    optimalPlatforms: ['wb', 'ozon', 'kuper'],
    roasModifier: 0.95,
    promoSensitivity: 'high'
  },
  confectionery: {
    name: 'Кондитерские изделия',
    type: 'basic',
    optimalPlatforms: ['wb', 'ozon', 'magnit'],
    roasModifier: 1.05,
    impulsePurchase: true
  },
  snacks: {
    name: 'Снеки и чипсы',
    type: 'basic',
    optimalPlatforms: ['samokat', 'lavka', 'wb'],
    roasModifier: 1.20,
    impulsePurchase: true,
    expressBonus: 1.30
  },
  baby: {
    name: 'Детское питание',
    type: 'basic',
    optimalPlatforms: ['wb', 'ozon', 'yandex'],
    roasModifier: 1.25,
    loyaltyFactor: 'high'
  },
  frozen: {
    name: 'Замороженные продукты',
    type: 'basic',
    optimalPlatforms: ['ozon', 'kuper', 'lenta'],
    roasModifier: 1.0
  },
  ready: {
    name: 'Готовая еда',
    type: 'ready_to_eat',
    optimalPlatforms: ['samokat', 'yeda', 'lavka'],
    roasModifier: 1.35,
    growthRate: 0.40,
    expressBonus: 1.40
  },
  fruits: {
    name: 'Фрукты и овощи',
    type: 'ultra_fresh',
    optimalPlatforms: ['samokat', 'lavka', 'ozon'],
    roasModifier: 1.10,
    expressBonus: 1.30
  }
};

export const externalChannels: Record<string, ExternalChannel> = {
  external_direct: {
    name: 'Яндекс.Директ',
    baseROAS: [3.0, 4.8],
    type: 'external',
    synergy: { yandex: 0.30 }
  },
  external_vk: {
    name: 'VK Реклама',
    baseROAS: [2.5, 3.8],
    type: 'external'
  },
  external_telegram: {
    name: 'Telegram Ads',
    baseROAS: [2.8, 4.2],
    type: 'external'
  },
  tv: {
    name: 'ТВ реклама',
    baseROAS: [1.5, 2.5],
    type: 'traditional',
    awarenessWeight: 0.8
  },
  outdoor: {
    name: 'Outdoor',
    baseROAS: [1.2, 2.0],
    type: 'traditional',
    awarenessWeight: 0.7
  },
  radio: {
    name: 'Радио',
    baseROAS: [1.3, 2.2],
    type: 'traditional',
    awarenessWeight: 0.6
  },
  content: {
    name: 'Контент-маркетинг',
    baseROAS: [2.0, 3.5],
    type: 'traditional',
    awarenessWeight: 0.5
  }
};

interface MarketData2025 {
  totalMarket: number; // млн руб
  growth: number;
  totalOrders: number; // млн заказов
  avgCheck: number;
  onlineShare: number;
  expressShare: number;
  expressGrowth: number;
}

export const marketData2025: MarketData2025 = {
  totalMarket: 1700000,
  growth: 0.33,
  totalOrders: 1100,
  avgCheck: 1480,
  onlineShare: 5.6,
  expressShare: 0.67,
  expressGrowth: 0.40
};

interface PositioningModifiers {
  [segment: string]: Partial<Record<string, number>> | { universal: number };
}

export const positioningModifiers: PositioningModifiers = {
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

interface Synergies {
  yandexEcosystem: number;
  externalToMarketplace: number;
  tvEgrocery: number;
  contentPlatforms: number;
}

export const synergies: Synergies = {
  yandexEcosystem: 0.25,
  externalToMarketplace: 0.20,
  tvEgrocery: 0.15,
  contentPlatforms: 0.18
};
