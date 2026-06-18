// UI Event Handlers and Display Updates

// Initialize UI
function initializeUI() {
  setupEventListeners();
  updateAllDisplayValues();
}

// Setup all event listeners
function setupEventListeners() {
  // FMCG Category
  document.getElementById('fmcgCategory').addEventListener('change', (e) => {
    appState.fmcgCategory = e.target.value;
  });
  
  // Positioning
  document.querySelectorAll('input[name="positioning"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      appState.positioning = e.target.value;
    });
  });
  
  // Product Type
  document.querySelectorAll('input[name="productType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      appState.productType = e.target.value;
    });
  });
  
  // Brand Revenue
  document.getElementById('brandRevenue').addEventListener('input', (e) => {
    appState.brandRevenue = parseInt(e.target.value);
    const value = appState.brandRevenue;
    let displayValue = value >= 1000 ? 
      (value / 1000).toFixed(1) + ' млрд ₽' : 
      value + ' млн ₽';
    document.getElementById('brandRevenueValue').textContent = displayValue;
  });
  
  // Budget
  const budgetInput = document.getElementById('budget');
  budgetInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (!isNaN(value) && value !== '') {
      appState.budget = parseInt(value);
      e.target.value = formatNumber(value);
    }
  });
  
  budgetInput.addEventListener('blur', (e) => {
    let value = parseBudget(e.target.value);
    if (value < 1000000) value = 1000000;
    if (value > 500000000) value = 500000000;
    appState.budget = value;
    e.target.value = formatNumber(value);
  });
  
  // Flight Duration
  document.getElementById('flightDuration').addEventListener('input', (e) => {
    appState.flightDuration = parseInt(e.target.value);
    const months = appState.flightDuration;
    document.getElementById('flightDurationValue').textContent = 
      months === 1 ? '1 месяц' : 
      months < 5 ? months + ' месяца' : 
      months + ' месяцев';
  });
  
  // Goals
  ['goalAwareness', 'goalPerformance', 'goalBrand'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      const goal = id.replace('goal', '').toLowerCase();
      appState.goals[goal] = e.target.checked;
    });
  });
  
  // Priorities
  ['priorityAwareness', 'priorityPerformance', 'priorityBrand'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
      const priority = id.replace('priority', '').toLowerCase();
      appState.priorities[priority] = parseInt(e.target.value);
      document.getElementById(id + 'Value').textContent = e.target.value + '%';
      updatePrioritySum();
    });
  });
  
  // OSA
  document.getElementById('osa').addEventListener('input', (e) => {
    appState.osa = parseInt(e.target.value);
    document.getElementById('osaValue').textContent = appState.osa + '%';
  });
  
  // Rating
  document.getElementById('rating').addEventListener('input', (e) => {
    appState.rating = parseFloat(e.target.value);
    document.getElementById('ratingValue').textContent = appState.rating.toFixed(1);
    updateRatingStars();
  });
  
  // Review Count
  document.getElementById('reviewCount').addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      appState.reviewCount = parseInt(value);
      e.target.value = formatNumber(appState.reviewCount);
    }
  });
  
  // Price Index
  document.getElementById('priceIndex').addEventListener('input', (e) => {
    appState.priceIndex = parseFloat(e.target.value);
    document.getElementById('priceIndexValue').textContent = appState.priceIndex.toFixed(2);
  });
  
  // Promo Depth
  document.getElementById('promoDepth').addEventListener('input', (e) => {
    appState.promoDepth = parseInt(e.target.value);
    document.getElementById('promoDepthValue').textContent = appState.promoDepth + '%';
  });
  
  // Promo Frequency
  document.getElementById('promoFreq').addEventListener('input', (e) => {
    appState.promoFreq = parseInt(e.target.value);
    document.getElementById('promoFreqValue').textContent = appState.promoFreq + ' дней/мес';
  });
  
  // Platform checkboxes and budget sliders
  Object.keys(egroceryPlatforms).forEach(key => {
    const checkbox = document.getElementById('platform_' + key);
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        appState.platforms[key].selected = e.target.checked;
        const details = document.getElementById('details_' + key);
        if (details) {
          details.classList.toggle('active', e.target.checked);
        }
      });
    }
    
    const slider = document.getElementById('budget_' + key);
    if (slider) {
      slider.addEventListener('input', (e) => {
        appState.platforms[key].budget = parseInt(e.target.value);
        document.getElementById('budget_' + key + '_value').textContent = e.target.value + '%';
      });
    }
  });
  
  // External channels
  Object.keys(externalChannels).forEach(key => {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        appState.external[key] = e.target.checked;
      });
    }
  });
  
  // Accordion
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
    performCalculation();
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

