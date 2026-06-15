// =========================================
// ЦЕНТРАЛИЗОВАННАЯ НАВИГАЦИЯ (с выпадающими категориями)
// =========================================
(function() {
  const menuItems = [
    {
      label: "⚡ Ускорение",
      items: [
        { href: "/article/instruction.html", icon: "📋", label: "Пошаговая инструкция" },
        { href: "/article/disk-cleanup.html", icon: "🧹", label: "Очистка диска C" },
        { href: "/article/slow-after-update.html", icon: "🐌", label: "После обновления" },
        { href: "/article/win10-slow.html", icon: "🐢", label: "Тормозит ноутбук" },
        { href: "/article/windows11.html", icon: "🪟", label: "Windows 11" }
      ]
    },
    {
      label: "💻 Железо",
      items: [
        { href: "/article/ssd.html", icon: "💾", label: "Выбор SSD" },
        { href: "/article/monitor.html", icon: "🖥️", label: "Выбор монитора" },
        { href: "/article/build.html", icon: "🔧", label: "Сборка ПК" },
        { href: "/catalog.html", icon: "🛒", label: "Каталог товаров" }
      ]
    },
    {
      label: "🛡️ Безопасность",
      items: [
        { href: "/article/virus.html", icon: "🛡️", label: "Чистка от вирусов" },
        { href: "/article/programs.html", icon: "⚡", label: "Программы и железо" }
      ]
    },
    {
      label: "🎮 Игры",
      items: [
        { href: "/article/gaming.html", icon: "🎮", label: "Максимальный FPS" }
      ]
    },
    { href: "/diagnostic.html", icon: "🔍", label: "Диагностика" },
    { href: "/news.html", icon: "📰", label: "Новости" },
    { href: "/pages/about.html", icon: "👨‍💻", label: "О проекте" },
    { href: "/pages/guide.html", icon: "📘", label: "Платный гайд" }
  ];

  function buildNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    const currentPath = window.location.pathname;

    nav.innerHTML = menuItems.map(item => {
      // Если это выпадающее меню
      if (item.items) {
        const isActive = item.items.some(sub => currentPath.endsWith(sub.href.replace(/^\//, '')));
        return `
          <div class="nav-dropdown">
            <a href="#" class="nav-dropbtn ${isActive ? 'active' : ''}">${item.label}</a>
            <div class="nav-dropdown-content">
              ${item.items.map(sub => `
                <a href="${sub.href}" class="${currentPath.endsWith(sub.href.replace(/^\//, '')) ? 'active' : ''}">
                  <span>${sub.icon}</span> ${sub.label}
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }
      // Обычная ссылка
      const isActive = currentPath.endsWith(item.href.replace(/^\//, ''));
      return `<a href="${item.href}" class="${isActive ? 'active' : ''}"><span>${item.icon}</span> ${item.label}</a>`;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
