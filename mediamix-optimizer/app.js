// Data
const categories = [
  {
    name: "FMCG (Товары повседневного спроса)",
    channels: {
      tv: { base_roi: 2.8, optimal_share: 35 },
      bvod: { base_roi: 2.5, optimal_share: 10 },
      radio: { base_roi: 1.9, optimal_share: 12 },
      ooh: { base_roi: 1.5, optimal_share: 8 },
      digital: { base_roi: 3.2, optimal_share: 20 },
      contextual: { base_roi: 3.5, optimal_share: 8 },
      social: { base_roi: 2.4, optimal_share: 5 },
      email: { base_roi: 4.0, optimal_share: 2 }
    }
  },
  {
    name: "Ритейл (Розничная торговля)",
    channels: {
      tv: { base_roi: 2.2, optimal_share: 25 },
      bvod: { base_roi: 2.8, optimal_share: 12 },
      radio: { base_roi: 1.7, optimal_share: 10 },
      ooh: { base_roi: 2.0, optimal_share: 15 },
      digital: { base_roi: 3.8, optimal_share: 22 },
      contextual: { base_roi: 4.2, optimal_share: 10 },
      social: { base_roi: 3.0, optimal_share: 4 },
      email: { base_roi: 3.5, optimal_share: 2 }
    }
  },
  {
    name: "Финансы",
    channels: {
      tv: { base_roi: 1.8, optimal_share: 20 },
      bvod: { base_roi: 2.3, optimal_share: 15 },
      radio: { base_roi: 1.5, optimal_share: 8 },
      ooh: { base_roi: 1.3, optimal_share: 7 },
      digital: { base_roi: 4.5, optimal_share: 30 },
      contextual: { base_roi: 5.0, optimal_share: 12 },
      social: { base_roi: 2.8, optimal_share: 6 },
      email: { base_roi: 4.5, optimal_share: 2 }
    }
  },
  {
    name: "Технологии",
    channels: {
      tv: { base_roi: 1.5, optimal_share: 15 },
      bvod: { base_roi: 2.5, optimal_share: 18 },
      radio: { base_roi: 1.2, optimal_share: 5 },
      ooh: { base_roi: 1.3, optimal_share: 5 },
      digital: { base_roi: 4.5, optimal_share: 32 },
      contextual: { base_roi: 5.5, optimal_share: 15 },
      social: { base_roi: 3.8, optimal_share: 8 },
      email: { base_roi: 4.2, optimal_share: 2 }
    }
  },
  {
    name: "Путешествия",
    channels: {
      tv: { base_roi: 2.0, optimal_share: 22 },
      bvod: { base_roi: 2.6, optimal_share: 14 },
      radio: { base_roi: 1.6, optimal_share: 9 },
      ooh: { base_roi: 1.8, optimal_share: 12 },
      digital: { base_roi: 4.0, optimal_share: 25 },
      contextual: { base_roi: 4.8, optimal_share: 12 },
      social: { base_roi: 3.2, optimal_share: 5 },
      email: { base_roi: 3.8, optimal_share: 1 }
    }
  },
  {
    name: "Автомобили",
    channels: {
      tv: { base_roi: 2.5, optimal_share: 32 },
      bvod: { base_roi: 2.4, optimal_share: 13 },
      radio: { base_roi: 1.8, optimal_share: 11 },
      ooh: { base_roi: 1.9, optimal_share: 14 },
      digital: { base_roi: 3.5, optimal_share: 18 },
      contextual: { base_roi: 4.0, optimal_share: 8 },
      social: { base_roi: 2.6, optimal_share: 3 },
      email: { base_roi: 3.2, optimal_share: 1 }
    }
  },
  {
    name: "Недвижимость",
    channels: {
      tv: { base_roi: 1.6, optimal_share: 18 },
      bvod: { base_roi: 2.1, optimal_share: 12 },
      radio: { base_roi: 1.4, optimal_share: 7 },
      ooh: { base_roi: 2.2, optimal_share: 16 },
      digital: { base_roi: 4.2, optimal_share: 28 },
      contextual: { base_roi: 4.8, optimal_share: 13 },
      social: { base_roi: 3.0, optimal_share: 5 },
      email: { base_roi: 3.5, optimal_share: 1 }
    }
  }
];

const channelNames = {
  tv: "ТВ (линейное)",
  bvod: "BVOD (онлайн-ТВ)",
  radio: "Радио",
  ooh: "Наружная реклама",
  digital: "Digital-реклама",
  contextual: "Контекстная реклама",
  social: "Социальные сети",
  email: "Email-маркетинг"
};

