  const THEME_KEY = 'ph-theme';
  type Theme = 'light' | 'dark';

  function applyTheme(theme: Theme) {
    const body = document.body;
    const toggleBtn = document.querySelector<HTMLButtonElement>('#theme-toggle');
    const icon = document.querySelector<HTMLSpanElement>('.theme-toggle-icon');

    if (theme === 'dark') {
        body.classList.add('theme-dark');
        toggleBtn?.setAttribute('aria-pressed', 'true');
        if (icon) icon.textContent = '☀'; // показываем солнце — можно переключиться на светлую
    } else {
        body.classList.remove('theme-dark');
        toggleBtn?.setAttribute('aria-pressed', 'false');
        if (icon) icon.textContent = '🌙'; // показываем луну — можно включить тёмную
    }

    localStorage.setItem(THEME_KEY, theme);
    }

    function initTheme() {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const preferred: Theme = stored ?? 'light'; // по умолчанию светлая
    applyTheme(preferred);

    const toggleBtn = document.querySelector<HTMLButtonElement>('#theme-toggle');
    toggleBtn?.addEventListener('click', () => {
        const current = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
        const next: Theme = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
  }


export function initLanding() {
  initTheme();

  const loginSection = document.getElementById('login');
  const featuresSection = document.getElementById('features');

  const handleScrollTo = (el: HTMLElement | null) => {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroCtaDemo = document.querySelector<HTMLButtonElement>(
    '[data-cta="demo"]'
  );
  const heroCtaFeatures = document.querySelector<HTMLButtonElement>(
    '[data-cta="features"]'
  );

  heroCtaDemo?.addEventListener('click', () => handleScrollTo(loginSection));
  heroCtaFeatures?.addEventListener('click', () =>
    handleScrollTo(featuresSection)
  );

  const form = document.querySelector<HTMLFormElement>('#login-form');
  const loginInput = document.querySelector<HTMLInputElement>('#login-username');
  const passInput = document.querySelector<HTMLInputElement>('#login-password');
  const errorEl = document.querySelector<HTMLDivElement>('#login-error');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = loginInput?.value.trim() ?? '';
    const pass = passInput?.value.trim() ?? '';

    if (login === 'demo1' && pass === 'ABC123Demodemo') {
      if (errorEl) errorEl.style.display = 'none';
      window.location.href = '/dashboard.html';
    } else {
      if (errorEl) errorEl.style.display = 'block';
    }
  });
}