function updateAllDisplayValues() {
  document.getElementById('brandRevenueValue').textContent = '500 млн ₽';
  document.getElementById('flightDurationValue').textContent = '3 месяца';
  document.getElementById('osaValue').textContent = '85%';
  document.getElementById('ratingValue').textContent = '4.2';
  updateRatingStars();
  document.getElementById('priceIndexValue').textContent = '1.0';
  document.getElementById('promoDepthValue').textContent = '15%';
  document.getElementById('promoFreqValue').textContent = '10 дней/мес';
  updatePrioritySum();
}

function updateRatingStars() {
  const rating = appState.rating;
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.5;
  let stars = '⭐'.repeat(fullStars);
  if (halfStar && fullStars < 5) stars += '½';
  document.getElementById('ratingStars').textContent = stars;
}

function updatePrioritySum() {
  const sum = appState.priorities.awareness + appState.priorities.performance + appState.priorities.brand;
  const sumElement = document.getElementById('prioritySum');
  sumElement.innerHTML = `Сумма: <span>${sum}%</span>`;
  
  if (sum !== 100) {
    sumElement.style.color = '#DE350B';
  } else {
    sumElement.style.color = 'inherit';
  }
}

// Perform calculation and display results
function performCalculation() {
  currentResults = calculateResults();
  
  if (!currentResults) {
    alert('Пожалуйста, выберите хотя бы одну eGrocery площадку');
    return;
  }
  
  // Show results
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('results').style.display = 'block';
  
  // Update KPI cards
  document.getElementById('roiValue').textContent = currentResults.overallROI.toFixed(1) + '%';
  document.getElementById('salesValue').textContent = formatCurrency(currentResults.totalRevenue);
  document.getElementById('profitValue').textContent = formatCurrency(currentResults.netProfit);
  
  const ecomSharePercent = (Object.values(currentResults.platforms).reduce((sum, p) => sum + p.budgetPercent, 0));
  document.getElementById('ecomShareValue').textContent = ecomSharePercent.toFixed(1) + '%';
  document.getElementById('efficiencyValue').textContent = Math.round(currentResults.efficiencyScore);
  
  // Update changes
  document.getElementById('roiChange').textContent = currentResults.overallROI > 0 ? '+' + currentResults.overallROI.toFixed(1) + '%' : '';
  document.getElementById('salesChange').textContent = '+' + ((currentResults.totalRevenue / appState.budget - 1) * 100).toFixed(1) + '%';
  document.getElementById('profitChange').textContent = 'После затрат';
  document.getElementById('ecomShareChange').textContent = 'От бюджета';
  document.getElementById('efficiencyChange').textContent = 'из 100';
  
  // Update charts
  updateCharts();
  
  // Update table
  updateTable();
  
  // Update diminishing returns chart
  console.log('Calling renderDiminishingReturnsChart...');
  renderDiminishingReturnsChart(currentResults);
  
  // Update recommendations
  updateRecommendations();
  
  // Scroll to results
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Update all charts
function updateCharts() {
  updateDistributionChart();
  updateWaterfallChart();
  updateChannelDetailsChart();
  updateRadarChart();
}

function updateDistributionChart() {
  const labels = [];
  const data = [];
  const colors = ['#005BFF', '#CB11AB', '#FFCC00', '#00C08C', '#FC0', 
                  '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  Object.entries(currentResults.platforms).forEach(([key, platform]) => {
    labels.push(platform.name);
    data.push(platform.budgetPercent.toFixed(1));
  });
  
  const chartData = {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: colors.slice(0, labels.length)
    }]
  };
  
  const ctx = document.getElementById('treeChart').getContext('2d');
  if (charts.distribution) {
    charts.distribution.data = chartData;
    charts.distribution.update();
  } else {
    charts.distribution = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { font: { size: 11 }, padding: 10 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const platform = Object.values(currentResults.platforms)[context.dataIndex];
                return `${context.label}: ${context.parsed}% (${formatCurrency(platform.budget)})`;
              }
            }
          }
        }
      }
    });
  }
}