const riskLevels = [
  { name: "Низкий", variance_multiplier: 0.85, diversification: 0.95 },
  { name: "Средний", variance_multiplier: 1.0, diversification: 1.0 },
  { name: "Высокий", variance_multiplier: 1.15, diversification: 1.05 },
  { name: "Очень высокий", variance_multiplier: 1.3, diversification: 1.1 }
];

const timeHorizons = [
  { name: "Краткосрочная (1-3 месяца)", multiplier: 0.8, digital_boost: 1.2 },
  { name: "Среднесрочная (до 1 года)", multiplier: 1.0, digital_boost: 1.0 },
  { name: "Долгосрочная (2+ года)", multiplier: 1.4, digital_boost: 0.9 }
];

// State
let currentState = {
  category: 0,
  brandSize: 10000,
  onlineShare: 30,
  audienceType: 'mass',
  budget: 50000000,
  riskLevel: 1,
  timeHorizon: 1,
  // Distribution
  osa: 90,
  isa: 95,
  numDist: 75,
  weightedDist: 80,
  // Pricing
  priceIndex: 1.0,
  promoDepth: 15,
  promoFreq: 10,
  promoBudget: 5000000,
  // Reputation
  rating: 4.2,
  reviewCount: 1500,
  negativeRate: 8,
  // Channels (active)
  channels: {
    wb: true,
    wb_auto: true,
    wb_search: true,
    wb_card: false,
    wb_banners: false,
    ozon: true,
    ozon_search: true,
    ozon_templates: false,
    ozon_loyalty: false,
    yandex: false,
    yandex_boost: false,
    yandex_shelves: false,
    external_direct: false,
    external_vk: false,
    external_telegram: false,
    own_site: false,
    tv: false,
    bvod: false,
    radio: false,
    ooh: false
  }
};

let currentResults = null;
let charts = {};

// Utility Functions
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatCurrency(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + ' млрд ₽';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' млн ₽';
  }
  return formatNumber(Math.round(num)) + ' ₽';
}

function parseBudget(str) {
  return parseInt(str.replace(/\s/g, ''));
}

// Extended channel data with e-commerce
const extendedChannelData = {
  wb_auto: { name: "WB: Автокампании", roi: [2.8, 3.5], commission: 0.12, type: 'marketplace' },
  wb_search: { name: "WB: Поиск", roi: [3.2, 4.0], commission: 0.12, type: 'marketplace' },
  wb_card: { name: "WB: Карточка товара", roi: [3.5, 4.2], commission: 0.12, type: 'marketplace' },
  wb_banners: { name: "WB: Баннеры", roi: [2.2, 2.8], commission: 0.12, type: 'marketplace' },
  ozon_search: { name: "Ozon: Поиск (CPS)", roi: [3.5, 4.5], commission: 0.15, type: 'marketplace' },
  ozon_templates: { name: "Ozon: Трафареты", roi: [2.8, 3.4], commission: 0.15, type: 'marketplace' },
  ozon_loyalty: { name: "Ozon: Баллы", roi: [2.2, 2.8], commission: 0.15, type: 'marketplace' },
  yandex_boost: { name: "ЯМ: Буст продаж", roi: [3.8, 4.6], commission: 0.08, type: 'marketplace' },
  yandex_shelves: { name: "ЯМ: Полки", roi: [2.5, 3.2], commission: 0.08, type: 'marketplace' },
  external_direct: { name: "Яндекс.Директ → MP", roi: [3.0, 4.5], commission: 0, type: 'external' },
  external_vk: { name: "VK Реклама → MP", roi: [2.5, 3.5], commission: 0, type: 'external' },
  external_telegram: { name: "Telegram Ads → MP", roi: [2.8, 4.0], commission: 0, type: 'external' },
  own_site: { name: "Свой сайт", roi: [2.0, 3.5], commission: 0, type: 'own' },
  tv: { name: "ТВ", roi: [2.2, 2.8], commission: 0, type: 'traditional' },
  bvod: { name: "BVOD", roi: [2.4, 2.9], commission: 0, type: 'traditional' },
  radio: { name: "Радио", roi: [1.6, 2.1], commission: 0, type: 'traditional' },
  ooh: { name: "OOH", roi: [1.4, 2.0], commission: 0, type: 'traditional' }
};

