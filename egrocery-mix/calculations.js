// Calculation Engine

function formatNumber(num) {
  return num.toLocaleString('ru-RU');
}

function formatCurrency(num) {
  return formatNumber(Math.round(num)) + ' ₽';
}

function formatPercent(num) {
  return num.toFixed(1) + '%';
}

function calculateModifiers(state) {
  const osaModifier = state.osa / 100;
  const ratingModifier = 1 + (state.rating - 4.0) * 0.12;
  const reviewTrust = Math.min(1.0, Math.log10(state.reviewCount + 1) / 8);
  const priceModifier = Math.pow(state.priceIndex, -1.5);
  const promoLift = 1 + (state.promoDepth / 100 * 0.4) * (state.promoFreq / 30);
  
  return {
    osa: osaModifier,
    rating: ratingModifier,
    reviewTrust: reviewTrust,
    price: priceModifier,
    promo: promoLift
  };
}

function getPlatformROAS(platformId, state, modifiers) {
  const platform = EGROCERY_PLATFORMS[platformId];
  if (!platform) return 0;
  
  const category = FMCG_CATEGORIES[state.category];
  const baseROAS = (platform.base_roas_range[0] + platform.base_roas_range[1]) / 2;
  
  let roas = baseROAS;
  
  // Category modifier
  roas *= category.roas_modifier;
  
  // Optimal platform bonus
  if (category.optimal_platforms.includes(platformId)) {
    roas *= 1.15;
  }
  
  // Express bonus
  if (platform.delivery_type === 'express' && category.express_bonus) {
    roas *= category.express_bonus;
  }
  
  // Positioning modifiers
  const posModifiers = POSITIONING_MODIFIERS[state.positioning];
  if (posModifiers[platformId]) {
    roas *= posModifiers[platformId];
  } else if (posModifiers.universal) {
    roas *= posModifiers.universal;
  }
  
  // Operational modifiers
  roas *= modifiers.osa;
  roas *= modifiers.rating;
  roas *= (0.7 + 0.3 * modifiers.reviewTrust);
  roas *= modifiers.price;
  roas *= modifiers.promo;
  
  // Budget allocation diminishing returns
  const budgetShare = state.platformBudgets[platformId] || 0;
  const diminishingFactor = 1 - (budgetShare / 100) * 0.2;
  roas *= diminishingFactor;
  
  return Math.max(roas, 0.5);
}

function getExternalChannelROAS(channelId, state) {
  const channel = EXTERNAL_CHANNELS[channelId];
  if (!channel) return 0;
  
  const baseROAS = (channel.base_roas_range[0] + channel.base_roas_range[1]) / 2;
  let roas = baseROAS;
  
  // Synergy bonus
  if (channel.synergy) {
    Object.keys(channel.synergy).forEach(platformId => {
      if (state.selectedPlatforms.includes(platformId)) {
        roas *= (1 + channel.synergy[platformId]);
      }
    });
  }
  
  return roas;
}

function calculateChannelResults(state) {
  const modifiers = calculateModifiers(state);
  const results = [];
  
  // eGrocery platforms
  state.selectedPlatforms.forEach(platformId => {
    const platform = EGROCERY_PLATFORMS[platformId];
    const budgetShare = state.platformBudgets[platformId] || 0;
    const budget = state.budget * (budgetShare / 100);
    
    if (budget > 0) {
      const roas = getPlatformROAS(platformId, state, modifiers);
      const commission = (platform.commission_range[0] + platform.commission_range[1]) / 2;
      const revenue = budget * roas;
      const netRevenue = revenue * (1 - commission);
      const roi = ((netRevenue - budget) / budget) * 100;
      
      results.push({
        id: platformId,
        name: platform.name,
        type: 'egrocery',
        budget: budget,
        share: budgetShare,
        roas: roas,
        revenue: revenue,
        netRevenue: netRevenue,
        roi: roi,
        commission: commission,
        efficiency: calculateEfficiency(roi)
      });
    }
  });
  
  // External channels
  state.selectedChannels.forEach(channelId => {
    const channel = EXTERNAL_CHANNELS[channelId];
    const budgetShare = state.channelBudgets[channelId] || 0;
    const budget = state.budget * (budgetShare / 100);
    
    if (budget > 0) {
      const roas = getExternalChannelROAS(channelId, state);
      const revenue = budget * roas;
      const roi = ((revenue - budget) / budget) * 100;
      
      results.push({
        id: channelId,
        name: channel.name,
        type: channel.type,
        budget: budget,
        share: budgetShare,
        roas: roas,
        revenue: revenue,
        netRevenue: revenue,
        roi: roi,
        commission: 0,
        efficiency: calculateEfficiency(roi)
      });
    }
  });
  
  return results.sort((a, b) => b.revenue - a.revenue);
}

