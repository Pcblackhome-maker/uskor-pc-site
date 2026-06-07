// =========================================
// УМНЫЙ ПОИСК С КЭШИРОВАНИЕМ И ПРОВЕРКАМИ
// =========================================
(function() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchModal = document.getElementById('searchModal');

  if (!searchInput || !searchResults || !searchModal) {
    console.warn('Поиск не инициализирован: не найдены все элементы.');
    return;
  }

  const CACHE_KEY = 'search_index';
  const CACHE_TIME = 60 * 60 * 1000; // 1 час
  let searchData = [];

  async function loadSearchData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TIME) {
          searchData = parsed.data;
          return;
        }
      } catch(e) {}
    }
    try {
      const response = await fetch('/search.json');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      searchData = data;
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch(err) {
      console.warn('Не удалось загрузить search.json, используется кэш');
      if (cached) {
        try { searchData = JSON.parse(cached).data; } catch(e) {}
      }
    }
  }

  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    const filtered = searchData.filter(item => {
      const title = (item.title || '').toLowerCase();
      const desc = (item.desc || '').toLowerCase();
      return title.includes(query) || desc.includes(query);
    });
    if (filtered.length === 0) {
      searchResults.innerHTML = '<li style="color:#888; padding:8px;">Ничего не найдено</li>';
      return;
    }
    searchResults.innerHTML = filtered.slice(0,8).map(item =>
      `<li><a href="${item.url}">${item.title}</a></li>`
    ).join('');
  });

  // Открытие/закрытие
  document.querySelector('.search-icon')?.addEventListener('click', (e) => {
    e.stopPropagation();
    searchModal.classList.add('open');
    searchInput.focus();
  });

  // Кнопка закрытия
  searchModal.querySelector('button')?.addEventListener('click', () => {
    searchModal.classList.remove('open');
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      searchModal.classList.remove('open');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  // Небольшое улучшение: закрытие по клику вне окна
  searchModal.addEventListener('click', function(e) {
    if (e.target === searchModal) {
      searchModal.classList.remove('open');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  loadSearchData();
})();