// Calculation Engine
function calculateOptimalMix() {
  const category = categories[currentState.category];
  const risk = riskLevels[currentState.riskLevel];
  const timeHorizon = timeHorizons[currentState.timeHorizon];
  
  // Calculate distribution impact
  const osaFactor = currentState.osa / 100;
  const isaFactor = currentState.isa / 100;
  const numDistFactor = currentState.numDist / 100;
  const weightedDistFactor = currentState.weightedDist / 100;
  const distributionMultiplier = osaFactor * isaFactor * (numDistFactor * 0.6 + weightedDistFactor * 0.4) * 1.2;
  
  // Calculate price impact
  const categoryElasticity = [-1.8, -1.5, -0.9, -1.1, -1.4, -0.7, -0.5][currentState.category];
  const audienceModifier = currentState.audienceType === 'mass' ? 1.2 : 0.8;
  const elasticity = categoryElasticity * audienceModifier;
  const priceMultiplier = Math.pow(currentState.priceIndex, elasticity);
  const promoLift = 1 + (currentState.promoDepth / 100 * 0.5) * (currentState.promoFreq / 30);
  const priceEffectMultiplier = priceMultiplier * promoLift;
  
  // Calculate reputation impact
  const ratingBoost = 1 + (currentState.rating - 3.0) * 0.15;
  const reviewTrust = Math.min(1.0, Math.log10(currentState.reviewCount + 1) / 3);
  const negativePenalty = Math.max(0.7, 1 - (currentState.negativeRate / 100) * 1.5);
  const reputationMultiplier = ratingBoost * reviewTrust * negativePenalty;
  
  // Get active channels
  const activeChannels = Object.keys(currentState.channels).filter(key => currentState.channels[key]);
  
  if (activeChannels.length === 0) {
    return null; // No channels selected
  }
  
  // Calculate adjusted ROIs for active channels
  const channelData = {};
  
  activeChannels.forEach(channelKey => {
    const channelInfo = extendedChannelData[channelKey];
    if (!channelInfo) return;
    
    // Base ROI (take average of range)
    let baseROI = (channelInfo.roi[0] + channelInfo.roi[1]) / 2;
    
    // Brand size modifier
    const brandSizeNormalized = (currentState.brandSize - 100) / 49900;
    if (channelInfo.type === 'traditional') {
      baseROI *= (1 + brandSizeNormalized * 0.2);
    } else if (channelInfo.type === 'marketplace' || channelInfo.type === 'external') {
      baseROI *= (1 + (1 - brandSizeNormalized) * 0.15);
    }
    
    // Online share modifier (e-commerce channels benefit)
    if (channelInfo.type === 'marketplace' || channelInfo.type === 'external' || channelInfo.type === 'own') {
      baseROI *= (1 + currentState.onlineShare / 100 * 0.3);
    }
    
    // Audience type modifier
    if (currentState.audienceType === 'niche') {
      if (channelInfo.type !== 'traditional') {
        baseROI *= 1.2;
      } else {
        baseROI *= 0.85;
      }
    }
    
    // Time horizon modifier
    if (channelInfo.type !== 'traditional') {
      baseROI *= timeHorizon.digital_boost;
    }
    
    // Risk modifier
    baseROI *= risk.variance_multiplier;
    
    // Apply all factor multipliers
    baseROI *= distributionMultiplier;
    baseROI *= priceEffectMultiplier;
    baseROI *= reputationMultiplier;
    
    channelData[channelKey] = {
      name: channelInfo.name,
      baseROI: baseROI,
      commission: channelInfo.commission,
      type: channelInfo.type,
      optimalShare: 100 / activeChannels.length // Start equal
    };
  });
  
  // Optimize shares based on ROI and risk
  let totalShare = 0;
  const avgROI = Object.values(channelData).reduce((sum, ch) => sum + ch.baseROI, 0) / activeChannels.length;
  
  Object.keys(channelData).forEach(key => {
    let share = channelData[key].optimalShare;
    
    // Adjust based on ROI performance
    const roiRatio = channelData[key].baseROI / avgROI;
    share *= Math.pow(roiRatio, 0.5); // Square root for smoother distribution
    
    // Risk-based adjustment
    if (currentState.riskLevel === 0) {
      // Low risk - more equal distribution
      share = share * 0.8 + (100 / activeChannels.length) * 0.2;
    } else if (currentState.riskLevel >= 2) {
      // High risk - concentrate on top performers
      if (channelData[key].baseROI > avgROI) {
        share *= 1.3;
      } else {
        share *= 0.6;
      }
    }
    
    channelData[key].share = share;
    totalShare += share;
  });
  
  // Normalize shares to 100%
  Object.keys(channelData).forEach(key => {
    channelData[key].share = (channelData[key].share / totalShare) * 100;
    channelData[key].budget = currentState.budget * (channelData[key].share / 100);
  });
  
  // Calculate diminishing returns ROI
  Object.keys(channelData).forEach(key => {
    const share = channelData[key].share;
    const diminishingFactor = 1 - (share / 100) * 0.3;
    channelData[key].effectiveROI = channelData[key].baseROI * diminishingFactor;
  });
  
  // Calculate synergy bonuses
  let synergyBonus = 1.0;
  const hasMarketplace = activeChannels.some(ch => extendedChannelData[ch]?.type === 'marketplace');
  const hasExternal = activeChannels.some(ch => extendedChannelData[ch]?.type === 'external');
  const hasTraditional = activeChannels.some(ch => extendedChannelData[ch]?.type === 'traditional');
  const hasYandexMarket = currentState.channels.yandex;
  const hasYandexDirect = currentState.channels.external_direct;
  
  if (hasMarketplace && hasExternal) {
    synergyBonus *= 1.25; // +25% for marketplace + external traffic
  }
  if (hasMarketplace && hasTraditional) {
    synergyBonus *= 1.20; // +20% for marketplace + traditional
  }
  if (hasYandexMarket && hasYandexDirect) {
    synergyBonus *= 1.30; // +30% for Yandex ecosystem
  }
  if (currentState.channels.own_site && hasMarketplace) {
    synergyBonus *= 1.30; // +30% for own site + marketplace
  }
  
  // Calculate overall metrics
  let totalROI = 0;
  let totalSales = 0;
  let totalCommissions = 0;
  let ecommerceBudget = 0;
  
  Object.keys(channelData).forEach(key => {
    const share = channelData[key].share;
    const diminishingFactor = 1 - (share / 100) * 0.25;
    const roi = channelData[key].baseROI * diminishingFactor * synergyBonus;
    const budget = currentState.budget * (share / 100);
    const sales = budget * roi;
    const commission = sales * channelData[key].commission;
    
    channelData[key].effectiveROI = roi;
    channelData[key].budget = budget;
    channelData[key].sales = sales;
    channelData[key].commission = commission;
    channelData[key].finalROI = roi;
    
    totalROI += roi * (share / 100);
    totalSales += sales;
    totalCommissions += commission;
    
    if (channelData[key].type === 'marketplace' || channelData[key].type === 'external' || channelData[key].type === 'own') {
      ecommerceBudget += budget;
    }
  });
  
  totalROI *= timeHorizon.multiplier;
  totalSales *= timeHorizon.multiplier;
  const netProfit = totalSales - currentState.budget - totalCommissions - currentState.promoBudget;
  const efficiency = (netProfit / currentState.budget) * 100;
  const ecomShare = (ecommerceBudget / currentState.budget) * 100;
  
  return {
    channels: channelData,
    totalROI: totalROI,
    totalSales: totalSales,
    netProfit: netProfit,
    efficiency: efficiency,
    synergyBonus: synergyBonus,
    totalCommissions: totalCommissions,
    ecomShare: ecomShare,
    distributionMultiplier: distributionMultiplier,
    priceEffectMultiplier: priceEffectMultiplier,
    reputationMultiplier: reputationMultiplier
  };
}

