// FMCG eGrocery Media Mix Calculator

import type { egroceryPlatforms, externalChannels, fmcgCategories } from "../constants/egrocery-data";

// Types from previous market data (assumed imported)
type FmcgCategoryKey = keyof typeof fmcgCategories;
type PlatformKey = keyof typeof egroceryPlatforms;
type Positioning = 'economy' | 'mid' | 'premium';
type ProductType = 'basic' | 'ultra_fresh' | 'ready_to_eat';
type GoalType = 'awareness' | 'performance' | 'brand';
type ExternalChannelKey = keyof typeof externalChannels;

// App State Interface
interface PlatformBudget {
  selected: boolean;
  budget: number;
}

interface AppState {
  // FMCG params
  fmcgCategory: FmcgCategoryKey;
  positioning: Positioning;
  productType: ProductType;
  brandRevenue: number;
  
  // Campaign
  budget: number;
  flightDuration: number;
  goals: Record<GoalType, boolean>;
  priorities: Record<GoalType, number>;
  
  // Operational
  osa: number;
  rating: number;
  reviewCount: number;
  priceIndex: number;
  promoDepth: number;
  promoFreq: number;
  
  // Platforms
  platforms: Record<PlatformKey, PlatformBudget>;
  
  // External
  external: Record<ExternalChannelKey, boolean>;
}

interface PlatformResult {
  name: string;
  budget: number;
  budgetPercent: number;
  roas: number;
  revenue: number;
  commission: number;
  netRevenue: number;
  platform: typeof egroceryPlatforms[PlatformKey];
}

interface ExternalResult {
  name: string;
  budget: number;
  roas: number;
  revenue: number;
}

interface CalculationModifiers {
  osa: number;
  rating: number;
  review: number;
  price: number;
  promo: number;
  total: number;
}

interface CalculationResults {
  platforms: Record<PlatformKey, PlatformResult>;
  external: Record<string, ExternalResult>;
  totalROAS: number;
  totalRevenue: number;
  totalCommission: number;
  netProfit: number;
  overallROI: number;
  efficiencyScore: number;
  modifiers: CalculationModifiers;
}

// State
let appState: AppState = {
  // FMCG params
  fmcgCategory: 'dairy',
  positioning: 'mid',
  productType: 'basic',
  brandRevenue: 500,
  
  // Campaign
  budget: 10000000,
  flightDuration: 3,
  goals: {
    awareness: true,
    performance: true,
    brand: false
  },
  priorities: {
    awareness: 40,
    performance: 50,
    brand: 10
  },
  
  // Operational
  osa: 85,
  rating: 4.2,
  reviewCount: 500,
  priceIndex: 1.0,
  promoDepth: 15,
  promoFreq: 10,
  
  // Platforms
  platforms: {
    ozon: { selected: true, budget: 20 },
    wb: { selected: true, budget: 25 },
    yandex: { selected: true, budget: 15 },
    samokat: { selected: false, budget: 0 },
    lavka: { selected: false, budget: 0 },
    kuper: { selected: false, budget: 0 },
    pyaterochka: { selected: false, budget: 0 },
    yeda: { selected: false, budget: 0 },
    lenta: { selected: false, budget: 0 },
    perekrestok: { selected: false, budget: 0 },
    magnit: { selected: false, budget: 0 }
  },
  
  // External
  external: {
    external_direct: false,
    external_vk: false,
    external_telegram: false,
    tv: false,
    outdoor: false,
    radio: false,
    content: false
  }
};

let currentResults: CalculationResults | null = null;
let charts: Record<string, any> = {};

// Utility functions
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatCurrency(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + ' млрд ₽';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' млн ₽';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + ' тыс ₽';
  }
  return formatNumber(Math.round(num)) + ' ₽';
}

function parseBudget(str: string): number {
  return parseInt(str.replace(/\s/g, ''));
}

