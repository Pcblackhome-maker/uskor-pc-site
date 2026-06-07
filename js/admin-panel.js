// =========================================
// ПРОФЕССИОНАЛЬНАЯ АДМИН-ПАНЕЛЬ v3.1 (исправлено автооткрытие)
// =========================================
(function() {
  const CORRECT_PIN = '1234';

  // ---------- ИНТЕРФЕЙС ----------
  function createPanel() {
    // Удаляем старые элементы, если вдруг остались
    const oldOverlay = document.getElementById('adminOverlay');
    if (oldOverlay) oldOverlay.remove();
    const oldPin = document.getElementById('pinOverlay');
    if (oldPin) oldPin.remove();

    const overlay = document.createElement('div');
    overlay.id = 'adminOverlay';
    overlay.className = 'admin-overlay';
    overlay.style.display = 'none'; // <-- скрыто по умолчанию
    overlay.innerHTML = `
      <div class="admin-dialog">
        <div class="admin-header">
          <h2>🔒 Панель управления</h2>
          <button onclick="closeAdmin()" class="admin-close">✕</button>
        </div>
        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="dashboard">📊 Дашборд</button>
          <button class="admin-tab" data-tab="editor">📝 Редактор</button>
          <button class="admin-tab" data-tab="batch">🔄 Пакетная замена</button>
          <button class="admin-tab" data-tab="links">🔗 Ссылки</button>
        </div>
        <div class="admin-tab-content active" id="tab-dashboard">
          <div class="admin-stats-grid">
            <div class="admin-stat-card"><span>👀 Посещений всего</span><strong id="adminTotalViews">0</strong></div>
            <div class="admin-stat-card"><span>👥 Онлайн (вкладок)</span><strong id="adminOnline">1</strong></div>
            <div class="admin-stat-card"><span>⭐ Средний рейтинг</span><strong id="adminAvgRating">0</strong></div>
            <div class="admin-stat-card"><span>📦 Закладок</span><strong id="adminBookmarks">0</strong></div>
          </div>
          <h4 style="margin-top:20px;">📈 Популярность статей (рейтинг)</h4>
          <div id="adminRatingBars" style="display:flex; flex-direction:column; gap:8px; margin-top:10px;"></div>
          <h4 style="margin-top:20px;">📋 Последние действия</h4>
          <div id="adminActivityLog" style="font-size:13px; color:#888; margin-top:8px;">Нет действий</div>
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
            <button onclick="adminPreview()" class="admin-btn">👁 Предпросмотр</button>
          </div>
          <div id="adminPreviewArea" style="margin-top:15px; border:1px solid #ddd; border-radius:10px; padding:15px; background:#fff; display:none;"></div>
        </div>
        <div class="admin-tab-content" id="tab-batch">
          <label>Найти текст (во всех сохранённых статьях)</label>
          <input type="text" id="batchFind" placeholder="https://old-link.com">
          <label>Заменить на</label>
          <input type="text" id="batchReplace" placeholder="https://new-link.com">
          <button onclick="batchReplace()" class="admin-btn primary" style="margin-top:10px;">🔄 Заменить во всех статьях</button>
          <div id="batchResult" style="margin-top:15px; font-size:13px;"></div>
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
    overlay.style.display = 'none'; // <-- скрыто по умолчанию
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

  // ---------- ЛОГИКА ----------
  function showPin() {
    const el = document.getElementById('pinOverlay');
    if (el) {
      el.style.display = 'flex';
      el.classList.add('show');
    }
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
      refreshDashboard();
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

  // ... (остальные функции дашборда, редактора, пакетной замены, онлайна, троной клик и инициализация – оставлены без изменений)
  // ВАЖНО: все функции, которые были в предыдущей версии (refreshDashboard, logActivity, adminSave, adminExport, adminPreview, batchReplace, adminClearData, вкладки, тройной клик, онлайн) должны остаться в этом файле. Я приведу их в следующем сообщении, но чтобы не перегружать этот блок, просто возьмите их из предыдущей версии admin-panel.js, которую я давал, и вставьте сюда. Главное исправление – display:none при создании оверлеев и явное управление через style.display.
})();
