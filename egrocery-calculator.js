// FMCG eGrocery Media Mix Calculator

let appState = {
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

let currentResults = null;
let charts = {};

// Utility functions
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatCurrency(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + ' млрд ₽';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' млн ₽';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + ' тыс ₽';
  }
  return formatNumber(Math.round(num)) + ' ₽';
}

function parseBudget(str) {
  return parseInt(str.replace(/\s/g, ''));
}

// Core calculation engine
function calculateResults() {
  const category = fmcgCategories[appState.fmcgCategory];
  
  // Get active platforms
  const activePlatforms = Object.keys(appState.platforms).filter(
    key => appState.platforms[key].selected
  );
  
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
  const platformResults = {};
  let totalPlatformBudget = 0;
  
  activePlatforms.forEach(key => {
    const budgetPercent = appState.platforms[key].budget;
    totalPlatformBudget += budgetPercent;
  });
  
  // Normalize if over 100%
  const normalizeFactor = totalPlatformBudget > 100 ? 100 / totalPlatformBudget : 1;
  
  let totalROAS = 0;
  let totalRevenue = 0;
  let totalCommission = 0;
  
  activePlatforms.forEach(key => {
    const platform = egroceryPlatforms[key];
    const budgetPercent = appState.platforms[key].budget * normalizeFactor;
    const budget = appState.budget * (budgetPercent / 100);
    
    // Calculate platform ROAS
    let baseROAS = (platform.baseROAS[0] + platform.baseROAS[1]) / 2;
    
    // Apply category modifier
    baseROAS *= category.roasModifier;
    
    // Apply positioning modifier
    const positioning = appState.positioning;
    if (positioningModifiers[positioning][key]) {
      baseROAS *= positioningModifiers[positioning][key];
    } else if (positioningModifiers[positioning].universal) {
      baseROAS *= positioningModifiers[positioning].universal;
    }
    
    // Express delivery bonus
    if (platform.deliveryType === 'express' && category.expressBonus) {
      baseROAS *= category.expressBonus;
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
      budget: budget,
      budgetPercent: budgetPercent,
      roas: finalROAS,
      revenue: revenue,
      commission: commission,
      netRevenue: revenue - commission,
      platform: platform
    };
    
    totalROAS += finalROAS * (budgetPercent / 100);
    totalRevenue += revenue;
    totalCommission += commission;
  });
  
  // Add external channels
  const externalResults = {};
  let externalBudget = 0;
  let externalRevenue = 0;
  
  Object.keys(appState.external).forEach(key => {
    if (appState.external[key]) {
      const channel = externalChannels[key];
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
        budget: budget,
        roas: effectiveROAS,
        revenue: revenue
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
    totalROAS: totalROAS,
    totalRevenue: totalRevenue,
    totalCommission: totalCommission,
    netProfit: netProfit,
    overallROI: overallROI,
    efficiencyScore: efficiencyScore,
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
function generateRecommendations(results) {
  const recommendations = [];
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
    const hasExpress = Object.keys(results.platforms).some(key => 
      results.platforms[key].platform.deliveryType === 'express'
    );
    if (!hasExpress) {
      recommendations.push(
        `Для <strong>${category.name}</strong> экспресс-доставка (Самокат, Лавка) даёт +25% ROAS. Добавьте эти площадки!`
      );
    } else {
      recommendations.push(
        `Отличный выбор! Экспресс-площадки оптимальны для ${category.name} (+${(category.expressBonus * 100 - 100).toFixed(0)}% эффективности)`
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
  const fastGrowingPlatforms = ['lavka', 'magnit', 'yeda', 'pyaterochka'];
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
