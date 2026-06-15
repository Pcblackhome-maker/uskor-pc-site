// =========================================
// МЕНЮ ПО КАТЕГОРИЯМ (десктоп + мобильная адаптация)
// =========================================
(function() {
  // Структура категорий
  const menuCategories = [
    {
      title: '⚡ Система',
      items: [
        { href: '/article/instruction.html', icon: '📋', label: 'Инструкция' },
        { href: '/article/disk-cleanup.html', icon: '🧹', label: 'Очистка C' },
        { href: '/article/slow-after-update.html', icon: '🐌', label: 'После обновления' },
        { href: '/article/win10-slow.html', icon: '🐢', label: 'Тормозит ноутбук' },
        { href: '/article/windows11.html', icon: '🪟', label: 'Windows 11' }
      ]
    },
    {
      title: '💻 Железо',
      items: [
        { href: '/article/ssd.html', icon: '💾', label: 'SSD' },
        { href: '/article/monitor.html', icon: '🖥️', label: 'Монитор' },
        { href: '/article/build.html', icon: '🔧', label: 'Сборка ПК' }
      ]
    },
    {
      title: '🛡️ Безопасность',
      items: [
        { href: '/article/virus.html', icon: '🛡️', label: 'Вирусы' },
        { href: '/article/programs.html', icon: '⚡', label: 'Программы' }
      ]
    },
    {
      title: '🎮 Игры',
      items: [
        { href: '/article/gaming.html', icon: '🎮', label: 'Ускорение FPS' }
      ]
    }
  ];

  // Отдельные ссылки (без подменю)
  const extraLinks = [
    { href: '/catalog.html', icon: '🛒', label: 'Каталог' },
    { href: '/news.html', icon: '📰', label: 'Новости' },
    { href: '/diagnostic.html', icon: '🔍', label: 'Диагностика' },
    { href: '/pages/about.html', icon: '👨‍💻', label: 'О проекте' },
    { href: "/glossary.html", icon: "📘", label: "Глоссарий" },
    { href: '/pages/guide.html', icon: '📘', label: 'Платный гайд' }
  ];

  function buildNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const currentPath = window.location.pathname;

    // Строим HTML меню
    let html = '';

    // Категории с выпадающими списками
    menuCategories.forEach(cat => {
      html += '<div class="nav-dropdown">';
      html += `<button class="nav-dropbtn">${cat.title}</button>`;
      html += '<div class="nav-dropdown-content">';
      cat.items.forEach(item => {
        const isActive = currentPath.endsWith(item.href.replace(/^\//, ''));
        html += `<a href="${item.href}" class="${isActive ? 'active' : ''}"><span>${item.icon}</span> ${item.label}</a>`;
      });
      html += '</div></div>';
    });

    // Отдельные ссылки
    extraLinks.forEach(link => {
      const isActive = currentPath.endsWith(link.href.replace(/^\//, ''));
      html += `<a href="${link.href}" class="nav-single ${isActive ? 'active' : ''}"><span>${link.icon}</span> ${link.label}</a>`;
    });

    nav.innerHTML = html;
  }

  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }

  // Мобильное меню: открытие/закрытие выпадающих категорий по клику
  document.addEventListener('click', function(e) {
    const dropdown = e.target.closest('.nav-dropdown');
    const isMobile = window.innerWidth <= 768;

    if (isMobile && dropdown) {
      e.preventDefault();
      dropdown.classList.toggle('open');
    }
  });
})();
