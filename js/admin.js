// =========================================
// АДМИН-ПАНЕЛЬ (самовнедряющаяся версия)
// =========================================
(function() {
  // Простейший хэш (замени на crypto.subtle, если нужно)
  const PIN_HASH = 'hash_1234_salt_uskor'; // ← поменяй на хэш своего пина

  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'hash_' + Math.abs(hash).toString(16) + '_salt_uskor';
  }

  // Создаём элементы админки, если их нет на странице
  function ensureAdminElements() {
    if (!document.getElementById('pinOverlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'pinOverlay';
      overlay.className = 'pin-overlay';
      overlay.innerHTML = `
        <div class="pin-box">
          <h3>🔐 Введите PIN</h3>
          <input type="password" id="pinInput" maxlength="4" placeholder="****">
          <br>
          <button onclick="checkPin()">Войти</button>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    if (!document.getElementById('adminPanel')) {
      const panel = document.createElement('div');
      panel.id = 'adminPanel';
      panel.className = 'admin-panel';
      panel.innerHTML = `
        <button class="close-btn" onclick="document.getElementById('adminPanel').classList.remove('show')">✕</button>
        <h3>🔒 Админ-панель</h3>
        <label>📊 Посещений (локально):</label>
        <span id="adminPageCount">0</span>
        <label>👥 Сейчас онлайн (вкладок):</label>
        <span id="onlineCount">1</span>
      `;
      document.body.appendChild(panel);
    }
  }

  // Вешаем тройной клик на первый подходящий span в футере
  function bindFooterTrigger() {
    const footerSpan = document.querySelector('.site-footer span');
    if (!footerSpan) return;
    footerSpan.style.cursor = 'pointer';
    let clicks = 0, timer;

    footerSpan.addEventListener('click', () => {
      clicks++;
      if (clicks === 1) {
        timer = setTimeout(() => { clicks = 0; }, 800);
      }
      if (clicks === 3) {
        clearTimeout(timer);
        clicks = 0;
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
    
    if (simpleHash(input.value) === PIN_HASH) {
      document.getElementById('pinOverlay').classList.remove('show');
      document.getElementById('adminPanel').classList.add('show');
      input.value = '';
      loadAdminStats();
      showToast && showToast('✅ Доступ разрешён', 'success');
    } else {
      showToast && showToast('❌ Неверный PIN', 'error');
      input.value = '';
      input.focus();
    }
  };

  function loadAdminStats() {
    const el = document.getElementById('adminPageCount');
    if (el) el.textContent = localStorage.getItem('site_page_views') || '0';
  }

  // Глобальный онлайн
  (function() {
    const CHANNEL = 'uskor-pc-global';
    const bc = new BroadcastChannel(CHANNEL);
    const sessionId = Date.now() + Math.random();
    const onlineEl = document.getElementById('onlineCount');
    const sessions = new Set();
    sessions.add(sessionId);

    function announce() { bc.postMessage({ type: 'ping', id: sessionId }); }

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

  // Запускаем после готовности DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureAdminElements();
      bindFooterTrigger();
    });
  } else {
    ensureAdminElements();
    bindFooterTrigger();
  }
})();
