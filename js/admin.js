// =========================================
// АДМИН-ПАНЕЛЬ С ХЭШИРОВАННЫМ PIN
// =========================================
(function() {
  const PIN_HASH = 'hash_1234_salt_uskor'; // ← замени на свой (используй sha256 из предыдущего ответа)

  // Простейший хэш для демонстрации (лучше заменить на crypto.subtle)
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'hash_' + Math.abs(hash).toString(16) + '_salt_uskor';
  }

  // Тройной клик по фразе в футере
  const footerSpan = document.querySelector('.site-footer span');
  if (footerSpan) {
    footerSpan.style.cursor = 'pointer';
    let clickCount = 0;
    let clickTimer;

    footerSpan.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 1) {
        clickTimer = setTimeout(() => { clickCount = 0; }, 800);
      }
      if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;
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
    
    const enteredHash = simpleHash(input.value);
    if (enteredHash === PIN_HASH) {
      document.getElementById('pinOverlay').classList.remove('show');
      document.getElementById('adminPanel').classList.add('show');
      input.value = '';
      loadAdminStats();
      showToast('✅ Доступ разрешён', 'success');
    } else {
      showToast('❌ Неверный PIN', 'error');
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

  // Редактор статей (если есть select)
  const articleSelect = document.getElementById('articleSelect');
  const articleContent = document.getElementById('articleContent');
  if (articleSelect && articleContent) {
    articleSelect.addEventListener('change', function() {
      const id = this.value;
      if (!id) {
        articleContent.value = '';
        return;
      }
      articleContent.value = 'Загрузка...';
      const saved = localStorage.getItem('edited_' + id);
      if (saved) {
        articleContent.value = saved;
        return;
      }
      fetch(`/article/${id}.html`)
        .then(res => res.text())
        .then(html => { articleContent.value = html; })
        .catch(() => { articleContent.value = 'Ошибка загрузки статьи.'; });
    });
  }

  window.saveArticle = function() {
    const select = document.getElementById('articleSelect');
    const content = document.getElementById('articleContent');
    if (!select || !content) return;
    const id = select.value;
    if (!id || !content.value) {
      showToast('Выберите статью и введите текст', 'error');
      return;
    }
    localStorage.setItem('edited_' + id, content.value);
    showToast('💾 Сохранено локально!', 'save');
  };

  window.exportArticle = function() {
    const select = document.getElementById('articleSelect');
    const content = document.getElementById('articleContent');
    if (!select || !content) return;
    if (!content.value) {
      showToast('Нет данных для экспорта', 'error');
      return;
    }
    const id = select.value || 'article';
    const blob = new Blob([content.value], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = id + '.html';
    a.click();
    showToast('📋 Файл скачан. Замените им файл в репозитории GitHub.', 'success');
  };

  // Глобальный онлайн (BroadcastChannel)
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
      if (onlineEl) onlineEl.textContent = sessions.size;
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