function updateWaterfallChart() {
  const baseSales = appState.budget * 2.0;
  const stages = [
    { label: 'Базовые продажи', value: baseSales },
    { label: 'Медиамикс', value: baseSales + (currentResults.totalRevenue - baseSales) * 0.5 },
    { label: 'OSA', value: baseSales + (currentResults.totalRevenue - baseSales) * 0.7 },
    { label: 'Рейтинг', value: baseSales + (currentResults.totalRevenue - baseSales) * 0.85 },
    { label: 'Промо', value: currentResults.totalRevenue },
    { label: 'Комиссии', value: currentResults.totalRevenue - currentResults.totalCommission },
    { label: 'Итого', value: currentResults.totalRevenue - currentResults.totalCommission }
  ];
  
  const ctx = document.getElementById('waterfallChart').getContext('2d');
  const chartData = {
    labels: stages.map(s => s.label),
    datasets: [{
      label: 'Выручка (млн ₽)',
      data: stages.map(s => s.value / 1000000),
      backgroundColor: ['#1FB8CD', '#5D878F', '#D2BA4C', '#FFC185', '#32B8C6', '#DB4545', '#0F7B6C']
    }]
  };
  
  if (charts.waterfall) {
    charts.waterfall.data = chartData;
    charts.waterfall.update();
  } else {
    charts.waterfall = new Chart(ctx, {
      type: 'bar',
      data: chartData,
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
            title: { display: true, text: 'Млн ₽' }
          }
        }
      }
    });
  }
}

function updateChannelDetailsChart() {
  const platforms = Object.entries(currentResults.platforms)
    .sort((a, b) => b[1].budget - a[1].budget);
  
  const labels = platforms.map(([key, p]) => p.name);
  const budgets = platforms.map(([key, p]) => p.budget / 1000000);
  const colors = ['#005BFF', '#CB11AB', '#FFCC00', '#00C08C', '#FC0', 
                  '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const ctx = document.getElementById('channelDetailsChart').getContext('2d');
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Бюджет (млн ₽)',
      data: budgets,
      backgroundColor: colors.slice(0, labels.length)
    }]
  };
  
  if (charts.details) {
    charts.details.data = chartData;
    charts.details.update();
  } else {
    charts.details = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.parsed.x.toFixed(2)} млн ₽`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: 'Бюджет (млн ₽)' }
          }
        }
      }
    });
  }
}

function updateRadarChart() {
  // Placeholder for radar chart comparing top platforms
  // Would show metrics like: sales volume, growth, avg check, formats count, ROAS, audience
}

function renderDiminishingReturnsChart(results) {
  console.log('renderDiminishingReturnsChart called', results);
  
  // Show section
  const section = document.getElementById('diminishingReturnsSection');
  if (section) {
    section.style.display = 'block';
  }
  
  // Destroy previous chart
  if (charts.diminishingReturns) {
    charts.diminishingReturns.destroy();
    charts.diminishingReturns = null;
  }
  
  const canvas = document.getElementById('diminishingReturnsChart');
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  // Get top 5 platforms by budget
  const platformsArray = Object.entries(results.platforms)
    .filter(([key, p]) => p.budget > 0)
    .sort((a, b) => b[1].budget - a[1].budget)
    .slice(0, 5);
  
  console.log('Top 5 platforms for curves:', platformsArray);
  
  if (platformsArray.length === 0) {
    console.warn('No platforms with budget > 0');
    return;
  }
  
  // Colors for platforms
  const colors = [
    '#005BFF',  // Ozon blue
    '#CB11AB',  // Wildberries purple
    '#FFCC00',  // Yandex yellow
    '#00C08C',  // Samokat green
    '#FF6B6B'   // Others red
  ];
  
  const datasets = [];
  const totalBudget = Object.values(results.platforms).reduce((sum, p) => sum + p.budget, 0);
  
  // Create curves for each platform
  platformsArray.forEach(([key, platform], index) => {
    const baseROAS = platform.roas / (1 - (platform.budgetPercent / 100) * 0.2); // Reverse diminishing effect to get base
    const currentShare = platform.budgetPercent;
    
    // Create curve points from 0% to 80% budget share
    const curvePoints = [];
    for (let share = 0; share <= 80; share += 2) {
      // Diminishing returns formula
      const diminishingFactor = 1 - (share / 100) * 0.35;
      const effectiveROAS = baseROAS * diminishingFactor;
      
      curvePoints.push({
        x: share,
        y: Math.max(effectiveROAS, 0.5)
      });
    }
    
    // Add curve line
    datasets.push({
      label: platform.name,
      data: curvePoints,
      borderColor: colors[index],
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.3,
      fill: false
    });
    
    // Add current position point
    const currentROAS = platform.roas;
    datasets.push({
      label: `${platform.name} (текущий)`,
      data: [{
        x: currentShare,
        y: Math.max(currentROAS, 0.5)
      }],
      borderColor: colors[index],
      backgroundColor: colors[index],
      pointRadius: 8,
      pointStyle: 'circle',
      pointBorderWidth: 2,
      pointBorderColor: '#ffffff',
      showLine: false
    });
  });
  
  console.log('Creating chart with datasets:', datasets);
  
  // Create chart
  try {
    charts.diminishingReturns = new Chart(ctx, {
      type: 'line',
      data: { datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 },
              usePointStyle: true,
              filter: function(item) {
                return !item.text.includes('(текущий)');
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              title: function(context) {
                return context[0].dataset.label;
              },
              label: function(context) {
                const share = context.parsed.x.toFixed(1);
                const roas = context.parsed.y.toFixed(2);
                return `Доля бюджета: ${share}% → ROAS: ${roas}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: 80,
            title: {
              display: true,
              text: 'Доля площадки в общем бюджете (%)',
              font: { size: 13, weight: 'bold' },
              padding: { top: 10 }
            },
            ticks: {
              stepSize: 10,
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Эффективный ROAS',
              font: { size: 13, weight: 'bold' },
              padding: { bottom: 10 }
            },
            ticks: {
              callback: function(value) {
                return value.toFixed(1);
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    });
    
    console.log('Chart created successfully!');
    
  } catch (error) {
    console.error('Error creating chart:', error);
  }
}

function updateTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  
  const sorted = Object.entries(currentResults.platforms)
    .sort((a, b) => b[1].roas - a[1].roas);
  
  sorted.forEach(([key, platform]) => {
    const row = document.createElement('tr');
    
    let effClass = 'efficiency-medium';
    let effText = 'Средняя';
    if (platform.roas > 4.0) {
      effClass = 'efficiency-high';
      effText = 'Высокая';
    } else if (platform.roas < 2.5) {
      effClass = 'efficiency-low';
      effText = 'Низкая';
    }
    
    row.innerHTML = `
      <td><strong>${platform.name}</strong></td>
      <td>${formatCurrency(platform.budget)}</td>
      <td>${platform.budgetPercent.toFixed(1)}%</td>
      <td>${platform.roas.toFixed(2)}</td>
      <td>${formatCurrency(platform.revenue)}</td>
      <td><span class="efficiency-indicator ${effClass}">${effText}</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

function updateRecommendations() {
  const recommendations = generateRecommendations(currentResults);
  const container = document.getElementById('recommendations');
  
  container.innerHTML = '<ul>' + 
    recommendations.map(rec => `<li>${rec}</li>`).join('') + 
    '</ul>';
}

// Scenario analysis
function runScenario(scenario) {
  if (!currentResults) return;
  
  const originalState = JSON.parse(JSON.stringify(appState));
  
  switch(scenario) {
    case 'increase':
      appState.budget *= 1.25;
      break;
    case 'decrease':
      appState.budget *= 0.75;
      break;
    case 'focus3':
      // Focus on top 3 platforms by ROAS
      const top3 = Object.entries(currentResults.platforms)
        .sort((a, b) => b[1].roas - a[1].roas)
        .slice(0, 3)
        .map(([key]) => key);
      
      Object.keys(appState.platforms).forEach(key => {
        if (top3.includes(key)) {
          appState.platforms[key].selected = true;
          appState.platforms[key].budget = 33.33;
        } else {
          appState.platforms[key].selected = false;
          appState.platforms[key].budget = 0;
        }
      });
      break;
    case 'wb':
      appState.platforms.wb.selected = true;
      appState.platforms.wb.budget = 70;
      break;
    case 'multiplatform':
      ['ozon', 'wb', 'yandex', 'samokat', 'lavka'].forEach(key => {
        appState.platforms[key].selected = true;
        appState.platforms[key].budget = 20;
      });
      break;
    case 'improveOSA':
      appState.osa = 95;
      break;
    case 'improveRating':
      appState.rating = 4.5;
      break;
    case 'aggressivePromo':
      appState.promoDepth = 30;
      appState.promoFreq = 20;
      break;
  }
  
  const scenarioResults = calculateResults();
  appState = originalState;
  
  if (!scenarioResults) {
    alert('Не удалось рассчитать сценарий');
    return;
  }
  
  // Show comparison
  document.getElementById('scenarioResults').style.display = 'block';
  document.getElementById('currentROI').textContent = currentResults.overallROI.toFixed(1) + '%';
  document.getElementById('scenarioROI').textContent = scenarioResults.overallROI.toFixed(1) + '%';
  
  const scenarioValue = document.getElementById('scenarioROI');
  if (scenarioResults.overallROI > currentResults.overallROI) {
    scenarioValue.style.color = '#00875A';
  } else {
    scenarioValue.style.color = '#DE350B';
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeUI);
