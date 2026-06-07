// =========================================
// ОБЩИЕ ФУНКЦИИ (закладки, тосты, тема, счётчики, звёздный рейтинг)
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
    showToast('Удалено из закладок', 'info');
  } else {
    bookmarks.push({ id, title });
    btn.classList.add('saved');
    btn.textContent = '🔖 В закладках';
    showToast('Добавлено в закладки', 'bookmark');
  }
  
  saveBookmarks(bookmarks);
  
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
function showToast(message, type = 'info', duration = 2500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); z-index:10003; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: '💬',
    save: '💾',
    bookmark: '⭐'
  };
  const icon = icons[type] || icons.info;

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${type === 'error' ? '#e74c3c' : '#2c3e50'};
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    white-space: nowrap;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  toast.textContent = `${icon} ${message}`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
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

// --- АККОРДЕОНЫ (плавное открытие) ---
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const body = this.nextElementSibling;
      if (!body || !body.classList.contains('accordion-body')) return;

      const isOpen = body.classList.contains('open');
      
      if (isOpen) {
        body.classList.remove('open');
        this.classList.remove('active');
      } else {
        body.classList.add('open');
        this.classList.add('active');
      }
    });
  });
}

// --- FAQ (отдельный обработчик) ---
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() {
      this.parentElement.classList.toggle('open');
    });
  });
}

// --- ЗВЁЗДОЧНЫЙ РЕЙТИНГ ---
function initStarRatings() {
  document.querySelectorAll('.star-rating').forEach(widget => {
    const articleId = widget.dataset.articleId;
    if (!articleId) return;

    const stars = widget.querySelectorAll('.star');
    const textEl = document.getElementById('ratingText-' + articleId) || widget.querySelector('.rating-text');

    // Загружаем сохранённый рейтинг
    let saved = JSON.parse(localStorage.getItem('rating_' + articleId) || '{"value":0,"count":0}');
    
    function highlight(value) {
      stars.forEach(s => {
        const v = parseInt(s.dataset.value);
        s.classList.toggle('active', v <= value);
      });
    }

    function updateText() {
      if (textEl) {
        textEl.textContent = saved.count > 0 
          ? `★ ${saved.value} (${saved.count} оценок)`
          : '(ещё нет оценок)';
      }
    }

    // Подсвечиваем при наведении
    stars.forEach(s => {
      s.addEventListener('mouseenter', () => highlight(parseInt(s.dataset.value)));
      s.addEventListener('mouseleave', () => highlight(saved.value));

      s.addEventListener('click', () => {
        const newRating = parseInt(s.dataset.value);
        if (newRating === saved.value) return; // не даём переголосовать

        // Обновляем среднюю оценку
        const total = saved.value * saved.count + newRating;
        saved.count += 1;
        saved.value = Math.round(total / saved.count);
        saved.voted = true;

        localStorage.setItem('rating_' + articleId, JSON.stringify(saved));
        highlight(saved.value);
        updateText();

        // Обновляем микроразметку
        updateRatingSchema(articleId, saved.value, saved.count);
      });
    });

    // Инициализация
    highlight(saved.value);
    updateText();
    // Установка начальной микроразметки при загрузке
    updateRatingSchema(articleId, saved.value, saved.count);
  });
}

// Функция для динамической вставки/обновления AggregateRating в JSON-LD
function updateRatingSchema(articleId, ratingValue, reviewCount) {
  // Ищем существующий скрипт с микроразметкой или создаём новый
  let script = document.querySelector('script[type="application/ld+json"][data-rating-id="' + articleId + '"]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-rating-id', articleId);
    document.head.appendChild(script);
  }

  const pageUrl = window.location.href;
  const articleTitle = document.title.replace(' | Ускорь ПК', '');
  const articleDesc = document.querySelector('meta[name="description"]')?.content || '';

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleTitle,
    "description": articleDesc,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "bestRating": "5",
      "reviewCount": reviewCount
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "author": {
      "@type": "Person",
      "name": "Игорь"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ускорь ПК",
      "logo": {
        "@type": "ImageObject",
        "url": "https://uskor-pc.ru/favicon.ico"
      }
    }
  };

  script.textContent = JSON.stringify(schema);
}

// --- АВТОМАТИЧЕСКИЙ ГОД В ФУТЕРЕ ---
function updateFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// --- ИНИЦИАЛИЗАЦИЯ ВСЕГО ПРИ ЗАГРУЗКЕ ---
document.addEventListener('DOMContentLoaded', () => {
  initBookmarkButtons();
  initCookieBanner();
  initReadingProgress();
  initScrollTopButton();
  initAccordions();
  initFAQ();
  initStarRatings();          // ← звёздочки теперь работают
  incrementPageCounter();
  updateFooterYear();
  // Автоматическая подсветка текущего пункта меню
(function() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.site-header nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\//, ''))) {
      link.classList.add('active');
    }
  });
})();
  // Плавный скролл к форме
document.querySelectorAll('a[href*="#contact-form"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
});
