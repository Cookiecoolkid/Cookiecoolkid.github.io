/* global Fluid */

Fluid.boot = {};

Fluid.boot.registerEvents = function() {
  Fluid.events.billboard();
  Fluid.events.registerNavbarEvent();
  Fluid.events.registerParallaxEvent();
  Fluid.events.registerScrollDownArrowEvent();
  Fluid.events.registerScrollTopArrowEvent();
  Fluid.events.registerImageLoadedEvent();
};

Fluid.boot.refresh = function() {
  Fluid.plugins.fancyBox();
  Fluid.plugins.codeWidget();
  Fluid.events.refresh();
};

function initPersonalSiteShell() {
  var body = document.body;
  if (!body || body.classList.contains('site-page') || body.dataset.personalShell) {
    return;
  }

  body.dataset.personalShell = 'true';
  body.classList.add('legacy-page');

  var main = document.querySelector('body > main');
  var oldHeader = document.querySelector('body > header:not([data-site-shell])');
  var oldFooter = document.querySelector('body > footer');
  var post = main && main.querySelector('.post-content');
  var titleNode = post && post.querySelector('#seo-header');
  var dateNode = oldHeader && oldHeader.querySelector('time[pubdate]');
  var title = titleNode ? titleNode.textContent.trim() : document.title.replace(/\s*-\s*Cookiecoolkid$/, '');
  var date = dateNode ? dateNode.textContent.trim() : '';

  if (oldHeader) oldHeader.remove();
  if (oldFooter) oldFooter.remove();
  var searchModal = document.getElementById('modalSearch');
  if (searchModal) searchModal.remove();
  var scrollTop = document.getElementById('scroll-top-button');
  if (scrollTop) scrollTop.remove();

  var shell = document.createElement('header');
  shell.className = 'legacy-site-header site-header';
  shell.dataset.siteShell = 'true';
  shell.innerHTML = '<nav class="site-nav" aria-label="Primary navigation">'
    + '<a class="site-brand" href="/">Lizheng Chen</a>'
    + '<div class="site-links">'
    + '<a href="/#about">about</a>'
    + '<a href="/blog/">blog</a>'
    + '<button class="theme-toggle" type="button" data-legacy-theme-toggle aria-label="切换颜色主题"></button>'
    + '</div></nav>';
  body.insertBefore(shell, main || body.firstChild);

  var themeButton = shell.querySelector('[data-legacy-theme-toggle]');
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeButton.textContent = theme === 'dark' ? '☼' : '◐';
    themeButton.title = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
  }
  applyTheme(document.documentElement.dataset.theme || 'dark');
  themeButton.addEventListener('click', function() {
    var nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { window.localStorage.setItem('lizheng-site-theme', nextTheme); } catch (error) { /* ignore */ }
    applyTheme(nextTheme);
  });

  if (main && post) {
    body.classList.add('legacy-post');
    var articleHead = document.createElement('header');
    articleHead.className = 'legacy-article-head';
    articleHead.innerHTML = '<p class="eyebrow">Blog</p><h1></h1>' + (date ? '<time></time>' : '');
    articleHead.querySelector('h1').textContent = title;
    if (date) articleHead.querySelector('time').textContent = date;
    main.replaceChildren(articleHead, post);
  }

  var footer = document.createElement('div');
  footer.className = 'site-footer';
  footer.dataset.siteShell = 'true';
  footer.innerHTML = '<p>© 2026 Lizheng Chen.</p>';
  if (main) main.insertAdjacentElement('afterend', footer);
}

document.addEventListener('DOMContentLoaded', function() {
  Fluid.boot.registerEvents();
  initPersonalSiteShell();
});
