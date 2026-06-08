// =========================================
// ОБЩИЕ ФУНКЦИИ (закладки, тосты, тема, счётчики, звёздочки, аккордеоны с отладкой)
// =========================================

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch (e) { return []; }
}
function saveBookmarks(bookmarks) { localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); }

function toggleBookmark(btn) {
  if (sessionStorage.getItem('admin_ignore') === 'true') return;
  const id = btn.dataset.articleId;
  const title = btn.dataset.articleTitle;
  if (!id || !title) return;
  let bookmarks = getBookmarks();
  const exists = bookmarks.find(b => b.id === id);
  if (exists) {
    bookmarks = bookmarks.filter(b => b.id !== id);
    btn.classList.remove('saved');
    btn.textContent = '🔖 В закладки';
    showToast('Удалено из закладок', 'info');
  } else {
    bookmarks.push({ id, title });
    btn.classList.add('saved');
    btn.textContent = '🔖 В закладках';
    showToast('Добавлено в закладки', 'bookmark');
  }
  saveBookmarks(bookmarks);
  if (typeof renderBookmarks === 'function') renderBookmarks();
}

function initBookmarkButtons() {
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    const id = btn.dataset.articleId;
    if (!id) return;
    const bookmarks = getBookmarks();
    if (bookmarks.find(b => b.id === id)) {
      btn.classList.add('saved');
      btn.textContent = '🔖 В закладках';
    }
  });
}

function showToast(message, type = 'info', duration = 2500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);z-index:10003;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(container);
  }
  const icons = { success:'✅', error:'❌', info:'💬', save:'💾', bookmark:'⭐' };
  const icon = icons[type] || icons.info;
  const toast = document.createElement('div');
  toast.style.cssText = `background:${type==='error'?'#e74c3c':'#2c3e50'};color:white;padding:12px 24px;border-radius:30px;font-size:14px;font-weight:500;opacity:0;transform:translateY(10px);transition:all 0.3s ease;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,0.25);display:flex;align-items:center;gap:8px;`;
  toast.textContent = `${icon} ${message}`;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity='1'; toast.style.transform='translateY(0)'; });
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateY(10px)'; setTimeout(() => toast.remove(),300); }, duration);
}

function applyTheme() {
  const isDark = localStorage.getItem('dark_theme') === 'true';
  document.documentElement.classList.toggle('dark', isDark);
}
applyTheme();

function acceptCookies() {
  localStorage.setItem('cookie_accepted', 'true');
  const banner = document.getElementById('cookieConsent');
  if (banner) banner.classList.add('hidden');
}
function initCookieBanner() {
  if (localStorage.getItem('cookie_accepted') === 'true') {
    const banner = document.getElementById('cookieConsent');
    if (banner) banner.classList.add('hidden');
  }
}

function incrementPageCounter() {
  if (sessionStorage.getItem('admin_ignore') === 'true') return;
  let count = localStorage.getItem('site_page_views');
  count = count ? parseInt(count)+1 : 1;
  localStorage.setItem('site_page_views', count);
}

function initReadingProgress() {
  const bar = document.getElementById('readingProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) bar.style.width = (winScroll / height)*100 + '%';
  });
}

function initScrollTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => { btn.classList.toggle('visible', window.scrollY > 500); });
  btn.addEventListener('click', () => { window.scrollTo({ top:0, behavior:'smooth' }); });
}

// --- АККОРДЕОНЫ (прямая инициализация с отладкой) ---
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  console.log('Найдено элементов .accordion-header:', headers.length);
  if (headers.length === 0) {
    console.warn('Не найдено ни одного .accordion-header. Проверьте HTML-разметку.');
    return;
  }

  headers.forEach((header, index) => {
    const body = header.nextElementSibling;
    if (!body || !body.classList.contains('accordion-body')) {
      console.warn(`Элемент #${index} не имеет следующего .accordion-body`, header);
      return;
    }

    // Удаляем старый обработчик, чтобы не дублировался
    header.removeEventListener('click', accordionClickHandler);
    header.addEventListener('click', accordionClickHandler);
    console.log(`Обработчик добавлен к элементу #${index}`, header.textContent.trim());
  });
}

function accordionClickHandler() {
  console.log('Клик по заголовку:', this.textContent.trim());
  const body = this.nextElementSibling;
  if (!body || !body.classList.contains('accordion-body')) {
    console.warn('Не найден .accordion-body для:', this);
    return;
  }

  const isOpen = body.classList.contains('open');
  console.log('Состояние до клика:', isOpen ? 'открыто' : 'закрыто');

  if (isOpen) {
    body.classList.remove('open');
    this.classList.remove('active');
    console.log('Закрыто');
  } else {
    body.classList.add('open');
    this.classList.add('active');
    console.log('Открыто');
  }
}

function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() { this.parentElement.classList.toggle('open'); });
  });
}

function initStarRatings() {
  document.querySelectorAll('.star-rating').forEach(widget => {
    const articleId = widget.dataset.articleId;
    if (!articleId) return;
    const stars = widget.querySelectorAll('.star');
    const textEl = widget.querySelector('.rating-text') || document.getElementById('ratingText-'+articleId);
    let saved = JSON.parse(localStorage.getItem('rating_'+articleId) || '{"value":0,"count":0,"voted":false}');
    function highlight(value) {
      stars.forEach(s => { s.classList.toggle('active', parseInt(s.dataset.value) <= value); });
    }
    function updateText() {
      if (textEl) textEl.textContent = saved.count > 0 ? `★ ${saved.value} (${saved.count} оценок)` : '(ещё нет оценок)';
    }
    stars.forEach(s => {
      s.addEventListener('mouseenter', () => highlight(parseInt(s.dataset.value)));
      s.addEventListener('mouseleave', () => highlight(saved.value));
      s.addEventListener('click', () => {
        if (saved.voted) return;
        if (sessionStorage.getItem('admin_ignore') === 'true') return;
        const newRating = parseInt(s.dataset.value);
        const total = saved.value * saved.count + newRating;
        saved.count += 1;
        saved.value = Math.round(total / saved.count);
        saved.voted = true;
        localStorage.setItem('rating_'+articleId, JSON.stringify(saved));
        highlight(saved.value);
        updateText();
      });
    });
    highlight(saved.value);
    updateText();
  });
}

function updateFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// --- ТЕХНИЧЕСКИЙ ПЕРЕРЫВ (пропускаем, если есть ?admin=1) ---
function checkMaintenance() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === '1') {
    sessionStorage.setItem('admin_bypass', 'true');
    return;
  }

  if (localStorage.getItem('maintenance_mode') !== 'true') return;

  const mainContent = document.querySelector('.landing');
  if (mainContent) mainContent.style.display = 'none';

  const msg = document.createElement('div');
  msg.id = 'maintenance-message';
  msg.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); color: white;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 99999; font-family: 'Roboto', sans-serif;
    text-align: center; padding: 20px;
  `;
  msg.innerHTML = `
    <h1 style="font-size: 3rem; margin-bottom: 1rem;">🔧</h1>
    <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Технический перерыв</h2>
    <p style="font-size: 1.2rem; opacity: 0.8;">Мы проводим технические работы.<br>Сайт будет доступен в ближайшее время.</p>
  `;
  document.body.appendChild(msg);
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
  checkMaintenance();
  initAccordions();        // ← теперь с консоль-логом
  initBookmarkButtons();
  initCookieBanner();
  initReadingProgress();
  initScrollTopButton();
  initFAQ();
  initStarRatings();
  incrementPageCounter();
  updateFooterYear();
});
