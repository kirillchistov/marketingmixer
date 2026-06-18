// Application State
const appState = {
  currentView: 'landing',
  user: null,
  
  // Calculator state
  category: 'dairy',
  positioning: 'mid',
  productType: 'basic',
  brandRevenue: 500,
  budget: 10000000,
  flightDuration: 3,
  
  // Goals
  goalAwareness: true,
  goalPerformance: true,
  goalBrand: false,
  priorityAwareness: 30,
  priorityPerformance: 50,
  priorityBrand: 20,
  
  // Operational factors
  osa: 80,
  isa: 70,
  numericDist: 60,
  weightedDist: 65,
  priceIndex: 1.0,
  promoDepth: 20,
  promoFreq: 10,
  rating: 4.2,
  reviewCount: 500,
  negativeRate: 5,
  
  // Platform selection
  selectedPlatforms: ['ozon', 'wb'],
  platformBudgets: { ozon: 50, wb: 50 },
  
  // External channels
  selectedChannels: [],
  channelBudgets: {},
  
  // Results
  calculated: false,
  results: null
};

// Render functions
function renderLanding() {
  return `
    <div class="auth-container">
      <div class="auth-card">
        <h1>eGrocery Media Mix Calculator</h1>
        <p style="text-align: center; color: var(--color-text-secondary); margin-bottom: 24px;">
          Калькулятор медиа-микса для FMCG категорий в российских eGrocery платформах
        </p>
        <button class="btn btn-primary" onclick="showSignIn()">Войти</button>
        <div class="auth-links">
          <a href="#" onclick="showSignUp(); return false;">Зарегистрироваться</a>
        </div>
      </div>
    </div>
  `;
}

function renderSignIn() {
  return `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Вход в систему</h1>
        <form onsubmit="handleSignIn(event)">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" required placeholder="email@example.com">
          </div>
          <div class="form-group">
            <label class="form-label">Пароль</label>
            <input type="password" class="form-input" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary">Войти</button>
        </form>
        <div class="auth-links">
          <a href="#" onclick="showSignUp(); return false;">Нет аккаунта? Зарегистрироваться</a>
        </div>
      </div>
    </div>
  `;
}

function renderSignUp() {
  return `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Регистрация</h1>
        <form onsubmit="handleSignUp(event)">
          <div class="form-group">
            <label class="form-label">Имя</label>
            <input type="text" class="form-input" required placeholder="Иван Иванов">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" required placeholder="email@example.com">
          </div>
          <div class="form-group">
            <label class="form-label">Пароль</label>
            <input type="password" class="form-input" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
        </form>
        <div class="auth-links">
          <a href="#" onclick="showSignIn(); return false;">Уже есть аккаунт? Войти</a>
        </div>
      </div>
    </div>
  `;
}

function renderCalculator() {
  return `
    <div class="calculator-layout">
      <header class="header">
        <div class="header-title">eGrocery Media Mix Calculator</div>
        <div class="header-actions">
          ${appState.calculated ? '<button class="btn btn-secondary" onclick="exportResults()">Экспорт PDF</button>' : ''}
          <button class="user-menu" onclick="handleLogout()">${appState.user?.name || 'Пользователь'} | Выйти</button>
        </div>
      </header>
      <div class="main-layout">
        <aside class="sidebar">
          ${renderSidebar()}
        </aside>
        <main class="main-content">
          ${appState.calculated ? renderResults() : renderEmptyState()}
        </main>
      </div>
    </div>
  `;
}

function renderSidebar() {
  return `
    ${renderScenarioButtons()}
    ${renderCategorySettings()}
    ${renderCampaignParameters()}
    ${renderOperationalFactors()}
    ${renderPlatformSelection()}
    ${renderExternalChannels()}
    <button class="btn btn-primary calculate-btn" onclick="handleCalculate()">Рассчитать оптимальный микс</button>
  `;
}

function renderScenarioButtons() {
  return `
    <div class="scenario-buttons">
      <button class="btn-scenario" onclick="applyScenario('aggressive')">Агрессивный</button>
      <button class="btn-scenario" onclick="applyScenario('balanced')">Сбалансированный</button>
      <button class="btn-scenario" onclick="applyScenario('conservative')">Консервативный</button>
    </div>
  `;
}