function generateRecommendations(results) {
  const recommendations = [];
  const channels = results.channels;
  
  // Find top performers
  const sortedChannels = Object.entries(channels).sort((a, b) => b[1].finalROI - a[1].finalROI);
  const topChannel = sortedChannels[0];
  
  recommendations.push(`Наиболее эффективный канал: <strong>${topChannel[1].name}</strong> с ROI ${topChannel[1].finalROI.toFixed(2)}`);
  
  // Distribution recommendations
  if (currentState.osa < 90) {
    const lostSales = (90 - currentState.osa) * 0.7;
    recommendations.push(`Ваш OSA ${currentState.osa}% - это теряет ~${lostSales.toFixed(1)}% продаж. Инвестиции в улучшение дистрибуции окупятся в 2-3х`);
  }
  
  if (currentState.isa < 95) {
    recommendations.push(`ISA ${currentState.isa}% - необходимо улучшить наличие на складах для снижения потерь`);
  }
  
  // Rating recommendations
  if (currentState.rating < 4.0) {
    const conversionLoss = (4.0 - currentState.rating) * 15;
    recommendations.push(`При рейтинге ${currentState.rating} конверсия на ${conversionLoss.toFixed(0)}% ниже. Работайте с негативными отзывами`);
  }
  
  if (currentState.negativeRate > 15) {
    recommendations.push(`Доля негатива ${currentState.negativeRate}% - критичная зона! Срочно улучшайте качество продукта/сервиса`);
  }
  
  // Price recommendations
  if (currentState.priceIndex > 1.2 && currentState.promoFreq > 15) {
    recommendations.push(`Ценовой индекс ${currentState.priceIndex} (премиум) + высокая частота промо = неконсистентное позиционирование`);
  }
  
  // Marketplace recommendations
  const wbChannels = Object.keys(channels).filter(k => k.startsWith('wb_'));
  if (wbChannels.length > 0) {
    const wbShare = wbChannels.reduce((sum, k) => sum + channels[k].share, 0);
    if (wbShare > 60) {
      recommendations.push(`Wildberries занимает ${wbShare.toFixed(0)}% e-commerce бюджета - диверсифицируйте риски через Ozon и ЯМ`);
    }
  }
  
  // Synergy recommendations
  if (currentState.channels.yandex && currentState.channels.external_direct) {
    recommendations.push('Отличная синергия: Яндекс.Маркет + Директ дают +30% эффективности');
  }
  
  // Category-specific
  if (currentState.category === 0 && currentState.channels.tv && currentState.channels.wb) {
    recommendations.push('Ваша категория FMCG - ТВ + WB дают наилучший охват массовой аудитории');
  }
  
  if (currentState.channels.own_site) {
    recommendations.push('Свой сайт - отличное решение для LTV (+63%) и повторных покупок (+54%)');
  }
  
  return recommendations;
}

