// =========================================
// ПРОФЕССИОНАЛЬНАЯ АДМИН-ПАНЕЛЬ v3.2
// =========================================
(function() {
  const CORRECT_PIN = '1234';

  function createPanel() {
    const oldOverlay = document.getElementById('adminOverlay');
    if (oldOverlay) oldOverlay.remove();
    const oldPin = document.getElementById('pinOverlay');
    if (oldPin) oldPin.remove();

    const overlay = document.createElement('div');
    overlay.id = 'adminOverlay';
    overlay.className = 'admin-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = `
      <div class="admin-dialog">
        <div class="admin-header">
          <h2>🔒 Панель управления</h2>
          <button onclick="closeAdmin()" class="admin-close">✕</button>
        </div>
        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="dashboard">📊 Дашборд</button>
          <button class="admin-tab" data-tab="editor">📝 Редактор</button>
          <button class="admin-tab" data-tab="links">🔗 Ссылки</button>
        </div>
        <div class="admin-tab-content active" id="tab-dashboard">
          <div class="admin-stats-grid">
            <div class="admin-stat-card"><span>👀 Посещений всего</span><strong id="adminTotalViews">0</strong></div>
            <div class="admin-stat-card"><span>👥 Онлайн (вкладок)</span><strong id="adminOnline">1</strong></div>
            <div class="admin-stat-card"><span>⭐ Средний рейтинг</span><strong id="adminAvgRating">0</strong></div>
            <div class="admin-stat-card"><span>📦 Закладок</span><strong id="adminBookmarks">0</strong></div>
          </div>
        </div>
        <div class="admin-tab-content" id="tab-editor">
          <label>Выберите статью</label>
          <select id="adminArticleSelect" class="admin-select">
            <option value="">-- Статья --</option>
            <option value="instruction">Пошаговая инструкция</option>
            <option value="programs">Программы и железо</option>
            <option value="ssd">Как выбрать SSD</option>
            <option value="monitor">Как выбрать монитор</option>
            <option value="windows11">Секреты Windows 11</option>
            <option value="virus">Чистка от вирусов</option>
            <option value="gaming">Ускорение для игр</option>
            <option value="build">Сборка ПК</option>
            <option value="slow-after-update">После обновления</option>
          </select>
          <textarea id="adminEditor" placeholder="HTML-код статьи появится здесь..."></textarea>
          <div class="admin-editor-buttons">
            <button onclick="adminSave()" class="admin-btn primary">💾 Сохранить локально</button>
            <button onclick="adminExport()" class="admin-btn">📋 Экспортировать</button>
          </div>
        </div>
        <div class="admin-tab-content" id="tab-links">
          <a href="https://metrika.yandex.ru/dashboard?group=day&period=week&id=109547393" target="_blank" class="admin-link-card">📈 Яндекс.Метрика</a>
          <a href="https://github.com/Pcblackhome-maker/uskor-pc-data" target="_blank" class="admin-link-card">📂 Репозиторий GitHub</a>
          <a href="https://www.admitad.com/ru/webmaster/" target="_blank" class="admin-link-card">💼 Admitad</a>
          <button onclick="adminClearData()" class="admin-btn danger" style="margin-top:15px;">🗑 Сбросить все данные</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function createPinOverlay() {
    const oldPin = document.getElementById('pinOverlay');
    if (oldPin) oldPin.remove();

    const overlay = document.createElement('div');
    overlay.id = 'pinOverlay';
    overlay.className = 'pin-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = `
      <div class="pin-box">
        <h3>🔐 Введите PIN</h3>
        <input type="password" id="pinInput" maxlength="4" placeholder="****">
        <br>
        <button onclick="checkPin()" class="admin-btn primary" style="margin-top:10px;">Войти</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function showPin() {
    const el = document.getElementById('pinOverlay');
    if (el) { el.style.display = 'flex'; el.classList.add('show'); }
    setTimeout(() => document.getElementById('pinInput')?.focus(), 100);
  }

  window.checkPin = function() {
    const inp = document.getElementById('pinInput');
    if (!inp) return;
    if (inp.value === CORRECT_PIN) {
      document.getElementById('pinOverlay').style.display = 'none';
      document.getElementById('pinOverlay').classList.remove('show');
      const adminOverlay = document.getElementById('adminOverlay');
      adminOverlay.style.display = 'flex';
      adminOverlay.classList.add('show');
      inp.value = '';
      document.getElementById('adminTotalViews').textContent = localStorage.getItem('site_page_views') || '0';
    } else {
      alert('Неверный PIN');
      inp.value = '';
      inp.focus();
    }
  };

  window.closeAdmin = function() {
    const adminOverlay = document.getElementById('adminOverlay');
    adminOverlay.style.display = 'none';
    adminOverlay.classList.remove('show');
  };

  // ... (остальные функции редактора, кликабельности вкладок и онлайна оставлены как в предыдущей версии, но без пакетной замены)
  // ВАЖНО: чтобы не перегружать ответ, я приведу только ключевые правки. Если нужен полный код, я его предоставлю.

  function bindFooter() {
    const span = document.querySelector('.site-footer span');
    if (!span) return;
    span.style.cursor = 'pointer';
    let clicks = 0, timer;
    span.addEventListener('click', () => {
      clicks++;
      if (clicks === 1) timer = setTimeout(() => clicks = 0, 800);
      if (clicks === 3) { clearTimeout(timer); clicks = 0; showPin(); }
    });
  }

  (function() {
    const CHANNEL = 'uskor-pc-global';
    const bc = new BroadcastChannel(CHANNEL);
    const sessionId = Date.now() + Math.random();
    const el = document.getElementById('adminOnline');
    const sessions = new Set([sessionId]);
    function announce() { bc.postMessage({ type: 'ping', id: sessionId }); }
    bc.onmessage = (e) => {
      if (e.data.type === 'ping' && e.data.id !== sessionId) {
        sessions.add(e.data.id); bc.postMessage({ type: 'pong', id: sessionId });
      } else if (e.data.type === 'pong' && e.data.id !== sessionId) {
        sessions.add(e.data.id);
      } else if (e.data.type === 'bye') {
        sessions.delete(e.data.id);
      }
      if (el) el.textContent = sessions.size;
    };
    window.addEventListener('beforeunload', () => { bc.postMessage({ type: 'bye', id: sessionId }); bc.close(); });
    setInterval(() => { sessions.clear(); sessions.add(sessionId); announce(); }, 8000);
    announce();
    if (el) el.textContent = sessions.size;
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { createPanel(); createPinOverlay(); bindFooter(); });
  } else {
    createPanel(); createPinOverlay(); bindFooter();
  }
})();