function renderCategorySettings() {
  const categories = Object.values(FMCG_CATEGORIES);
  return `
    <div class="section">
      <h3 class="section-title">Настройки категории FMCG</h3>
      <div class="form-group">
        <label class="form-label">Категория</label>
        <select class="form-select" value="${appState.category}" onchange="updateState('category', this.value)">
          ${categories.map(cat => `<option value="${cat.id}" ${appState.category === cat.id ? 'selected' : ''}>${cat.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Позиционирование</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" name="positioning" value="economy" ${appState.positioning === 'economy' ? 'checked' : ''} onchange="updateState('positioning', 'economy')">
            Эконом
          </label>
          <label class="radio-label">
            <input type="radio" name="positioning" value="mid" ${appState.positioning === 'mid' ? 'checked' : ''} onchange="updateState('positioning', 'mid')">
            Средний
          </label>
          <label class="radio-label">
            <input type="radio" name="positioning" value="premium" ${appState.positioning === 'premium' ? 'checked' : ''} onchange="updateState('positioning', 'premium')">
            Премиум
          </label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Выручка бренда (млн ₽)</label>
        <div class="slider-group">
          <div class="slider-value">
            <span>100 млн</span>
            <span class="slider-value-display">${appState.brandRevenue} млн ₽</span>
            <span>5000 млн</span>
          </div>
          <input type="range" class="slider" min="100" max="5000" step="50" value="${appState.brandRevenue}" oninput="updateState('brandRevenue', parseInt(this.value))">
        </div>
      </div>
    </div>
  `;
}

function renderCampaignParameters() {
  return `
    <div class="section">
      <h3 class="section-title">Параметры кампании</h3>
      <div class="form-group">
        <label class="form-label">Бюджет (₽)</label>
        <input type="number" class="form-input" value="${appState.budget}" onchange="updateState('budget', parseInt(this.value))" min="1000000" max="500000000" step="1000000">
      </div>
      <div class="form-group">
        <label class="form-label">Длительность (месяцы)</label>
        <div class="slider-group">
          <div class="slider-value">
            <span>1</span>
            <span class="slider-value-display">${appState.flightDuration} мес</span>
            <span>12</span>
          </div>
          <input type="range" class="slider" min="1" max="12" value="${appState.flightDuration}" oninput="updateState('flightDuration', parseInt(this.value))">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Приоритеты</label>
        <div class="slider-group">
          <div class="slider-value">
            <span>Узнаваемость</span>
            <span class="slider-value-display">${appState.priorityAwareness}%</span>
          </div>
          <input type="range" class="slider" min="0" max="100" value="${appState.priorityAwareness}" oninput="updatePriority('awareness', parseInt(this.value))">
        </div>
        <div class="slider-group">
          <div class="slider-value">
            <span>Продажи</span>
            <span class="slider-value-display">${appState.priorityPerformance}%</span>
          </div>
          <input type="range" class="slider" min="0" max="100" value="${appState.priorityPerformance}" oninput="updatePriority('performance', parseInt(this.value))">
        </div>
        <div class="slider-group">
          <div class="slider-value">
            <span>Бренд</span>
            <span class="slider-value-display">${appState.priorityBrand}%</span>
          </div>
          <input type="range" class="slider" min="0" max="100" value="${appState.priorityBrand}" oninput="updatePriority('brand', parseInt(this.value))">
        </div>
      </div>
    </div>
  `;
}

function renderOperationalFactors() {
  return `
    <div class="section">
      <h3 class="section-title">Операционные факторы</h3>
      ${renderAccordion('distribution', 'Дистрибуция', renderDistributionContent())}
      ${renderAccordion('pricing', 'Ценообразование', renderPricingContent())}
      ${renderAccordion('reputation', 'Репутация', renderReputationContent())}
    </div>
  `;
}

function renderAccordion(id, title, content) {
  return `
    <div class="accordion" id="acc-${id}">
      <div class="accordion-header" onclick="toggleAccordion('acc-${id}')">
        <span>${title}</span>
        <span class="accordion-icon">▼</span>
      </div>
      <div class="accordion-content">
        ${content}
      </div>
    </div>
  `;
}

function renderDistributionContent() {
  return `
    <div class="slider-group">
      <div class="slider-value">
        <span>OSA</span>
        <span class="slider-value-display">${appState.osa}%</span>
      </div>
      <input type="range" class="slider" min="50" max="100" value="${appState.osa}" oninput="updateState('osa', parseInt(this.value))">
    </div>
    <div class="slider-group">
      <div class="slider-value">
        <span>ISA</span>
        <span class="slider-value-display">${appState.isa}%</span>
      </div>
      <input type="range" class="slider" min="50" max="100" value="${appState.isa}" oninput="updateState('isa', parseInt(this.value))">
    </div>
    <div class="slider-group">
      <div class="slider-value">
        <span>Numeric Distribution</span>
        <span class="slider-value-display">${appState.numericDist}%</span>
      </div>
      <input type="range" class="slider" min="30" max="100" value="${appState.numericDist}" oninput="updateState('numericDist', parseInt(this.value))">
    </div>
    <div class="slider-group">
      <div class="slider-value">
        <span>Weighted Distribution</span>
        <span class="slider-value-display">${appState.weightedDist}%</span>
      </div>
      <input type="range" class="slider" min="30" max="100" value="${appState.weightedDist}" oninput="updateState('weightedDist', parseInt(this.value))">
    </div>
  `;
}

function renderPricingContent() {
  return `
    <div class="slider-group">
      <div class="slider-value">
        <span>Ценовой индекс</span>
        <span class="slider-value-display">${appState.priceIndex.toFixed(1)}</span>
      </div>
      <input type="range" class="slider" min="0.5" max="2.0" step="0.1" value="${appState.priceIndex}" oninput="updateState('priceIndex', parseFloat(this.value))">
    </div>
    <div class="slider-group">
      <div class="slider-value">
        <span>Глубина промо (%)</span>
        <span class="slider-value-display">${appState.promoDepth}%</span>
      </div>
      <input type="range" class="slider" min="0" max="50" value="${appState.promoDepth}" oninput="updateState('promoDepth', parseInt(this.value))">
    </div>
    <div class="slider-group">
      <div class="slider-value">
        <span>Частота промо (дней/мес)</span>
        <span class="slider-value-display">${appState.promoFreq}</span>
      </div>
      <input type="range" class="slider" min="0" max="30" value="${appState.promoFreq}" oninput="updateState('promoFreq', parseInt(this.value))">
    </div>
  `;
}

function renderReputationContent() {
  return `
    <div class="slider-group">
      <div class="slider-value">
        <span>Рейтинг</span>
        <span class="slider-value-display">${appState.rating.toFixed(1)}</span>
      </div>
      <input type="range" class="slider" min="1.0" max="5.0" step="0.1" value="${appState.rating}" oninput="updateState('rating', parseFloat(this.value))">
    </div>
    <div class="form-group">
      <label class="form-label">Количество отзывов</label>
      <input type="number" class="form-input" value="${appState.reviewCount}" onchange="updateState('reviewCount', parseInt(this.value))" min="0" step="10">
    </div>
    <div class="slider-group">
      <div class="slider-value">
        <span>Доля негативных (%)</span>
        <span class="slider-value-display">${appState.negativeRate}%</span>
      </div>
      <input type="range" class="slider" min="0" max="50" value="${appState.negativeRate}" oninput="updateState('negativeRate', parseInt(this.value))">
    </div>
  `;
}

function renderPlatformSelection() {
  const platforms = Object.values(EGROCERY_PLATFORMS);
  return `
    <div class="section">
      <h3 class="section-title">Выбор платформ eGrocery</h3>
      ${platforms.map(platform => `
        <div class="platform-item">
          <div class="platform-header">
            <label class="checkbox-label">
              <input type="checkbox" ${appState.selectedPlatforms.includes(platform.id) ? 'checked' : ''} onchange="togglePlatform('${platform.id}')">
              <span class="platform-name">${platform.name}</span>
            </label>
            <span class="platform-share">${formatCurrency(platform.annual_sales)} млн</span>
          </div>
          ${appState.selectedPlatforms.includes(platform.id) ? `
            <div class="slider-group">
              <div class="slider-value">
                <span>Доля бюджета</span>
                <span class="slider-value-display">${appState.platformBudgets[platform.id] || 0}%</span>
              </div>
              <input type="range" class="slider" min="0" max="100" value="${appState.platformBudgets[platform.id] || 0}" oninput="updatePlatformBudget('${platform.id}', parseInt(this.value))">
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderExternalChannels() {
  const channels = Object.values(EXTERNAL_CHANNELS);
  return `
    <div class="section">
      <h3 class="section-title">Внешние каналы</h3>
      ${channels.map(channel => `
        <div class="platform-item">
          <div class="platform-header">
            <label class="checkbox-label">
              <input type="checkbox" ${appState.selectedChannels.includes(channel.id) ? 'checked' : ''} onchange="toggleChannel('${channel.id}')">
              <span class="platform-name">${channel.name}</span>
            </label>
            <span class="platform-share">${channel.type}</span>
          </div>
          ${appState.selectedChannels.includes(channel.id) ? `
            <div class="slider-group">
              <div class="slider-value">
                <span>Доля бюджета</span>
                <span class="slider-value-display">${appState.channelBudgets[channel.id] || 0}%</span>
              </div>
              <input type="range" class="slider" min="0" max="100" value="${appState.channelBudgets[channel.id] || 0}" oninput="updateChannelBudget('${channel.id}', parseInt(this.value))">
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">📊</div>
      <h2 class="empty-state-title">Начните расчёт</h2>
      <p class="empty-state-text">
        Заполните параметры в левой панели и нажмите кнопку "Рассчитать оптимальный микс",
        чтобы получить прогноз ROI, распределение бюджета и рекомендации.
      </p>
    </div>
  `;
}

function renderResults() {
  const { channelResults, metrics, recommendations } = appState.results;
  
  return `
    <div class="results-container">
      ${renderKPICards(metrics)}
      ${renderCharts(channelResults, metrics)}
      ${renderChannelTable(channelResults)}
      ${renderRecommendations(recommendations)}
    </div>
  `;
}

function renderKPICards(metrics) {
  return `
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Прогноз ROI</div>
        <div class="kpi-value">${formatPercent(metrics.overallROI)}</div>
        <div class="kpi-change">ROAS ${metrics.overallROAS.toFixed(2)}x</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Прогноз выручки</div>
        <div class="kpi-value">${formatCurrency(metrics.totalRevenue)}</div>
        <div class="kpi-change">За ${appState.flightDuration} мес</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Чистая прибыль</div>
        <div class="kpi-value">${formatCurrency(metrics.totalProfit)}</div>
        <div class="kpi-change">После комиссий</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Индекс эффективности</div>
        <div class="kpi-value">${metrics.efficiencyIndex.toFixed(0)}/100</div>
        <div class="kpi-change">eGrocery ${formatPercent(metrics.ecommerceShare)}</div>
      </div>
    </div>
  `;
}

function renderCharts(channelResults, metrics) {
  setTimeout(() => {
    renderBudgetChart(channelResults);
    renderChannelDetailsChart(channelResults);
  }, 100);
  
  return `
    <div class="charts-grid">
      <div class="chart-card">
        <h3 class="chart-title">Распределение бюджета</h3>
        <div class="chart-container">
          <canvas id="budgetChart"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <h3 class="chart-title">Детализация по каналам</h3>
        <div class="chart-container">
          <canvas id="channelDetailsChart"></canvas>
        </div>
      </div>
    </div>
  `;
}

function renderBudgetChart(channelResults) {
  const ctx = document.getElementById('budgetChart');
  if (!ctx) return;
  
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: channelResults.map(ch => ch.name),
      datasets: [{
        data: channelResults.map(ch => ch.budget),
        backgroundColor: colors.slice(0, channelResults.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 12,
            font: { size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              return context.label + ': ' + formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

function renderChannelDetailsChart(channelResults) {
  const ctx = document.getElementById('channelDetailsChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: channelResults.map(ch => ch.name),
      datasets: [{
        label: 'Бюджет',
        data: channelResults.map(ch => ch.budget),
        backgroundColor: '#1FB8CD'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => 'Бюджет: ' + formatCurrency(context.parsed.x)
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  });
}

function renderChannelTable(channelResults) {
  return `
    <div class="table-container">
      <h3 class="chart-title">Производительность по каналам</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Канал</th>
            <th>Бюджет</th>
            <th>Доля</th>
            <th>ROI</th>
            <th>Прогноз продаж</th>
            <th>Эффективность</th>
          </tr>
        </thead>
        <tbody>
          ${channelResults.map(ch => `
            <tr>
              <td><strong>${ch.name}</strong></td>
              <td>${formatCurrency(ch.budget)}</td>
              <td>${formatPercent(ch.share)}</td>
              <td>${formatPercent(ch.roi)}</td>
              <td>${formatCurrency(ch.revenue)}</td>
              <td><span class="efficiency-badge efficiency-${ch.efficiency}">${getEfficiencyLabel(ch.efficiency)}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getEfficiencyLabel(efficiency) {
  const labels = {
    excellent: 'Отлично',
    good: 'Хорошо',
    fair: 'Удовлетворительно',
    poor: 'Плохо'
  };
  return labels[efficiency] || efficiency;
}

function renderRecommendations(recommendations) {
  return `
    <div class="recommendations-card">
      <h3 class="recommendations-title">Рекомендации</h3>
      ${recommendations.map((rec, i) => `
        <div class="recommendation-item">
          <div class="recommendation-icon">💡</div>
          <div class="recommendation-text">${rec.text}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// Event handlers
function showSignIn() {
  appState.currentView = 'signin';
  render();
}

function showSignUp() {
  appState.currentView = 'signup';
  render();
}

function handleSignIn(e) {
  e.preventDefault();
  appState.user = { name: 'FMCG Менеджер', email: 'user@example.com' };
  appState.currentView = 'calculator';
  render();
}

function handleSignUp(e) {
  e.preventDefault();
  appState.user = { name: 'FMCG Менеджер', email: 'user@example.com' };
  appState.currentView = 'calculator';
  render();
}

function handleLogout() {
  appState.user = null;
  appState.currentView = 'landing';
  render();
}

function updateState(key, value) {
  appState[key] = value;
  render();
}

function updatePriority(type, value) {
  appState[`priority${type.charAt(0).toUpperCase() + type.slice(1)}`] = value;
  
  const total = appState.priorityAwareness + appState.priorityPerformance + appState.priorityBrand;
  if (total > 100) {
    const excess = total - 100;
    if (type !== 'awareness') appState.priorityAwareness = Math.max(0, appState.priorityAwareness - excess / 2);
    if (type !== 'performance') appState.priorityPerformance = Math.max(0, appState.priorityPerformance - excess / 2);
    if (type !== 'brand') appState.priorityBrand = Math.max(0, appState.priorityBrand - excess / 2);
  }
  
  render();
}

function toggleAccordion(id) {
  const acc = document.getElementById(id);
  if (acc) {
    acc.classList.toggle('open');
  }
}

function togglePlatform(platformId) {
  const index = appState.selectedPlatforms.indexOf(platformId);
  if (index > -1) {
    appState.selectedPlatforms.splice(index, 1);
    delete appState.platformBudgets[platformId];
  } else {
    appState.selectedPlatforms.push(platformId);
    appState.platformBudgets[platformId] = 10;
  }
  render();
}

function updatePlatformBudget(platformId, value) {
  appState.platformBudgets[platformId] = value;
  render();
}

function toggleChannel(channelId) {
  const index = appState.selectedChannels.indexOf(channelId);
  if (index > -1) {
    appState.selectedChannels.splice(index, 1);
    delete appState.channelBudgets[channelId];
  } else {
    appState.selectedChannels.push(channelId);
    appState.channelBudgets[channelId] = 10;
  }
  render();
}

function updateChannelBudget(channelId, value) {
  appState.channelBudgets[channelId] = value;
  render();
}

function handleCalculate() {
  const channelResults = calculateChannelResults(appState);
  const metrics = calculateOverallMetrics(channelResults);
  const recommendations = generateRecommendations(appState, channelResults, metrics);
  
  appState.results = {
    channelResults,
    metrics,
    recommendations
  };
  appState.calculated = true;
  
  render();
}

function applyScenario(type) {
  if (type === 'aggressive') {
    appState.selectedPlatforms = ['ozon', 'wb', 'yandex'];
    appState.platformBudgets = { ozon: 40, wb: 40, yandex: 20 };
    appState.budget = 20000000;
    appState.priorityPerformance = 70;
    appState.priorityAwareness = 20;
    appState.priorityBrand = 10;
  } else if (type === 'balanced') {
    appState.selectedPlatforms = ['ozon', 'wb', 'samokat', 'yandex'];
    appState.platformBudgets = { ozon: 30, wb: 30, samokat: 25, yandex: 15 };
    appState.budget = 15000000;
    appState.priorityPerformance = 50;
    appState.priorityAwareness = 30;
    appState.priorityBrand = 20;
  } else if (type === 'conservative') {
    appState.selectedPlatforms = ['ozon', 'wb'];
    appState.platformBudgets = { ozon: 50, wb: 50 };
    appState.budget = 10000000;
    appState.priorityPerformance = 40;
    appState.priorityAwareness = 40;
    appState.priorityBrand = 20;
  }
  
  render();
}

function exportResults() {
  alert('Функция экспорта в PDF будет доступна в финальной версии приложения. В текущей демо-версии данные можно скопировать вручную.');
}

// Main render
function render() {
  const app = document.getElementById('app');
  
  let content = '';
  switch (appState.currentView) {
    case 'landing':
      content = renderLanding();
      break;
    case 'signin':
      content = renderSignIn();
      break;
    case 'signup':
      content = renderSignUp();
      break;
    case 'calculator':
      content = renderCalculator();
      break;
    default:
      content = renderLanding();
  }
  
  app.innerHTML = content;
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  render();
});