// UI Update Functions
function updateResults() {
  currentResults = calculateOptimalMix();
  
  if (!currentResults) {
    alert('Пожалуйста, выберите хотя бы один канал в блоке E-commerce микс');
    return;
  }
  
  // Show results area
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('results').style.display = 'block';
  
  // Update metrics
  document.getElementById('roiValue').textContent = (currentResults.totalROI * 100).toFixed(1) + '%';
  document.getElementById('salesValue').textContent = formatCurrency(currentResults.totalSales);
  document.getElementById('profitValue').textContent = formatCurrency(currentResults.netProfit);
  document.getElementById('ecomShareValue').textContent = currentResults.ecomShare.toFixed(1) + '%';
  document.getElementById('efficiencyValue').textContent = currentResults.efficiency.toFixed(0);
  
  // Update distribution gauges
  updateDistributionGauges();
  
  // Update reputation display
  updateReputationDisplay();
  
  // Update charts
  updateCharts();
  
  // Update table
  updateTable();
  
  // Update recommendations
  updateRecommendations();
}

function updateDistributionGauges() {
  document.getElementById('gaugeOSA').textContent = currentState.osa + '%';
  document.getElementById('gaugeISA').textContent = currentState.isa + '%';
  document.getElementById('gaugeNumDist').textContent = currentState.numDist + '%';
  document.getElementById('gaugeWeightedDist').textContent = currentState.weightedDist + '%';
  
  // Status colors
  const osaStatus = document.getElementById('statusOSA');
  if (currentState.osa >= 95) {
    osaStatus.textContent = 'Отлично';
    osaStatus.className = 'gauge-status excellent';
  } else if (currentState.osa >= 85) {
    osaStatus.textContent = 'Хорошо';
    osaStatus.className = 'gauge-status good';
  } else {
    osaStatus.textContent = 'Требует улучшения';
    osaStatus.className = 'gauge-status warning';
  }
  
  const isaStatus = document.getElementById('statusISA');
  if (currentState.isa >= 98) {
    isaStatus.textContent = 'Отлично';
    isaStatus.className = 'gauge-status excellent';
  } else if (currentState.isa >= 90) {
    isaStatus.textContent = 'Хорошо';
    isaStatus.className = 'gauge-status good';
  } else {
    isaStatus.textContent = 'Требует улучшения';
    isaStatus.className = 'gauge-status warning';
  }
  
  // Distribution insight
  const lostSales = (100 - currentState.osa) * 0.7;
  const insight = `При текущей дистрибуции вы теряете примерно <strong>${lostSales.toFixed(1)}%</strong> продаж из-за недостаточной доступности товара.`;
  document.getElementById('distributionInsight').innerHTML = insight;
}

function updateReputationDisplay() {
  const rating = currentState.rating;
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.5;
  let stars = '⭐'.repeat(fullStars);
  if (halfStar && fullStars < 5) stars += '½';
  
  document.getElementById('bigRating').textContent = stars;
  document.getElementById('bigRatingNum').textContent = rating.toFixed(1);
  document.getElementById('reviewCountDisplay').textContent = formatNumber(currentState.reviewCount) + ' отзывов';
  
  const conversionImpact = ((rating - 3.0) * 15).toFixed(0);
  const trustScore = (Math.min(1.0, Math.log10(currentState.reviewCount + 1) / 3) * 100).toFixed(0);
  const negativeImpact = (currentState.negativeRate * 1.5).toFixed(0);
  
  const impact = `
    <p><strong>Влияние на конверсию:</strong></p>
    <p>• Рейтинг: ${conversionImpact > 0 ? '+' : ''}${conversionImpact}%</p>
    <p>• Доверие (отзывы): ${trustScore}%</p>
    <p>• Потери от негатива: -${negativeImpact}%</p>
  `;
  document.getElementById('reputationImpact').innerHTML = impact;
}

