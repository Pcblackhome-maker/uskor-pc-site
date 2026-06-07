// =========================================
// ПРОФЕССИОНАЛЬНАЯ АДМИН-ПАНЕЛЬ v2.0
// =========================================
(function() {
  const CORRECT_PIN = '1234';

  // ---------- ИНТЕРФЕЙС ----------
  function createPanel() {
    const overlay = document.createElement('div');
    overlay.id = 'adminOverlay';
    overlay.className = 'admin-overlay';
    overlay.innerHTML = `
      <div class="admin-dialog">
        <div class="admin-header">
          <h2>🔒 Панель управления</h2>
          <button onclick="closeAdmin()" class="admin-close">✕</button>
        </div>
        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="stats">📊 Статистика</button>
          <button class="admin-tab" data-tab="editor">📝 Редактор</button>
          <button class="admin-tab" data-tab="links">🔗 Ссылки</button>
        </div>
        <div class="admin-tab-content active" id="tab-stats">
          <div class="admin-stat-card">
            <span>👀 Посещений всего</span>
            <strong id="adminTotalViews">0</strong>
          </div>
          <div class="admin-stat-card">
            <span>👥 Онлайн (вкладок)</span>
            <strong id="adminOnline">1</strong>
          </div>
          <div class="admin-stat-card">
            <span>⭐ Закладок</span>
            <strong id="adminBookmarks">0</strong>
          </div>
          <div class="admin-stat-card">
            <span>👍 Лайков (локально)</span>
            <strong id="adminLikes">0</strong>
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
    const overlay = document.createElement('div');
    overlay.id = 'pinOverlay';
    overlay.className = 'pin-overlay';
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
    if (el) el.classList.add('show');
    setTimeout(() => {
      const inp = document.getElementById('pinInput');
      if (inp) inp.focus();
    }, 100);
  }

  window.checkPin = function() {
    const inp = document.getElementById('pinInput');
    if (!inp) return;
    if (inp.value === CORRECT_PIN) {
      document.getElementById('pinOverlay').classList.remove('show');
      document.getElementById('adminOverlay').classList.add('show');
      inp.value = '';
      refreshStats();
    } else {
      alert('Неверный PIN');
      inp.value = '';
      inp.focus();
    }
  };

  window.closeAdmin = function() {
    document.getElementById('adminOverlay').classList.remove('show');
  };

  function refreshStats() {
    document.getElementById('adminTotalViews').textContent = localStorage.getItem('site_page_views') || '0';
    document.getElementById('adminBookmarks').textContent = JSON.parse(localStorage.getItem('bookmarks') || '[]').length;
    
    // Сумма лайков по всем статьям (если хранятся)
    let totalLikes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('helpful_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          totalLikes += (data.yes || 0);
        } catch(e) {}
      }
    }
    document.getElementById('adminLikes').textContent = totalLikes;
  }

  // ---------- РЕДАКТОР СТАТЕЙ ----------
  const select = document.getElementById('adminArticleSelect');
  const editor = document.getElementById('adminEditor');
  if (select && editor) {
    select.addEventListener('change', function() {
      const id = this.value;
      if (!id) { editor.value = ''; return; }
      const saved = localStorage.getItem('edited_' + id);
      if (saved) { editor.value = saved; return; }
      editor.value = 'Загрузка...';
      fetch(`/article/${id}.html`)
        .then(r => r.text())
        .then(html => { editor.value = html; })
        .catch(() => { editor.value = 'Ошибка загрузки'; });
    });
  }

  window.adminSave = function() {
    const id = select?.value;
    if (!id || !editor?.value) return alert('Выберите статью и введите текст');
    localStorage.setItem('edited_' + id, editor.value);
    alert('Сохранено локально!');
  };

  window.adminExport = function() {
    const id = select?.value || 'article';
    if (!editor?.value) return alert('Нет данных');
    const blob = new Blob([editor.value], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = id + '.html';
    a.click();
  };

  window.adminClearData = function() {
    if (confirm('Удалить ВСЕ локальные данные (счётчики, закладки, правки)?')) {
      localStorage.clear();
      location.reload();
    }
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
    }
  });

  // ---------- ТРОЙНОЙ КЛИК ----------
  function bindFooter() {
    const span = document.querySelector('.site-footer span');
    if (!span) return;
    span.style.cursor = 'pointer';
    let clicks = 0, timer;
    span.addEventListener('click', () => {
      clicks++;
      if (clicks === 1) timer = setTimeout(() => clicks = 0, 800);
      if (clicks === 3) {
        clearTimeout(timer);
        clicks = 0;
        showPin();
      }
    });
  }

  // ---------- ОНЛАЙН ----------
  (function() {
    const CHANNEL = 'uskor-pc-global';
    const bc = new BroadcastChannel(CHANNEL);
    const sessionId = Date.now() + Math.random();
    const sessions = new Set([sessionId]);
    const el = document.getElementById('adminOnline');

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
      if (el) el.textContent = sessions.size;
    };
    window.addEventListener('beforeunload', () => {
      bc.postMessage({ type: 'bye', id: sessionId });
      bc.close();
    });
    setInterval(() => { sessions.clear(); sessions.add(sessionId); announce(); }, 8000);
    announce();
    if (el) el.textContent = sessions.size;
  })();

  // ---------- ИНИЦИАЛИЗАЦИЯ ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createPanel();
      createPinOverlay();
      bindFooter();
    });
  } else {
    createPanel();
    createPinOverlay();
    bindFooter();
  }
})();
