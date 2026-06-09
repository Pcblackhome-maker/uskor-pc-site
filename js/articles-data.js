// Централизованные данные для категорий и блока "Похожие статьи"
const articleCategories = {
  'system': { title: '⚡ Ускорение системы', desc: 'Чистка, оптимизация, обновления', articles: ['instruction', 'disk-cleanup', 'slow-after-update', 'win10-slow', 'windows11'] },
  'hardware': { title: '💻 Железо и апгрейд', desc: 'SSD, мониторы, сборка ПК', articles: ['ssd', 'monitor', 'build'] },
  'security': { title: '🛡️ Безопасность и чистка', desc: 'Вирусы, антивирусы, конфиденциальность', articles: ['virus', 'programs'] },
  'gaming': { title: '🎮 Игры', desc: 'FPS, игровые товары, ключи', articles: ['gaming'] }
};

const relatedArticles = {
  instruction: ['programs', 'ssd', 'virus', 'gaming', 'disk-cleanup', 'win10-slow'],
  programs: ['instruction', 'ssd', 'virus', 'win10-slow'],
  ssd: ['instruction', 'programs', 'gaming', 'disk-cleanup', 'win10-slow'],
  monitor: ['gaming', 'build', 'windows11'],
  windows11: ['instruction', 'gaming', 'virus', 'disk-cleanup', 'win10-slow'],
  virus: ['programs', 'instruction', 'windows11', 'win10-slow'],
  gaming: ['monitor', 'ssd', 'windows11'],
  build: ['programs', 'ssd', 'monitor'],
  'slow-after-update': ['instruction', 'ssd', 'virus', 'win10-slow'],
  'disk-cleanup': ['instruction', 'ssd', 'windows11'],
  'win10-slow': ['instruction', 'ssd', 'virus', 'disk-cleanup']
};

const allArticleData = {
  instruction: { title: "Пошаговая инструкция", desc: "Как ускорить компьютер за 30 минут без специальных знаний", url: "/article/instruction.html", icon: "📋" },
  programs: { title: "Программы и железо", desc: "Проверенные утилиты и недорогие аксессуары для апгрейда", url: "/article/programs.html", icon: "⚡" },
  ssd: { title: "Как выбрать SSD", desc: "Простой гайд по выбору диска, чтобы ноутбук заработал быстрее", url: "/article/ssd.html", icon: "💾" },
  monitor: { title: "Как выбрать монитор", desc: "На что обратить внимание при покупке экрана для игр и работы", url: "/article/monitor.html", icon: "🖥️" },
  windows11: { title: "Секреты Windows 11", desc: "Скрытые настройки, которые сделают систему быстрее и удобнее", url: "/article/windows11.html", icon: "🪟" },
  virus: { title: "Чистка от вирусов", desc: "Как удалить вредоносное ПО и вернуть производительность", url: "/article/virus.html", icon: "🛡️" },
  gaming: { title: "Максимальный FPS", desc: "Настройки видеокарты, драйверов и охлаждения для плавной игры", url: "/article/gaming.html", icon: "🎮" },
  build: { title: "Сборка ПК", desc: "Пошаговое руководство для новичков: от выбора деталей до первого запуска", url: "/article/build.html", icon: "🔧" },
  'slow-after-update': { title: "После обновления", desc: "Что делать, если Windows начала тормозить после установки апдейта", url: "/article/slow-after-update.html", icon: "🐌" },
  'disk-cleanup': { title: "Очистка диска C", desc: "Как освободить гигабайты места на системном диске", url: "/article/disk-cleanup.html", icon: "🧹" },
  'win10-slow': { title: "Почему тормозит ноутбук", desc: "7 главных причин и решений для Windows 10", url: "/article/win10-slow.html", icon: "🐢" }
};

function renderRelatedArticles() {
  const currentId = getCurrentArticleId();
  if (!currentId || !relatedArticles[currentId]) return;

  const relatedIds = relatedArticles[currentId];
  const selected = relatedIds.slice(0, 3);
  const html = selected.map(id => {
    const article = allArticleData[id];
    if (!article) return '';
    return `
      <li class="related-item">
        <a href="${article.url}" class="related-link">
          <span class="related-title">${article.title}</span>
          <span class="related-desc">${article.desc}</span>
          <span class="related-arrow">→</span>
        </a>
      </li>
    `;
  }).join('');

  let list = document.getElementById('quickTipsList');
  if (!list) {
    const tipsBlock = document.querySelector('.quick-tips');
    if (tipsBlock) {
      list = document.createElement('ul');
      list.id = 'quickTipsList';
      tipsBlock.appendChild(list);
    }
  }

  if (list && html) {
    list.innerHTML = html;
  } else if (list) {
    list.innerHTML = '<li>Связанных статей пока нет</li>';
  }
}

function getCurrentArticleId() {
  const path = window.location.pathname;
  const match = path.match(/\/article\/(.+)\.html/);
  return match ? match[1] : null;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderRelatedArticles);
} else {
  renderRelatedArticles();
}
