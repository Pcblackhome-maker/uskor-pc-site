// =========================================
// ЦЕНТРАЛИЗОВАННАЯ НАВИГАЦИЯ
// =========================================
(function() {
  const menuItems = [
    { href: "/article/instruction.html", icon: "📋", label: "Инструкция" },
    { href: "/article/programs.html", icon: "⚡", label: "Программы" },
    { href: "/article/ssd.html", icon: "💾", label: "SSD" },
    { href: "/article/monitor.html", icon: "🖥️", label: "Монитор" },
    { href: "/article/windows11.html", icon: "🪟", label: "Windows 11" },
    { href: "/article/virus.html", icon: "🛡️", label: "Вирусы" },
    { href: "/article/gaming.html", icon: "🎮", label: "Игры" },
    { href: "/article/build.html", icon: "🔧", label: "Сборка" },
    { href: "/article/slow-after-update.html", icon: "🐌", label: "После обновления" },
    { href: "/article/disk-cleanup.html", icon: "🧹", label: "Очистка C" },
    { href: "/article/win10-slow.html", icon: "🐢", label: "Тормозит ноутбук" },
    { href: "/catalog.html", icon: "🛒", label: "Каталог" },
    { href: "/diagnostic.html", icon: "🔍", label: "Диагностика" },
    { href: "/pages/guide.html", icon: "📘", label: "Платный гайд" }
  ];

  function buildNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    const currentPath = window.location.pathname;
    nav.innerHTML = menuItems.map(item => {
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