function updateCharts() {
  const channels = currentResults.channels;
  const channelKeys = Object.keys(channels);
  
  // Tree/Pie Chart for budget distribution
  const pieData = {
    labels: channelKeys.map(key => channels[key].name),
    datasets: [{
      data: channelKeys.map(key => channels[key].share.toFixed(1)),
      backgroundColor: [
        '#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', 
        '#5D878F', '#DB4545', '#D2BA4C', '#964325',
        '#944454', '#13343B', '#32B8C6', '#E68161',
        '#7FB3D5', '#C39BD3', '#F8C471', '#85C1E2'
      ]
    }]
  };
  
  if (charts.tree) {
    charts.tree.data = pieData;
    charts.tree.update();
  } else {
    const ctx = document.getElementById('treeChart').getContext('2d');
    charts.tree = new Chart(ctx, {
      type: 'doughnut',
      data: pieData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { size: 11 },
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const budget = channels[channelKeys[context.dataIndex]].budget;
                return `${label}: ${value}% (${formatCurrency(budget)})`;
              }
            }
          }
        }
      }
    });
  }
  
  // Waterfall Chart for factors impact
  const baseSales = currentState.budget * 2.5;
  const mediaImpact = baseSales * (currentResults.totalROI - 2.5);
  const distImpact = baseSales * (currentResults.distributionMultiplier - 1);
  const priceImpact = baseSales * (currentResults.priceEffectMultiplier - 1);
  const reputationImpact = baseSales * (currentResults.reputationMultiplier - 1);
  const negativeLoss = baseSales * 0.05;
  const finalSales = currentResults.totalSales;
  
  const waterfallData = {
    labels: ['Базовые продажи', 'Медиа-микс', 'Дистрибуция', 'Промо', 'Рейтинг', 'Потери', 'Итого'],
    datasets: [{
      label: 'Влияние на продажи',
      data: [
        baseSales / 1000000,
        (baseSales + mediaImpact) / 1000000,
        (baseSales + mediaImpact + distImpact) / 1000000,
        (baseSales + mediaImpact + distImpact + priceImpact) / 1000000,
        (baseSales + mediaImpact + distImpact + priceImpact + reputationImpact) / 1000000,
        (baseSales + mediaImpact + distImpact + priceImpact + reputationImpact - negativeLoss) / 1000000,
        finalSales / 1000000
      ],
      backgroundColor: ['#1FB8CD', '#5D878F', '#D2BA4C', '#FFC185', '#32B8C6', '#DB4545', '#0F7B6C']
    }]
  };
  
  if (charts.waterfall) {
    charts.waterfall.data = waterfallData;
    charts.waterfall.update();
  } else {
    const ctx = document.getElementById('waterfallChart').getContext('2d');
    charts.waterfall = new Chart(ctx, {
      type: 'bar',
      data: waterfallData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.parsed.y.toFixed(1)} млн ₽`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Продажи (млн ₽)' }
          }
        }
      }
    });
  }
  
  // Remove old bar and line charts as we have new visualizations
}

function updateTable() {
  const channels = currentResults.channels;
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  
  // Sort by ROI descending
  const sortedKeys = Object.keys(channels).sort((a, b) => channels[b].finalROI - channels[a].finalROI);
  
  sortedKeys.forEach(key => {
    const channel = channels[key];
    const row = document.createElement('tr');
    
    let efficiencyClass = 'efficiency-medium';
    let efficiencyText = 'Средняя';
    if (channel.finalROI > 3.5) {
      efficiencyClass = 'efficiency-high';
      efficiencyText = 'Высокая';
    } else if (channel.finalROI < 2.0) {
      efficiencyClass = 'efficiency-low';
      efficiencyText = 'Низкая';
    }
    
    row.innerHTML = `
      <td><strong>${channel.name}</strong></td>
      <td>${formatCurrency(channel.budget)}</td>
      <td>${channel.share.toFixed(1)}%</td>
      <td>${channel.finalROI.toFixed(2)}</td>
      <td>${formatCurrency(channel.sales)}</td>
      <td><span class="efficiency-indicator ${efficiencyClass}">${efficiencyText}</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

function updateRecommendations() {
  const recommendations = generateRecommendations(currentResults);
  const container = document.getElementById('recommendations');
  
  container.innerHTML = '<ul>' + recommendations.map(rec => `<li>${rec}</li>`).join('') + '</ul>';
}

// Event Handlers
function setupEventListeners() {
  // Category
  document.getElementById('category').addEventListener('change', (e) => {
    currentState.category = parseInt(e.target.value);
  });
  
  // Brand Size
  document.getElementById('brandSize').addEventListener('input', (e) => {
    currentState.brandSize = parseInt(e.target.value);
    const value = currentState.brandSize;
    let displayValue;
    if (value >= 1000) {
      displayValue = (value / 1000).toFixed(1) + ' млрд ₽';
    } else {
      displayValue = value + ' млн ₽';
    }
    document.getElementById('brandSizeValue').textContent = displayValue;
  });
  
  // Online Share
  document.getElementById('onlineShare').addEventListener('input', (e) => {
    currentState.onlineShare = parseInt(e.target.value);
    document.getElementById('onlineShareValue').textContent = currentState.onlineShare + '%';
  });
  
  // Audience Type
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentState.audienceType = e.target.dataset.value;
    });
  });
  
  // Budget
  const budgetInput = document.getElementById('budget');
  budgetInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (!isNaN(value) && value !== '') {
      currentState.budget = parseInt(value);
      e.target.value = formatNumber(value);
    }
  });
  
  budgetInput.addEventListener('blur', (e) => {
    let value = parseBudget(e.target.value);
    if (value < 1000000) value = 1000000;
    if (value > 1000000000) value = 1000000000;
    currentState.budget = value;
    e.target.value = formatNumber(value);
  });
  
  // Risk Level
  document.querySelectorAll('.risk-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.risk-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentState.riskLevel = parseInt(e.target.dataset.risk);
    });
  });
  
  // Time Horizon
  document.querySelectorAll('input[name="timeHorizon"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentState.timeHorizon = parseInt(e.target.value);
    });
  });
  
  // Distribution parameters
  document.getElementById('osa').addEventListener('input', (e) => {
    currentState.osa = parseInt(e.target.value);
    document.getElementById('osaValue').textContent = currentState.osa + '%';
  });
  
  document.getElementById('isa').addEventListener('input', (e) => {
    currentState.isa = parseInt(e.target.value);
    document.getElementById('isaValue').textContent = currentState.isa + '%';
  });
  
  document.getElementById('numDist').addEventListener('input', (e) => {
    currentState.numDist = parseInt(e.target.value);
    document.getElementById('numDistValue').textContent = currentState.numDist + '%';
  });
  
  document.getElementById('weightedDist').addEventListener('input', (e) => {
    currentState.weightedDist = parseInt(e.target.value);
    document.getElementById('weightedDistValue').textContent = currentState.weightedDist + '%';
  });
  
  // Pricing parameters
  document.getElementById('priceIndex').addEventListener('input', (e) => {
    currentState.priceIndex = parseFloat(e.target.value);
    document.getElementById('priceIndexValue').textContent = currentState.priceIndex.toFixed(2);
    
    const priceTag = document.getElementById('pricePosition');
    if (currentState.priceIndex < 0.9) {
      priceTag.textContent = 'Эконом';
    } else if (currentState.priceIndex <= 1.1) {
      priceTag.textContent = 'Средний';
    } else {
      priceTag.textContent = 'Премиум';
    }
  });
  
  document.getElementById('promoDepth').addEventListener('input', (e) => {
    currentState.promoDepth = parseInt(e.target.value);
    document.getElementById('promoDepthValue').textContent = currentState.promoDepth + '%';
  });
  
  document.getElementById('promoFreq').addEventListener('input', (e) => {
    currentState.promoFreq = parseInt(e.target.value);
    document.getElementById('promoFreqValue').textContent = currentState.promoFreq + ' дней/мес';
  });
  
  document.getElementById('promoBudget').addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      currentState.promoBudget = parseFloat(value) * 1000000;
    }
  });
  
  // Reputation parameters
  document.getElementById('rating').addEventListener('input', (e) => {
    currentState.rating = parseFloat(e.target.value);
    document.getElementById('ratingValue').textContent = currentState.rating.toFixed(1);
    
    const fullStars = Math.floor(currentState.rating);
    const halfStar = (currentState.rating % 1) >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (halfStar && fullStars < 5) stars += '½';
    document.getElementById('ratingStars').textContent = stars;
  });
  
  document.getElementById('reviewCount').addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      currentState.reviewCount = parseInt(value);
      e.target.value = formatNumber(currentState.reviewCount);
    }
  });
  
  document.getElementById('negativeRate').addEventListener('input', (e) => {
    currentState.negativeRate = parseInt(e.target.value);
    document.getElementById('negativeRateValue').textContent = currentState.negativeRate + '%';
  });
  
  // Channel checkboxes
  const channelIds = [
    'wb', 'wb_auto', 'wb_search', 'wb_card', 'wb_banners',
    'ozon', 'ozon_search', 'ozon_templates', 'ozon_loyalty',
    'yandex', 'yandex_boost', 'yandex_shelves',
    'external_direct', 'external_vk', 'external_telegram',
    'own_site', 'tv', 'bvod', 'radio', 'ooh'
  ];
  
  channelIds.forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        currentState.channels[id] = e.target.checked;
        
        // Show/hide subchannels
        if (id === 'wb') {
          const subchannels = document.getElementById('wbSubchannels');
          if (subchannels) {
            subchannels.classList.toggle('active', e.target.checked);
          }
        } else if (id === 'ozon') {
          const subchannels = document.getElementById('ozonSubchannels');
          if (subchannels) {
            subchannels.classList.toggle('active', e.target.checked);
          }
        } else if (id === 'yandex') {
          const subchannels = document.getElementById('yandexSubchannels');
          if (subchannels) {
            subchannels.classList.toggle('active', e.target.checked);
          }
        }
      });
    }
  });
  
  // Accordion functionality
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const target = header.dataset.target;
      const content = document.getElementById(target);
      
      header.classList.toggle('active');
      content.classList.toggle('active');
    });
  });
  
  // Calculate Button
  document.getElementById('calculateBtn').addEventListener('click', () => {
    updateResults();
  });
  
  // Scenario Buttons
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const scenario = e.target.dataset.scenario;
      runScenario(scenario);
    });
  });
  
  // Export Button
  document.getElementById('exportBtn').addEventListener('click', () => {
    alert('Функция экспорта в PDF будет доступна в следующей версии');
  });
}

