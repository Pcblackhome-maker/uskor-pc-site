// =========================================
// ОБЩИЕ ФУНКЦИИ (закладки, тосты, тема, счётчики)
// =========================================

// --- ЗАКЛАДКИ ---
function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]');
  } catch (e) {
    return [];
  }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

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
    showToast('Удалено из закладок');
  } else {
    bookmarks.push({ id, title });
    btn.classList.add('saved');
    btn.textContent = '🔖 В закладках';
    showToast('Добавлено в закладки');
  }
  
  saveBookmarks(bookmarks);
  
  // Обновляем виджет закладок на главной, если он есть
  if (typeof renderBookmarks === 'function') {
    renderBookmarks();
  }
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

// --- ТОСТЫ (всплывающие уведомления) ---
function showToast(message, duration = 2500) {
  // Ищем или создаём контейнер для тостов
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); z-index:10003; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = message;
  toast.style.cssText = 'background:#333; color:white; padding:10px 20px; border-radius:20px; font-size:14px; opacity:0; transition:opacity 0.3s; white-space:nowrap;';
  container.appendChild(toast);
  
  // Показываем
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });
  
  // Убираем через duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --- ТЁМНАЯ ТЕМА (мгновенное применение) ---
function applyTheme() {
  const isDark = localStorage.getItem('dark_theme') === 'true';
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('dark_theme', isDark);
  return isDark;
}

// Применяем тему сразу (до загрузки контента)
applyTheme();

// --- КУКИ-БАННЕР ---
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

// --- СЧЁТЧИК ПОСЕЩЕНИЙ СТРАНИЦЫ ---
function incrementPageCounter() {
  let count = localStorage.getItem('site_page_views');
  count = count ? parseInt(count) + 1 : 1;
  localStorage.setItem('site_page_views', count);
  return count;
}

// --- ПРОГРЕСС ЧТЕНИЯ ---
function initReadingProgress() {
  const bar = document.getElementById('readingProgress');
  if (!bar) return;
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      bar.style.width = (winScroll / height) * 100 + '%';
    }
  });
}

// --- КНОПКА "НАВЕРХ" ---
function initScrollTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    btn.classList.toggle('visible', winScroll > 500);
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- FAQ (аккордеон) ---
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() {
      this.parentElement.classList.toggle('open');
    });
  });
}

// --- ИНИЦИАЛИЗАЦИЯ ВСЕГО ПРИ ЗАГРУЗКЕ ---
document.addEventListener('DOMContentLoaded', () => {
  initBookmarkButtons();
  initCookieBanner();
  initReadingProgress();
  initScrollTopButton();
  initFAQ();
  incrementPageCounter();
});
