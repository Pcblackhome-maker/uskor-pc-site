// =========================================
// ЦЕНТРАЛИЗОВАННАЯ НАВИГАЦИЯ
// =========================================
(function() {
  // Единый список пунктов меню
  const menuItems = [
    { href: "/article/instruction.html", icon: "📋", label: "Инструкция" },
    { href: "/article/programs.html", icon: "⚡", label: "Программы" },
    { href: "/article/ssd.html", icon: "💾", label: "SSD" },
    { href: "/article/monitor.html", icon: "🖥️", label: "Монитор" },
    { href: "/article/win10-slow.html", icon: "🐢", label: "Тормозит ноутбук" }
    { href: "/article/windows11.html", icon: "🪟", label: "Windows 11" },
    { href: "/article/virus.html", icon: "🛡️", label: "Вирусы" },
    { href: "/article/gaming.html", icon: "🎮", label: "Игры" },
    { href: "/article/build.html", icon: "🔧", label: "Сборка" },
    { href: "/article/slow-after-update.html", icon: "🐌", label: "После обновления" },
    { href: "/article/disk-cleanup.html", icon: "🧹", label: "Очистка C" },
    { href: "/pages/guide.html", icon: "📘", label: "Платный гайд" }
  ];

  function buildNav() {
    const currentPath = window.location.pathname;
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    let html = '';
    menuItems.forEach(item => {
      const isActive = currentPath.endsWith(item.href.replace(/^\//, ''));
      html += `<a href="${item.href}" class="${isActive ? 'active' : ''}"><span>${item.icon}</span> ${item.label}</a>`;
    });
    nav.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
