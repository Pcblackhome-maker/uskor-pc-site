// Централизованные данные для блока "Похожие статьи"
const relatedArticles = {
  instruction: ['programs', 'ssd', 'virus', 'gaming'],
  programs: ['instruction', 'ssd', 'virus'],
  ssd: ['instruction', 'programs', 'gaming'],
  monitor: ['gaming', 'build', 'windows11'],
  windows11: ['instruction', 'gaming', 'virus'],
  virus: ['programs', 'instruction', 'windows11'],
  gaming: ['monitor', 'ssd', 'windows11'],
  build: ['programs', 'ssd', 'monitor'],
  'slow-after-update': ['instruction', 'ssd', 'virus']
  'disk-cleanup': ['instruction', 'ssd', 'windows11']
};

const allArticleData = {
  instruction: { title: "Пошаговая инструкция", desc: "Как ускорить компьютер за 30 минут без специальных знаний", url: "/article/instruction.html" },
  programs: { title: "Программы и железо", desc: "Проверенные утилиты и недорогие аксессуары для апгрейда", url: "/article/programs.html" },
  ssd: { title: "Как выбрать SSD", desc: "Простой гайд по выбору диска, чтобы ноутбук заработал быстрее", url: "/article/ssd.html" },
  monitor: { title: "Как выбрать монитор", desc: "На что обратить внимание при покупке экрана для игр и работы", url: "/article/monitor.html" },
  windows11: { title: "Секреты Windows 11", desc: "Скрытые настройки, которые сделают систему быстрее и удобнее", url: "/article/windows11.html" },
  virus: { title: "Чистка от вирусов", desc: "Как удалить вредоносное ПО и вернуть производительность", url: "/article/virus.html" },
  gaming: { title: "Максимальный FPS", desc: "Настройки видеокарты, драйверов и охлаждения для плавной игры", url: "/article/gaming.html" },
  build: { title: "Сборка ПК", desc: "Пошаговое руководство для новичков: от выбора деталей до первого запуска", url: "/article/build.html" },
  'slow-after-update': { title: "После обновления", desc: "Что делать, если Windows начала тормозить после установки апдейта", url: "/article/slow-after-update.html" }
  'disk-cleanup': { title: "Очистка диска C", desc: "Как освободить гигабайты места на системном диске", url: "/article/disk-cleanup.html" }
};

// Функция отрисовки блока "Похожие статьи"
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

  const list = document.getElementById('quickTipsList');
  if (list && html) {
    list.innerHTML = html;
  } else if (list) {
    list.innerHTML = '<li>Связанных статей пока нет</li>';
  }
}

// Вспомогательная функция для определения текущей статьи
function getCurrentArticleId() {
  const path = window.location.pathname;
  const match = path.match(/\/article\/(.+)\.html/);
  return match ? match[1] : null;
}

// Автоматический запуск после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderRelatedArticles);
} else {
  renderRelatedArticles();
}