// Core calculation engine
function calculateResults(): CalculationResults | null {
  const category = fmcgCategories[appState.fmcgCategory];
  
  // Get active platforms
  const activePlatforms: PlatformKey[] = Object.keys(appState.platforms)
    .filter((key): key is PlatformKey => appState.platforms[key as PlatformKey].selected) as PlatformKey[];
  
  if (activePlatforms.length === 0) {
    return null;
  }
  
  // Calculate modifiers
  const osaModifier = appState.osa / 100;
  const ratingModifier = 1 + (appState.rating - 4.0) * 0.12;
  const reviewTrust = Math.min(1.0, Math.log10(appState.reviewCount + 1) / 8);
  const priceElasticity = -1.5;
  const priceModifier = Math.pow(appState.priceIndex, priceElasticity);
  const promoLift = 1 + (appState.promoDepth / 100 * 0.4) * (appState.promoFreq / 30);
  
  const totalModifier = osaModifier * ratingModifier * reviewTrust * priceModifier * promoLift;
  
  // Calculate budget distribution
  const platformResults: Record<PlatformKey, PlatformResult> = {} as Record<PlatformKey, PlatformResult>;
  let totalPlatformBudget = 0;
  
  activePlatforms.forEach((key) => {
    const budgetPercent = appState.platforms[key].budget;
    totalPlatformBudget += budgetPercent;
  });
  
  // Normalize if over 100%
  const normalizeFactor = totalPlatformBudget > 100 ? 100 / totalPlatformBudget : 1;
  
  let totalROAS = 0;
  let totalRevenue = 0;
  let totalCommission = 0;
  
  activePlatforms.forEach((key) => {
    const platform = egroceryPlatforms[key];
    const budgetPercent = appState.platforms[key].budget * normalizeFactor;
    const budget = appState.budget * (budgetPercent / 100);
    
    // Calculate platform ROAS
    let baseROAS = (platform.baseROAS[0] + platform.baseROAS[1]) / 2;
    
    // Apply category modifier
    baseROAS *= category.roasModifier;
    
    // Apply positioning modifier
    const positioning = appState.positioning;
    if (positioningModifiers[positioning]?.[key]) {
      baseROAS *= positioningModifiers[positioning][key]!;
    } else if ('universal' in positioningModifiers[positioning]) {
      baseROAS *= positioningModifiers[positioning].universal;
    }
    
    // Express delivery bonus
    if (platform.deliveryType === 'express' && 'expressBonus' in category) {
      baseROAS *= (category as any).expressBonus;
    }
    
    // Product type bonus
    if (appState.productType === 'ultra_fresh' && platform.deliveryType === 'express') {
      baseROAS *= 1.25;
    } else if (appState.productType === 'ready_to_eat' && platform.deliveryType) {
      baseROAS *= 1.35;
    }
    
    // Apply total modifiers
    const effectiveROAS = baseROAS * totalModifier;
    
    // Diminishing returns
    const diminishingFactor = 1 - (budgetPercent / 100) * 0.2;
    const finalROAS = effectiveROAS * diminishingFactor;
    
    const revenue = budget * finalROAS;
    const commissionRate = (platform.commission[0] + platform.commission[1]) / 2;
    const commission = revenue * commissionRate;
    
    platformResults[key] = {
      name: platform.name,
      budget,
      budgetPercent,
      roas: finalROAS,
      revenue,
      commission,
      netRevenue: revenue - commission,
      platform
    };
    
    totalROAS += finalROAS * (budgetPercent / 100);
    totalRevenue += revenue;
    totalCommission += commission;
  });
  
  // Add external channels
  const externalResults: Record<string, ExternalResult> = {};
  let externalBudget = 0;
  let externalRevenue = 0;
  
  Object.entries(appState.external).forEach(([key, selected]) => {
    if (selected) {
      const channel = externalChannels[key as ExternalChannelKey];
      const budget = appState.budget * 0.10; // Allocate 10% to each external
      const baseROAS = (channel.baseROAS[0] + channel.baseROAS[1]) / 2;
      
      let effectiveROAS = baseROAS * totalModifier;
      
      // Synergy with platforms
      if (key === 'external_direct' && appState.platforms.yandex.selected) {
        effectiveROAS *= (1 + synergies.yandexEcosystem);
      }
      
      const revenue = budget * effectiveROAS;
      
      externalResults[key] = {
        name: channel.name,
        budget,
        roas: effectiveROAS,
        revenue
      };
      
      externalBudget += budget;
      externalRevenue += revenue;
    }
  });
  
  const totalBudgetUsed = appState.budget + externalBudget;
  const netProfit = totalRevenue + externalRevenue - totalBudgetUsed - totalCommission;
  const overallROI = ((totalRevenue + externalRevenue - totalBudgetUsed) / totalBudgetUsed) * 100;
  
  // Calculate efficiency score
  const efficiencyScore = Math.min(100, (
    (totalROAS / 5) * 40 +
    (appState.osa / 100) * 15 +
    (appState.rating / 5) * 15 +
    (activePlatforms.length >= 3 ? 20 : activePlatforms.length * 6.67) +
    10
  ));
  
  return {
    platforms: platformResults,
    external: externalResults,
    totalROAS,
    totalRevenue,
    totalCommission,
    netProfit,
    overallROI,
    efficiencyScore,
    modifiers: {
      osa: osaModifier,
      rating: ratingModifier,
      review: reviewTrust,
      price: priceModifier,
      promo: promoLift,
      total: totalModifier
    }
  };
}

