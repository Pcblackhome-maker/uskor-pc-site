// =========================================
// ОБЩИЕ ФУНКЦИИ (закладки, тосты, тема, счётчики, звёздочки, аккордеоны)
// =========================================

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch (e) { return []; }
}
function saveBookmarks(bookmarks) { localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); }

function toggleBookmark(btn) {
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

function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const body = this.nextElementSibling;
      if (!body || !body.classList.contains('accordion-body')) return;
      const isOpen = body.classList.contains('open');
      if (isOpen) { body.classList.remove('open'); this.classList.remove('active'); }
      else { body.classList.add('open'); this.classList.add('active'); }
    });
  });
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

function highlightCurrentMenuItem() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.site-header nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\//, ''))) link.classList.add('active');
  });
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
  initBookmarkButtons();
  initCookieBanner();
  initReadingProgress();
  initScrollTopButton();
  initAccordions();
  initFAQ();
  initStarRatings();
  incrementPageCounter();
  updateFooterYear();
  highlightCurrentMenuItem();
});
