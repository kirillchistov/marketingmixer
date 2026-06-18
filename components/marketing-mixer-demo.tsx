"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CATEGORIES,
  DEFAULT_INPUT,
  RISK_MULTIPLIERS,
  calculateMediaMix,
  type BusinessCategoryKey,
  type ChannelKey,
  type MediaMixInput,
  type RiskLevel,
  type TimeHorizon,
} from "../lib/calculators/mediamix";

type Tab = "overview" | "marketplaces" | "egrocery" | "refine" | "sources";

const COLORS = ["#0f766e", "#2563eb", "#7c3aed", "#ea580c", "#16a34a", "#be123c", "#0891b2", "#4f46e5"];

const scenarioLabels = {
  pessimistic: "Пессимистичный",
  realistic: "Реалистичный",
  optimistic: "Оптимистичный",
};

export function MarketingMixerDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState("demo");
  const [password, setPassword] = useState("Demo.2026");
  const [accepted, setAccepted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [input, setInput] = useState<MediaMixInput>(DEFAULT_INPUT);
  const result = useMemo(() => calculateMediaMix(input), [input]);

  function handleLogin() {
    if (login === "demo" && password === "Demo.2026" && accepted) {
      setIsLoggedIn(true);
      setLoginError("");
      return;
    }

    setLoginError("Введите demo / Demo.2026 и примите условия демо.");
  }

  function updateInput<T extends keyof MediaMixInput>(key: T, value: MediaMixInput[T]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function updateFactor(key: keyof MediaMixInput["factors"], value: number) {
    setInput((current) => ({
      ...current,
      factors: {
        ...current.factors,
        [key]: value,
      },
    }));
  }

  function updateChannel(key: ChannelKey, value: number) {
    setInput((current) => ({
      ...current,
      currentMix: {
        ...current.currentMix,
        [key]: value,
      },
    }));
  }

  function exportCsv() {
    const rows = [
      ["channel", "type", "share", "budget", "roi", "attributedRevenue"],
      ...result.channels.map((channel) => [
        channel.name,
        channel.type,
        channel.share.toFixed(2),
        channel.budget.toFixed(0),
        channel.roi.toFixed(2),
        channel.attributedRevenue.toFixed(0),
      ]),
    ];
    const csv = rows.map((row) => row.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "marketingmixer-demo.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!isLoggedIn) {
    return (
      <main className="login-page">
        <section className="login-hero">
          <div className="eyebrow">Demo / Static Export</div>
          <h1>MarketingMixer</h1>
          <p>
            Независимый media mix forecast: атрибутированная выручка, бюджет, ROMI,
            диапазон результата и confidence score.
          </p>
          <div className="hero-grid">
            <MetricCard label="Главный сценарий" value="Media Mix" />
            <MetricCard label="Углубления" value="Marketplaces / eGrocery" />
            <MetricCard label="Доступ" value="demo / Demo.2026" />
          </div>
        </section>

        <section className="login-card">
          <h2>Вход в демо</h2>
          <label>
            Логин
            <input value={login} onChange={(event) => setLogin(event.target.value)} />
          </label>
          <label>
            Пароль
            <input value={password} type="password" onChange={(event) => setPassword(event.target.value)} />
          </label>
          <label className="checkbox">
            <input checked={accepted} type="checkbox" onChange={(event) => setAccepted(event.target.checked)} />
            <span>
              Принимаю демо-соглашение: сервис может использовать LLM в будущей серверной версии,
              а текущий статический прототип показывает только mock-сценарий без API-ключей.
            </span>
          </label>
          {loginError ? <div className="error">{loginError}</div> : null}
          <button className="primary-button" onClick={handleLogin}>
            Открыть dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="logo">MM</div>
          <h1>MarketingMixer</h1>
          <p>Демо-прогноз медиамикса</p>
        </div>
        <nav>
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            Media Mix
          </TabButton>
          <TabButton active={activeTab === "marketplaces"} onClick={() => setActiveTab("marketplaces")}>
            Marketplaces
          </TabButton>
          <TabButton active={activeTab === "egrocery"} onClick={() => setActiveTab("egrocery")}>
            eGrocery
          </TabButton>
          <TabButton active={activeTab === "refine"} onClick={() => setActiveTab("refine")}>
            Уточнить
          </TabButton>
          <TabButton active={activeTab === "sources"} onClick={() => setActiveTab("sources")}>
            Источники
          </TabButton>
        </nav>
        <button className="secondary-button" onClick={() => setIsLoggedIn(false)}>
          Выйти
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">Version 1 / Demo GHP</div>
            <h2>Общий media mix forecast</h2>
          </div>
          <button className="secondary-button" onClick={exportCsv}>
            Экспорт CSV
          </button>
        </header>

        <section className="kpi-grid">
          <MetricCard label="Атрибутированная выручка" value={formatCurrency(result.attributedRevenue)} helper={`${formatCurrency(result.range.low)} - ${formatCurrency(result.range.high)}`} />
          <MetricCard label="Бюджет" value={formatCurrency(result.budget)} helper={`${input.periodMonths} мес.`} />
          <MetricCard label="ROMI" value={`${result.romi.toFixed(0)}%`} helper={`Confidence ${result.confidenceScore}/100`} />
        </section>

        <section className="content-grid">
          <Panel title="Калибровка прогноза">
            <Control label="Категория">
              <select value={input.category} onChange={(event) => updateInput("category", event.target.value as BusinessCategoryKey)}>
                {CATEGORIES.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Control>
            <Control label="Бюджет за период">
              <input type="number" value={input.budget} onChange={(event) => updateInput("budget", Number(event.target.value))} />
            </Control>
            <Control label="Выручка за период">
              <input type="number" value={input.brandRevenue} onChange={(event) => updateInput("brandRevenue", Number(event.target.value))} />
            </Control>
            <Control label={`Доля онлайн-продаж: ${input.onlineShare}%`}>
              <input type="range" min="0" max="100" value={input.onlineShare} onChange={(event) => updateInput("onlineShare", Number(event.target.value))} />
            </Control>
            <Control label="Риск">
              <select value={input.riskLevel} onChange={(event) => updateInput("riskLevel", event.target.value as RiskLevel)}>
                {Object.entries(RISK_MULTIPLIERS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name}
                  </option>
                ))}
              </select>
            </Control>
            <Control label="Горизонт">
              <select value={input.timeHorizon} onChange={(event) => updateInput("timeHorizon", event.target.value as TimeHorizon)}>
                <option value="short">1-3 месяца</option>
                <option value="medium">до 1 года</option>
                <option value="long">2+ года</option>
              </select>
            </Control>
          </Panel>

          {activeTab === "overview" ? (
            <OverviewTab result={result} updateChannel={updateChannel} />
          ) : null}
          {activeTab === "marketplaces" ? <MarketplaceTab result={result} /> : null}
          {activeTab === "egrocery" ? <EgroceryTab /> : null}
          {activeTab === "refine" ? (
            <RefineTab input={input} updateInput={updateInput} updateFactor={updateFactor} />
          ) : null}
          {activeTab === "sources" ? <SourcesTab notes={result.sourceNotes} warnings={result.sanityWarnings} dataQuality={result.dataQuality} /> : null}
        </section>
      </section>
    </main>
  );
}

function OverviewTab({
  result,
  updateChannel,
}: {
  result: ReturnType<typeof calculateMediaMix>;
  updateChannel: (key: ChannelKey, value: number) => void;
}) {
  return (
    <div className="main-panels">
      <Panel title="Распределение бюджета">
        <div className="chart">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={result.channels} dataKey="budget" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={2}>
                {result.channels.map((channel, index) => (
                  <Cell key={channel.key} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="channel-list">
          {result.channels.map((channel) => (
            <label key={channel.key} className="channel-row">
              <span>{channel.name}</span>
              <input min="0" max="60" type="range" value={Math.round(channel.share)} onChange={(event) => updateChannel(channel.key, Number(event.target.value))} />
              <strong>{channel.share.toFixed(1)}%</strong>
            </label>
          ))}
        </div>
      </Panel>

      <Panel title="Сценарии">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={result.scenarios}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tickFormatter={(value) => formatScenarioName(String(value))} />
            <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1_000_000)}м`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(value) => formatScenarioName(String(value))} />
            <Bar dataKey="attributedRevenue" fill="#0f766e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="scenario-grid">
          {result.scenarios.map((scenario) => (
            <div key={scenario.name} className="mini-card">
              <span>{scenarioLabels[scenario.name]}</span>
              <strong>{scenario.romi.toFixed(0)}% ROMI</strong>
              <small>confidence {scenario.confidenceScore}/100</small>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function MarketplaceTab({ result }: { result: ReturnType<typeof calculateMediaMix> }) {
  const rows = result.channels.filter((channel) => channel.type === "marketplace" || channel.type === "retailMedia");

  return (
    <Panel title="Углубление: маркетплейсы и retail media">
      <p className="muted">Эта вкладка сохраняет текущие marketplace/eGrocery калькуляторы как углубление поверх общего media mix.</p>
      <div className="table">
        {rows.map((channel) => (
          <div key={channel.key} className="table-row">
            <span>{channel.name}</span>
            <strong>{formatCurrency(channel.budget)}</strong>
            <span>{channel.roi.toFixed(2)} ROI</span>
            <span>{formatCurrency(channel.commission)} комиссия</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function EgroceryTab() {
  return (
    <Panel title="Углубление: eGrocery">
      <p className="muted">
        В этой версии eGrocery представлен как следующий слой детализации. Рабочий прототип сохранен в `index-mmm.html`,
        а перенос его логики в React/TypeScript запланирован после стабилизации общего media mix.
      </p>
      <div className="insight-list">
        <div>Будет перенесено: OSA, рейтинг, отзывы, индекс цены, промо, комиссии платформ.</div>
        <div>Платформы: Ozon, Wildberries, Яндекс Маркет, Самокат, Лавка и другие eGrocery игроки.</div>
        <div>Выходы: ROAS, прогноз продаж, net effect, рекомендации по дистрибуции.</div>
      </div>
    </Panel>
  );
}

function RefineTab({
  input,
  updateInput,
  updateFactor,
}: {
  input: MediaMixInput;
  updateInput: <T extends keyof MediaMixInput>(key: T, value: MediaMixInput[T]) => void;
  updateFactor: (key: keyof MediaMixInput["factors"], value: number) => void;
}) {
  return (
    <Panel title="Уточнить прогноз">
      <p className="muted">
        Вместо пассивного дисклеймера пользователь получает путь к уточнению модели: ретро-данные и рамки весов для факторов вне мониторинга.
      </p>
      <label className="checkbox">
        <input checked={input.hasRetroData} type="checkbox" onChange={(event) => updateInput("hasRetroData", event.target.checked)} />
        <span>Есть ретро-данные в формате: период, канал, бюджет, выручка, маржа, промо, сезонность</span>
      </label>
      <Control label={`Заполненность данных: ${input.dataCompleteness}%`}>
        <input type="range" min="0" max="100" value={input.dataCompleteness} onChange={(event) => updateInput("dataCompleteness", Number(event.target.value))} />
      </Control>
      {Object.entries(input.factors).map(([key, value]) => (
        <Control key={key} label={`${factorLabels[key as keyof MediaMixInput["factors"]]}: ${value}`}>
          <input type="range" min="0" max="100" value={value} onChange={(event) => updateFactor(key as keyof MediaMixInput["factors"], Number(event.target.value))} />
        </Control>
      ))}
    </Panel>
  );
}

function SourcesTab({ notes, warnings, dataQuality }: { notes: string[]; warnings: string[]; dataQuality: string[] }) {
  return (
    <Panel title="Источники, качество данных и ограничения">
      <div className="insight-list">
        {[...dataQuality, ...notes, ...warnings].map((note) => (
          <div key={note}>{note}</div>
        ))}
      </div>
    </Panel>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="control">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button className={active ? "tab-button active" : "tab-button"} onClick={onClick}>
      {children}
    </button>
  );
}

function formatCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} млрд ₽`;
  }

  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} млн ₽`;
  }

  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function formatScenarioName(value: string) {
  return scenarioLabels[value as keyof typeof scenarioLabels] ?? value;
}

const factorLabels: Record<keyof MediaMixInput["factors"], string> = {
  distribution: "Дистрибуция",
  margin: "Фронт/бэк-маржа",
  promoPressure: "Промо-давление",
  seasonality: "Сезонность",
  salesOps: "Продажи и операционка",
};
