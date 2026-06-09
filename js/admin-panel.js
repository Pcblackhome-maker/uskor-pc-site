// =========================================
// ПРОФЕССИОНАЛЬНАЯ АДМИН-ПАНЕЛЬ v4.4 (с визуальным редактором и загрузкой изображений)
// =========================================
(function() {
  const CORRECT_PIN = '2309';

  // ---------- ИНТЕРФЕЙС ----------
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
            <option value="disk-cleanup">Очистка диска C</option>
            <option value="win10-slow">Тормозит ноутбук</option>
          </select>
          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <button onclick="enableVisualEditor()" class="admin-btn" id="btnVisual">🖌 Визуальный редактор</button>
            <button onclick="disableVisualEditor()" class="admin-btn" id="btnHTML">📝 HTML-код</button>
            <button onclick="insertImage()" class="admin-btn">🖼 Вставить картинку</button>
          </div>
          <textarea id="adminEditor" placeholder="HTML-код статьи появится здесь..." style="display:block;"></textarea>
          <div id="adminVisualEditor" contenteditable="true" style="display:none; width:100%; min-height:250px; padding:12px; border:2px solid #e0e0e0; border-radius:10px; background:#fafafa; font-family:inherit; font-size:14px; line-height:1.6; overflow-y:auto;"></div>
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
          <button onclick="toggleAdminIgnore()" class="admin-btn" style="margin-top:15px;">👤 Не учитывать меня</button>
          <button onclick="toggleMaintenance()" class="admin-btn" style="margin-top:15px;">🔧 Включить техперерыв</button>
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

  // ---------- ЛОГИКА ----------
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

  // ---------- ТЕХПЕРЕРЫВ ----------
  window.toggleMaintenance = function() {
    const isActive = localStorage.getItem('maintenance_mode') === 'true';
    localStorage.setItem('maintenance_mode', !isActive);
    location.reload();
  };

  // ---------- ИГНОР АДМИНА ----------
  window.toggleAdminIgnore = function() {
    const current = sessionStorage.getItem('admin_ignore') === 'true';
    sessionStorage.setItem('admin_ignore', !current);
    alert(!current ? 'Ваши действия больше не учитываются в статистике' : 'Статистика снова учитывает вас');
  };

  // ---------- ВИЗУАЛЬНЫЙ РЕДАКТОР ----------
  window.enableVisualEditor = function() {
    const editor = document.getElementById('adminEditor');
    const visual = document.getElementById('adminVisualEditor');
    visual.innerHTML = editor.value || '';
    editor.style.display = 'none';
    visual.style.display = 'block';
    document.getElementById('btnVisual').classList.add('primary');
    document.getElementById('btnHTML').classList.remove('primary');
  };

  window.disableVisualEditor = function() {
    const editor = document.getElementById('adminEditor');
    const visual = document.getElementById('adminVisualEditor');
    editor.value = visual.innerHTML;
    visual.style.display = 'none';
    editor.style.display = 'block';
    document.getElementById('btnHTML').classList.add('primary');
    document.getElementById('btnVisual').classList.remove('primary');
  };

  window.insertImage = function() {
    const url = prompt('Введите URL картинки или вставьте base64:');
    if (!url) return;
    const visual = document.getElementById('adminVisualEditor');
    if (visual.style.display === 'block') {
      visual.focus();
      document.execCommand('insertHTML', false, `<img src="${url}" style="max-width:100%; border-radius:8px;">`);
    } else {
      const editor = document.getElementById('adminEditor');
      const cursorPos = editor.selectionStart;
      const textBefore = editor.value.substring(0, cursorPos);
      const textAfter = editor.value.substring(cursorPos);
      editor.value = textBefore + `<img src="${url}" style="max-width:100%; border-radius:8px;">` + textAfter;
    }
  };

  // ---------- РЕДАКТОР (сохранение с учётом визуального редактора) ----------
  document.addEventListener('change', function(e) {
    if (e.target.id === 'adminArticleSelect') {
      const id = e.target.value;
      const editor = document.getElementById('adminEditor');
      const visual = document.getElementById('adminVisualEditor');
      if (!id) {
        editor.value = '';
        visual.innerHTML = '';
        return;
      }
      const saved = localStorage.getItem('edited_' + id);
      if (saved) {
        editor.value = saved;
        visual.innerHTML = saved;
        return;
      }
      editor.value = 'Загрузка...';
      fetch(`/article/${id}.html`)
        .then(r => r.text())
        .then(html => {
          editor.value = html;
          visual.innerHTML = html;
        })
        .catch(() => {
          editor.value = 'Ошибка загрузки';
          visual.innerHTML = 'Ошибка загрузки';
        });
    }
  });

  window.adminSave = function() {
    const id = document.getElementById('adminArticleSelect').value;
    const visual = document.getElementById('adminVisualEditor');
    const editor = document.getElementById('adminEditor');
    // Если визуальный редактор активен, берём HTML из него
    const content = (visual.style.display === 'block') ? visual.innerHTML : editor.value;
    if (!id || !content) return alert('Выберите статью и введите текст');
    localStorage.setItem('edited_' + id, content);
    logActivity(`Сохранена статья: ${id}`);
    alert('Сохранено локально!');
  };

  window.adminExport = function() {
    const id = document.getElementById('adminArticleSelect').value || 'article';
    const visual = document.getElementById('adminVisualEditor');
    const editor = document.getElementById('adminEditor');
    const content = (visual.style.display === 'block') ? visual.innerHTML : editor.value;
    if (!content) return alert('Нет данных');
    const blob = new Blob([content], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = id + '.html';
    a.click();
  };

  window.adminPreview = function() {
    const visual = document.getElementById('adminVisualEditor');
    const editor = document.getElementById('adminEditor');
    const content = (visual.style.display === 'block') ? visual.innerHTML : editor.value;
    const area = document.getElementById('adminPreviewArea');
    area.style.display = 'block';
    area.innerHTML = content || '<em>Пусто</em>';
  };

  // ---------- ПАКЕТНАЯ ЗАМЕНА ----------
  window.batchReplace = function() {
    const find = document.getElementById('batchFind').value;
    const replace = document.getElementById('batchReplace').value;
    const resultEl = document.getElementById('batchResult');
    if (!find || !replace) { resultEl.textContent = 'Заполните оба поля'; return; }

    const articleIds = ['instruction','programs','ssd','monitor','windows11','virus','gaming','build','slow-after-update','disk-cleanup','win10-slow'];
    let count = 0;
    articleIds.forEach(id => {
      const key = 'edited_' + id;
      let content = localStorage.getItem(key);
      if (!content) return;
      if (content.includes(find)) {
        content = content.split(find).join(replace);
        localStorage.setItem(key, content);
        count++;
      }
    });
    resultEl.textContent = `Заменено в ${count} статьях.`;
    logActivity(`Пакетная замена: "${find}" → "${replace}" в ${count} статьях`);
  };

  // ---------- ВКЛАДКИ ----------
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('admin-tab')) {
      const tab = e.target.dataset.tab;
      document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      const content = document.getElementById('tab-' + tab);
      if (content) content.classList.add('active');
      if (tab === 'dashboard') refreshDashboard();
    }
  });

  // ---------- СБРОС ----------
  window.adminClearData = function() {
    if (confirm('Удалить ВСЕ локальные данные?')) { localStorage.clear(); location.reload(); }
  };

  // ---------- ТРОЙНОЙ КЛИК ----------
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

  // ---------- ОНЛАЙН ----------
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

  // ---------- ИНИЦИАЛИЗАЦИЯ ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { createPanel(); createPinOverlay(); bindFooter(); });
  } else {
    createPanel(); createPinOverlay(); bindFooter();
  }
})();
