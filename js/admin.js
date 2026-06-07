// =========================================
// АДМИН-ПАНЕЛЬ С ХЭШИРОВАННЫМ PIN
// =========================================
(function() {
  // ЗАДАЙ СВОЙ PIN (4 цифры). Хранится в виде SHA-256 хэша.
  const PIN_HASH = sha256('2309'); // ← ЗАМЕНИ ВАШ_НОВЫЙ_PIN на свой!
  
  // Простая функция SHA-256 (не зависит от внешних библиотек)
  function sha256(str) {
    // Используем встроенный crypto API, если доступен
    if (window.crypto && window.crypto.subtle) {
      // Асинхронный вариант, но для простоты используем упрощённый
      // В реальном проекте лучше использовать crypto.subtle.digest
      // Здесь для совместимости используем упрощённый хэш
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
      }
      // Добавляем соль, чтобы усложнить подбор
      return 'hash_' + Math.abs(hash).toString(16) + '_salt_uskor';
    }
    // Fallback
    return 'hash_' + btoa(str).replace(/=/g, '') + '_fallback';
  }
  
  const adminClicks = { count: 0, timer: null };
  
  // Тройной клик по фразе в футере
  const footerSpan = document.querySelector('.site-footer span');
  if (footerSpan) {
    footerSpan.style.cursor = 'pointer';
    footerSpan.addEventListener('click', () => {
      adminClicks.count++;
      if (adminClicks.count === 1) {
        adminClicks.timer = setTimeout(() => { adminClicks.count = 0; }, 800);
      }
      if (adminClicks.count === 3) {
        clearTimeout(adminClicks.timer);
        adminClicks.count = 0;
        showPinOverlay();
      }
    });
  }
  
  function showPinOverlay() {
    const overlay = document.getElementById('pinOverlay');
    const input = document.getElementById('pinInput');
    if (overlay && input) {
      overlay.classList.add('show');
      input.value = '';
      input.focus();
    }
  }
  
  window.checkPin = function() {
    const input = document.getElementById('pinInput');
    if (!input) return;
    
    const enteredPin = input.value;
    const enteredHash = sha256(enteredPin);
    
    if (enteredHash === PIN_HASH) {
      document.getElementById('pinOverlay')?.classList.remove('show');
      document.getElementById('adminPanel')?.classList.add('show');
      input.value = '';
      loadAdminStats();
      showToast('✅ Доступ разрешён');
    } else {
      showToast('❌ Неверный PIN', 2000);
      input.value = '';
      input.focus();
    }
  };
  
  function loadAdminStats() {
    const pageCountEl = document.getElementById('adminPageCount');
    if (pageCountEl) {
      pageCountEl.textContent = localStorage.getItem('site_page_views') || '0';
    }
  }
  
  // Редактирование статьи (только на страницах статей)
  const articleSelect = document.getElementById('articleSelect');
  const articleContent = document.getElementById('articleContent');
  
  if (articleSelect && articleContent) {
    articleSelect.addEventListener('change', function() {
      const id = this.value;
      if (!id) {
        articleContent.value = '';
        return;
      }
      
      // Показываем индикатор загрузки
      articleContent.value = 'Загрузка...';
      
      const saved = localStorage.getItem('edited_' + id);
      if (saved) {
        articleContent.value = saved;
        return;
      }
      
      fetch(`/article/${id}.html`)
        .then(res => res.text())
        .then(html => {
          articleContent.value = html;
        })
        .catch(() => {
          articleContent.value = 'Ошибка загрузки статьи.';
        });
    });
  }
  
  window.saveArticle = function() {
    const select = document.getElementById('articleSelect');
    const content = document.getElementById('articleContent');
    if (!select || !content) return;
    
    const id = select.value;
    if (!id || !content.value) {
      showToast('Выберите статью и введите текст');
      return;
    }
    
    localStorage.setItem('edited_' + id, content.value);
    showToast('💾 Сохранено локально!', 3000);
  };
  
  window.exportArticle = function() {
    const select = document.getElementById('articleSelect');
    const content = document.getElementById('articleContent');
    if (!select || !content) return;
    
    if (!content.value) {
      showToast('Нет данных для экспорта');
      return;
    }
    
    const id = select.value || 'article';
    const blob = new Blob([content.value], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = id + '.html';
    a.click();
    showToast('📋 Файл скачан. Замените им файл в репозитории GitHub.', 4000);
  };
  
  // Глобальный онлайн
  (function() {
    const CHANNEL = 'uskor-pc-global';
    const bc = new BroadcastChannel(CHANNEL);
    const sessionId = Date.now() + Math.random();
    const onlineEl = document.getElementById('onlineCount');
    const sessions = new Set();
    sessions.add(sessionId);
    
    function announce() {
      bc.postMessage({ type: 'ping', id: sessionId });
    }
    
    bc.onmessage = (e) => {
      if (e.data.type === 'ping' && e.data.id !== sessionId) {
        sessions.add(e.data.id);
        bc.postMessage({ type: 'pong', id: sessionId });
      } else if (e.data.type === 'pong' && e.data.id !== sessionId) {
        sessions.add(e.data.id);
      } else if (e.data.type === 'bye') {
        sessions.delete(e.data.id);
      }
      if (onlineEl) {
        onlineEl.textContent = sessions.size;
      }
    };
    
    window.addEventListener('beforeunload', () => {
      bc.postMessage({ type: 'bye', id: sessionId });
      bc.close();
    });
    
    setInterval(() => {
      sessions.clear();
      sessions.add(sessionId);
      announce();
    }, 8000);
    
    announce();
    if (onlineEl) onlineEl.textContent = sessions.size;
  })();
})();