function calculateEfficiency(roi) {
  if (roi >= 300) return 'excellent';
  if (roi >= 150) return 'good';
  if (roi >= 50) return 'fair';
  return 'poor';
}

function calculateOverallMetrics(channelResults) {
  const totalBudget = channelResults.reduce((sum, ch) => sum + ch.budget, 0);
  const totalRevenue = channelResults.reduce((sum, ch) => sum + ch.revenue, 0);
  const totalNetRevenue = channelResults.reduce((sum, ch) => sum + ch.netRevenue, 0);
  const totalProfit = totalNetRevenue - totalBudget;
  const overallROI = totalBudget > 0 ? (totalProfit / totalBudget) * 100 : 0;
  const overallROAS = totalBudget > 0 ? totalRevenue / totalBudget : 0;
  
  const ecommerceRevenue = channelResults
    .filter(ch => ch.type === 'egrocery')
    .reduce((sum, ch) => sum + ch.revenue, 0);
  const ecommerceShare = totalRevenue > 0 ? (ecommerceRevenue / totalRevenue) * 100 : 0;
  
  // Efficiency index (0-100)
  const avgROI = overallROI;
  const efficiencyIndex = Math.min(100, Math.max(0, 50 + avgROI / 4));
  
  return {
    totalBudget,
    totalRevenue,
    totalNetRevenue,
    totalProfit,
    overallROI,
    overallROAS,
    ecommerceShare,
    efficiencyIndex
  };
}

function generateRecommendations(state, channelResults, metrics) {
  const recommendations = [];
  const modifiers = calculateModifiers(state);
  const category = FMCG_CATEGORIES[state.category];
  
  // Top performing platform
  if (channelResults.length > 0) {
    const topChannel = channelResults[0];
    recommendations.push({
      text: `${topChannel.name} показывает лучший результат с ROI ${formatPercent(topChannel.roi)}. Рекомендуется сохранить или увеличить долю бюджета на этой платформе.`
    });
  }
  
  // OSA optimization
  if (state.osa < 85) {
    const potentialGain = ((85 - state.osa) / 100) * metrics.totalRevenue;
    recommendations.push({
      text: `Повышение OSA с ${state.osa}% до 85% может увеличить выручку на ${formatCurrency(potentialGain)}. Работайте над улучшением доступности товара.`
    });
  }
  
  // Rating improvement
  if (state.rating < 4.5) {
    recommendations.push({
      text: `Текущий рейтинг ${state.rating} ниже оптимального. Повышение до 4.5+ может увеличить конверсию на 15-20%. Работайте с отзывами и качеством сервиса.`
    });
  }
  
  // Category-specific advice
  if (category.optimal_platforms) {
    const missingOptimalPlatforms = category.optimal_platforms.filter(
      pid => !state.selectedPlatforms.includes(pid)
    );
    if (missingOptimalPlatforms.length > 0) {
      const platformNames = missingOptimalPlatforms
        .map(pid => EGROCERY_PLATFORMS[pid]?.name)
        .filter(Boolean)
        .join(', ');
      recommendations.push({
        text: `Для категории "${category.name}" рекомендуется присутствие на платформах: ${platformNames}. Они показывают лучшие результаты для вашей категории.`
      });
    }
  }
  
  // Positioning recommendations
  if (state.positioning === 'premium') {
    recommendations.push({
      text: 'Для премиум-сегмента рекомендуется фокус на Яндекс.Маркет и Ozon, где аудитория готова платить больше за качество.'
    });
  } else if (state.positioning === 'economy') {
    recommendations.push({
      text: 'Для эконом-сегмента эффективны Wildberries и Самокат с их ценовой аудиторией.'
    });
  }
  
  // Budget concentration
  const maxShare = Math.max(...Object.values(state.platformBudgets));
  if (maxShare > 50) {
    recommendations.push({
      text: `Высокая концентрация бюджета (${formatPercent(maxShare)}) на одной платформе увеличивает риски. Рекомендуется диверсификация для снижения зависимости.`
    });
  }
  
  // Synergy opportunities
  if (state.selectedPlatforms.includes('yandex') && !state.selectedChannels.includes('external_direct')) {
    recommendations.push({
      text: 'Добавление Яндекс.Директ создаст синергию с Яндекс.Маркет и увеличит общий ROAS на 25-30%.'
    });
  }
  
  // Market context
  if (metrics.ecommerceShare > 70) {
    recommendations.push({
      text: 'Высокая доля e-grocery в медиамиксе. Рассмотрите добавление традиционных каналов для повышения узнаваемости бренда.'
    });
  }
  
  return recommendations;
}