// Generate recommendations
function generateRecommendations(results: CalculationResults): string[] {
  const recommendations: string[] = [];
  const category = fmcgCategories[appState.fmcgCategory];
  
  // Top platform
  const sortedPlatforms = Object.entries(results.platforms)
    .sort((a, b) => b[1].roas - a[1].roas);
  
  if (sortedPlatforms.length > 0) {
    const top = sortedPlatforms[0];
    recommendations.push(
      `<strong>Лучшая площадка:</strong> ${top[1].name} с ROAS ${top[1].roas.toFixed(2)}`
    );
  }
  
  // OSA recommendations
  if (appState.osa < 90) {
    const lostSales = (90 - appState.osa) * 0.07;
    const potentialGain = results.totalRevenue * (lostSales / (100 - lostSales));
    recommendations.push(
      `<strong>OSA ${appState.osa}%</strong> — теряете ~${(lostSales * 100).toFixed(1)}% продаж (${formatCurrency(potentialGain)}). Улучшите дистрибуцию!`
    );
  }
  
  // Rating recommendations
  if (appState.rating < 4.0) {
    const conversionLoss = (4.0 - appState.rating) * 12;
    recommendations.push(
      `<strong>Рейтинг ${appState.rating}</strong> — конверсия на ${conversionLoss.toFixed(0)}% ниже. Работайте с качеством и отзывами`
    );
  }
  
  // Category-specific
  if (category.type === 'ultra_fresh') {
    const hasExpress = Object.values(results.platforms).some(p => 
      p.platform.deliveryType === 'express'
    );
    if (!hasExpress) {
      recommendations.push(
        `Для <strong>${category.name}</strong> экспресс-доставка (Самокат, Лавка) даёт +25% ROAS. Добавьте эти площадки!`
      );
    } else {
      recommendations.push(
        `Отличный выбор! Экспресс-площадки оптимальны для ${category.name} (+${((category as any).expressBonus! * 100 - 100).toFixed(0)}% эффективности)`
      );
    }
  }
  
  // Positioning advice
  if (appState.positioning === 'economy') {
    if (results.platforms.wb && results.platforms.wb.budgetPercent > 30) {
      recommendations.push(
        `<strong>Эконом-сегмент:</strong> Wildberries — оптимальная площадка (+15% эффективности)`
      );
    }
  } else if (appState.positioning === 'premium') {
    if (results.platforms.yandex && results.platforms.yandex.budgetPercent > 20) {
      recommendations.push(
        `<strong>Премиум-сегмент:</strong> Яндекс.Маркет показывает +20% для премиальных брендов`
      );
    }
  }
  
  // Synergy recommendations
  if (appState.platforms.yandex.selected && appState.external.external_direct) {
    recommendations.push(
      `<strong>Синергия Яндекс:</strong> Маркет + Директ дают +30% эффективности — отличная комбинация!`
    );
  }
  
  // Growth platforms
  const fastGrowingPlatforms: PlatformKey[] = ['lavka', 'magnit', 'yeda', 'pyaterochka'];
  const hasFastGrowing = fastGrowingPlatforms.some(key => appState.platforms[key].selected);
  if (!hasFastGrowing) {
    recommendations.push(
      `Рассмотрите <strong>быстрорастущие площадки</strong>: Яндекс Лавка (+73%), Магнит (+117%), Яндекс Еда (+104%) для будущего роста`
    );
  }
  
  // eGrocery market context
  recommendations.push(
    `<strong>Контекст 2025:</strong> Рынок eGrocery 1.7 трлн ₽ (+33% г/г), доля онлайн в FMCG достигла 5.6% — исторический максимум`
  );
  
  return recommendations;
}
