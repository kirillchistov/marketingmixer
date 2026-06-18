(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const e of s)if(e.type==="childList")for(const l of e.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const e={};return s.integrity&&(e.integrity=s.integrity),s.referrerPolicy&&(e.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?e.credentials="include":s.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function t(s){if(s.ep)return;s.ep=!0;const e=a(s);fetch(s.href,e)}})();const v="ph-theme";function n(d){const i=document.body,a=document.querySelector("#theme-toggle"),t=document.querySelector(".theme-toggle-icon");d==="dark"?(i.classList.add("theme-dark"),a?.setAttribute("aria-pressed","true"),t&&(t.textContent="☀")):(i.classList.remove("theme-dark"),a?.setAttribute("aria-pressed","false"),t&&(t.textContent="🌙")),localStorage.setItem(v,d)}function g(){const i=localStorage.getItem(v)??"light";n(i),document.querySelector("#theme-toggle")?.addEventListener("click",()=>{const s=(document.body.classList.contains("theme-dark")?"dark":"light")==="dark"?"light":"dark";n(s)})}function m(){g();const d=document.getElementById("login"),i=document.getElementById("features"),a=o=>{o&&o.scrollIntoView({behavior:"smooth"})},t=document.querySelector('[data-cta="demo"]'),s=document.querySelector('[data-cta="features"]');t?.addEventListener("click",()=>a(d)),s?.addEventListener("click",()=>a(i));const e=document.querySelector("#login-form"),l=document.querySelector("#login-username"),p=document.querySelector("#login-password"),c=document.querySelector("#login-error");e?.addEventListener("submit",o=>{o.preventDefault();const u=l?.value.trim()??"",h=p?.value.trim()??"";u==="demo1"&&h==="ABC123Demodemo"?(c&&(c.style.display="none"),window.location.href="/dashboard.html"):c&&(c.style.display="block")})}const r=document.querySelector("#app");r&&(r.innerHTML=`
    <div class="page">
      <div class="wrapper">
        <header>
          <div class="logo">
            <div class="logo-mark">STIDD</div>
            <div>
              <div class="logo-text-main">Stindex Demo Dashboard</div>
              <div class="logo-text-sub">Оборачиваемость стока в сетях</div>
            </div>
          </div>
          <div class="nav-right">
            <div class="nav-note">
              <div>Экосистема аналитики для брендов</div>
              <div>Данные по дистрибуции, ценам и промо в одной точке</div>
            </div>
            <button
              class="theme-toggle"
              id="theme-toggle"
              type="button"
              aria-label="Переключить тему"
              aria-pressed="false"
            >
              <span class="theme-toggle-icon" aria-hidden="true">🌙</span>
            </button>
          </div>            
        </header>

        <main>
          <!-- HERO -->
          <section class="hero" id="top">
            <div>
              <div class="badge">
                <span class="badge-dot"></span>
                <span>Демо-доступ к дашборду оборачиваемости</span>
              </div>
              <h1 class="hero-title">
                Дашборд оборачиваемости товарного запаса<br />
                <span>для сетей и брендов</span>
              </h1>
              <p class="hero-subtitle">
                Видите оборачиваемость по каждой точке, бренду и SKU, находите неликвиды и зоны дефицита, управляете дистрибуцией и промо на основе данных, а не файлов из разных источников.
              </p>

              <div class="hero-bullets">
                <div class="hero-bullet">
                  <div class="hero-bullet-icon">↑</div>
                  <div>Рост sell-out за счет оптимизации запасов и снятия «мертвых» остатков по точкам и сетям.</div>
                </div>
                <div class="hero-bullet">
                  <div class="hero-bullet-icon">⚡</div>
                  <div>Быстрая оценка оборачиваемости по периодам: день, неделя, месяц, с группами 0–1–2–4–8+ недель и выделением точек без продаж.</div>
                </div>
                <div class="hero-bullet">
                  <div class="hero-bullet-icon">📡</div>
                  <div>Единая витрина данных с фильтрами по сети, региону, рынку, бренду, корпорации и SKU для разных ролей команды.</div>
                </div>
              </div>

              <div class="hero-cta">
                <button class="btn-primary" onclick="document.getElementById('login').scrollIntoView({behavior:'smooth'})">
                  <span>Открыть демо-доступ</span> →
                </button>
                <button class="btn-secondary-link" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">
                  Какие задачи решает
                </button>
              </div>
              <div class="hero-meta">
                <strong>Для коммерческих и маркетинг директоров, бизнес-аналитиков.</strong> Подходит для сетей, локальных брендов и крупных промо-проектов.
              </div>
            </div>

            <div class="hero-visual" aria-hidden="true">
              <div class="hero-main-shot">
                <div class="hero-tagline">
                  <div class="hero-tag-dot"></div>
                  Живая картинка стока и продаж по 40 000+ точек
                </div>
                <img src="https://static.tildacdn.com/tild6161-6562-4366-a539-313462636635/1.png" alt="Скриншот дашборда оборачиваемости товарного запаса" />
              </div>
              <div class="hero-footnote">
                Пример интерфейса дашборда: распределение точек по группам оборачиваемости, запас в неделях и объем «замороженных» средств на полке.
              </div>
            </div>
          </section>

          <!-- ПРОДУКТ И КЛЮЧЕВЫЕ МЕТРИКИ -->
          <section class="section" id="features">
            <div class="section-heading">
              <div>
                <h2 class="section-title">Что показывает дашборд оборачиваемости</h2>
                <p class="section-subtitle">
                  Продукт объединяет данные продаж, стока, дистрибуции и промо, чтобы вы управляли товарным запасом по сетям и регионам в режиме близком к реальному времени.
                </p>
              </div>
            </div>

            <div class="grid-2">
              <article class="card">
                <div class="card-header">
                  <h3 class="card-title">Глубокая аналитика стока и оборачиваемости</h3>
                  <span class="pill">Stock Index logic</span>
                </div>
                <div class="card-body">
                  Дашборд рассчитывает оборачиваемость по каждой точке, бренду и SKU, группирует точки в интервалы 0–1–2–4–8+ недель и отдельно выделяет точки с наличием, но без продаж за период.
                  <ul class="card-list">
                    <li><span class="card-dot"></span><span>Группы оборачиваемости по точке, сети, региону, бренду и корпорации.</span></li>
                    <li><span class="card-dot"></span><span>Распределение точек по группам, доля в штучном выражении и по весу товарного запаса.</span></li>
                    <li><span class="card-dot"></span><span>Динамика изменения распределения во времени: текущие и прошлые месяцы — по неделям, далее — помесячно.</span></li>
                  </ul>
                  <div class="kpi-strip">
                    <div class="kpi-item">
                      <div class="kpi-label">Горизонт оборачиваемости</div>
                      <div class="kpi-value">0–8+ нед.<span>группы</span></div>
                    </div>
                    <div class="kpi-item">
                      <div class="kpi-label">Разрезы аналитики</div>
                      <div class="kpi-value">Точка, сеть<span>регион, бренд, SKU</span></div>
                    </div>
                  </div>
                  <p class="tagline">Вместо агрегированных отчетов по сети — живая картина до уровня отдельной точки и SKU.</p>
                </div>
              </article>

              <article class="card">
                <div class="card-header">
                  <h3 class="card-title">Коммерческие решения на основе данных</h3>
                  <span class="pill">Data‑driven решения</span>
                </div>
                <div class="card-body">
                  Дашборд помогает находить деньги, которые «застряли на полке», предотвращать дефицит и выстраивать переговорную позицию с сетями на основе фактов.
                  <div class="benefits-grid" style="margin-top:8px;">
                    <div class="benefit">
                      <div class="benefit-label">Коммерческий директор</div>
                      <div class="benefit-title">Где заморожены бюджеты</div>
                      <div>Видите, в каких сетях и регионах запасы выходят за целевые коридоры и сколько денег лежит без движения.</div>
                      <div class="benefit-kpi">Фокус на сетях с max запасом и низкой оборачиваемостью.</div>
                    </div>
                    <div class="benefit">
                      <div class="benefit-label">Маркетинг и трейд</div>
                      <div class="benefit-title">Где усиливать активность</div>
                      <div>Сопоставляете промо-активность, наличие и оборачиваемость, быстро находите точки перегрева и недоохвата.</div>
                      <div class="benefit-kpi">Промо там, где есть товар и потенциал продаж.</div>
                    </div>
                    <div class="benefit">
                      <div class="benefit-label">Аналитики</div>
                      <div class="benefit-title">Единая витрина данных</div>
                      <div>Снимаете нагрузку с команды: все ключевые метрики по запасу и продажам собираются и агрегируются автоматически.</div>
                      <div class="benefit-kpi">Меньше Excel, больше управленческих выводов.</div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <!-- СКРИНШОТЫ / БЛОК О ПРОДУКТЕ -->
          <section class="section" id="screens">
            <div class="section-heading">
              <div>
                <h2 class="section-title">Как выглядит аналитика для вашей команды</h2>
                <p class="section-subtitle">
                  Дашборд построен вокруг логики оборачиваемости и дистрибуции: четыре ключевых экрана помогают быстро оценить картину и провалиться в детали по сети, бренду или SKU.
                </p>
              </div>
            </div>

            <div class="grid-2">
              <article class="card">
                <div class="card-header">
                  <h3 class="card-title">1. Картина по бренду и корпорации</h3>
                </div>
                <div class="card-body">
                  <p>Распределение точек по группам оборачиваемости в разрезе бренда и корпорации: где товар вращается быстро, а где зависает на полке.</p>
                  <div style="border-radius:12px;overflow:hidden;margin-top:10px;border:1px solid rgba(55,65,81,.9);">
                    <img src="https://static.tildacdn.com/tild3366-3333-4365-b066-643834316432/2.png" alt="Распределение точек по группам оборачиваемости по брендам" />
                  </div>
                  <p class="tagline">Помогает приоритизировать бренды и сети по потенциалу роста и рискам неликвидов.</p>
                </div>
              </article>

              <article class="card">
                <div class="card-header">
                  <h3 class="card-title">2. Срез по сети и региону</h3>
                </div>
                <div class="card-body">
                  <p>Распределение оборачиваемости внутри сети и по регионам, с фильтрами по адресным рынкам, брендам и SKU.</p>
                  <div style="border-radius:12px;overflow:hidden;margin-top:10px;border:1px solid rgba(55,65,81,.9);">
                    <img src="https://static.tildacdn.com/tild6666-3337-4936-b662-663566316334/3.png" alt="Распределение оборачиваемости внутри сети и региона" />
                  </div>
                  <p class="tagline">Вы быстро видите, какие регионы требуют корректировки поставок или промо-поддержки.</p>
                </div>
              </article>
            </div>

            <div style="margin-top:16px;" class="grid-2">
              <article class="card">
                <div class="card-header">
                  <h3 class="card-title">3. Вес товарного запаса по группам</h3>
                </div>
                <div class="card-body">
                  <p>Распределение веса товарного запаса (в рублях) по группам оборачиваемости — не просто количество точек, а объем денег в каждой группе.</p>
                  <div style="border-radius:12px;overflow:hidden;margin-top:10px;border:1px solid rgba(55,65,81,.9);">
                    <img src="https://static.tildacdn.com/tild3631-6435-4832-b039-363435656262/4.png" alt="Распределение веса товарного запаса по группам" />
                  </div>
                  <p class="tagline">Показывает, где сосредоточены основные риски заморозки средств и неликвидов.</p>
                </div>
              </article>

              <article class="card">
                <div class="card-header">
                  <h3 class="card-title">4. Динамика во времени</h3>
                </div>
                <div class="card-body">
                  <p>Динамика распределения точек по группам оборачиваемости по месяцам и неделям, чтобы отслеживать эффект акций и управленческих решений.</p>
                  <div style="border-radius:12px;overflow:hidden;margin-top:10px;border:1px solid rgba(55,65,81,.9);">
                    <img src="https://static.tildacdn.com/tild6161-6562-4366-a539-313462636635/1.png" alt="Динамика распределения точек по группам оборачиваемости" />
                  </div>
                  <p class="tagline">Позволяет быстро увидеть, где меры сработали, а где оборачиваемость не изменилась.</p>
                </div>
              </article>
            </div>
          </section>

          <!-- ФОРМА ЛОГИНА / ДЕМО-ДОСТУП -->
          <section class="section" id="login">
            <div class="section-heading">
              <div>
                <h2 class="section-title">Демо‑доступ к дашборду оборачиваемости</h2>
                <p class="section-subtitle">
                  Откройте интерактивный дашборд, чтобы посмотреть реальные сценарии работы: фильтрацию по сетям и регионам, распределение запасов по группам и детализацию до уровня точки.
                </p>
              </div>
            </div>

            <div class="split">
              <div>
                <h3 style="font-size:15px;font-weight:520;margin-bottom:6px;">Что вы увидите в демо‑версии</h3>
                <ul class="list-check">
                  <li><span class="check-icon">✔</span><span>Распределение точек по группам оборачиваемости 0–1–2–4–8+ недель и отдельный слой точек с наличием, но без продаж.</span></li>
                  <li><span class="check-icon">✔</span><span>Доля точек и вес товарного запаса по группам — для быстрого поиска неликвидов и зон риска.</span></li>
                  <li><span class="check-icon">✔</span><span>Разрезы по сети, региону, бренду, корпорации, SKU и адресным рынкам.</span></li>
                  <li><span class="check-icon">✔</span><span>Динамику изменения оборачиваемости для текущего и прошлого месяца по неделям, а также историю по месяцам.</span></li>
                </ul>
                <p class="notice">
                  Демо доступно в браузере, без установки ПО и интеграций. После логина вы сразу попадаете в интерфейс дашборда.
                </p>
              </div>

              <aside class="login-card" aria-label="Форма входа в демо-версию дашборда">
                <div class="login-title">Вход в демо‑дашборд</div>
                <div class="login-sub">Используйте тестовые реквизиты, чтобы посмотреть дашборд без ограничений по функционалу.</div>

                <form class="login-form" onsubmit="handleLogin(event)">
                  <div class="field">
                    <label for="login-username">Логин</label>
                    <input id="login-username" type="text" name="username" placeholder="demo1" autocomplete="username" required />
                  </div>
                  <div class="field">
                    <label for="login-password">Пароль</label>
                    <input id="login-password" type="password" name="password" placeholder="Пароль" autocomplete="current-password" required />
                  </div>
                  <button type="submit" class="login-button">
                    <span>Войти в демо</span> →
                  </button>
                  <div id="login-error" class="login-error">Неверный логин или пароль. Попробуйте еще раз.</div>
                </form>

                <div class="login-hint">
                  Доступ в демо по запросу
                </div>
              </aside>
            </div>
          </section>

          <!-- КОМУ ПОЛЕЗЕН ПРОДУКТ -->
          <section class="section" id="roles">
            <div class="section-heading">
              <div>
                <h2 class="section-title">Для кого создан этот дашборд</h2>
                <p class="section-subtitle">
                  Решение закрывает ключевые запросы коммерческих, маркетинга и аналитики в отрасли: управление дистрибуцией, оптимизация запасов и оценка эффективности промо.
                </p>
              </div>
            </div>

            <div class="use-cases-grid">
              <article class="use-case">
                <div class="use-case-role">Коммерческий директор</div>
                <div class="use-case-title">Контроль дистрибуции и запасов</div>
                <div>Быстро видите, где оборачиваемость опускается ниже целевых значений, в каких сетях и регионах запасы избыточны, а где — риск дефицита.</div>
              </article>

              <article class="use-case">
                <div class="use-case-role">Маркетинг и трейд‑маркетинг</div>
                <div class="use-case-title">Связка промо и наличия</div>
                <div>Планируете активности и мотивации так, чтобы промо‑давление совпадало с наличием товара, а не вело к out‑of‑stock или неликвидам.</div>
              </article>

              <article class="use-case">
                <div class="use-case-role">Команда аналитики</div>
                <div class="use-case-title">Единый источник правды</div>
                <div>Собираете и агрегируете данные один раз, а дальше работаете с витриной: фильтры по сетям, брендам, SKU и рынкам доступны всем стейкхолдерам.</div>
              </article>

              <article class="use-case">
                <div class="use-case-role">Топ‑менеджмент</div>
                <div class="use-case-title">Прозрачная связь инвестиций и результата</div>
                <div>Видите, как изменения в дистрибуции, цене и промо отражаются на sell‑out и оборачиваемости, и можете быстро корректировать стратегию.</div>
              </article>
            </div>
          </section>
        </main>
      </div>

      <footer>
        <div class="footer-inner">
          <div>© 2026 Stindex Demo Dashboard. Аналитика оборачиваемости для сетей и брендов.</div>
          <div>Демо‑доступ по запросу.</div>
        </div>
      </footer>
    </div>
  `);m();