function runScenario(scenario) {
  if (!currentResults) return;
  
  let scenarioState = JSON.parse(JSON.stringify(currentState));
  
  switch(scenario) {
    case 'increase':
      scenarioState.budget = currentState.budget * 1.2;
      break;
    case 'decrease':
      scenarioState.budget = currentState.budget * 0.8;
      break;
    case 'marketplace':
      // Turn on all marketplaces, turn off traditional
      scenarioState.channels.wb = true;
      scenarioState.channels.ozon = true;
      scenarioState.channels.yandex = true;
      scenarioState.channels.tv = false;
      scenarioState.channels.radio = false;
      break;
    case 'wildberries':
      scenarioState.channels.wb = true;
      scenarioState.channels.wb_auto = true;
      scenarioState.channels.wb_search = true;
      scenarioState.channels.wb_card = true;
      break;
    case 'multiplatform':
      scenarioState.channels.wb = true;
      scenarioState.channels.ozon = true;
      scenarioState.channels.yandex = true;
      break;
    case 'improveOSA':
      scenarioState.osa = 95;
      break;
    case 'improveRating':
      scenarioState.rating = 4.5;
      break;
    case 'aggressivePromo':
      scenarioState.promoDepth = 30;
      scenarioState.promoFreq = 25;
      break;
  }
  
  // Temporarily apply scenario
  const tempState = JSON.parse(JSON.stringify(currentState));
  currentState = scenarioState;
  const scenarioResults = calculateOptimalMix();
  currentState = tempState;
  
  if (!scenarioResults) {
    alert('Не удалось рассчитать сценарий');
    return;
  }
  
  // Show comparison
  document.getElementById('scenarioResults').style.display = 'block';
  document.getElementById('currentROI').textContent = (currentResults.totalROI * 100).toFixed(1) + '%';
  document.getElementById('scenarioROI').textContent = (scenarioResults.totalROI * 100).toFixed(1) + '%';
  
  // Change color based on result
  const scenarioValue = document.getElementById('scenarioROI');
  if (scenarioResults.totalROI > currentResults.totalROI) {
    scenarioValue.style.color = '#00875A';
  } else {
    scenarioValue.style.color = '#DE350B';
  }
}

// Initialize
setupEventListeners();

// Set initial values
document.getElementById('brandSizeValue').textContent = '10 млрд ₽';
document.getElementById('onlineShareValue').textContent = '30%';
document.getElementById('osaValue').textContent = '90%';
document.getElementById('isaValue').textContent = '95%';
document.getElementById('numDistValue').textContent = '75%';
document.getElementById('weightedDistValue').textContent = '80%';
document.getElementById('priceIndexValue').textContent = '1.0';
document.getElementById('pricePosition').textContent = 'Средний';
document.getElementById('promoDepthValue').textContent = '15%';
document.getElementById('promoFreqValue').textContent = '10 дней/мес';
document.getElementById('ratingValue').textContent = '4.2';
document.getElementById('ratingStars').textContent = '⭐⭐⭐⭐';
document.getElementById('negativeRateValue').textContent = '8%';

// Show initial subchannels for active platforms
document.getElementById('wbSubchannels').classList.add('active');
document.getElementById('ozonSubchannels').classList.add('active');