(function () {
  'use strict';

  var storageKey = 'lizheng-site-theme';

  function getTheme() {
    try {
      var saved = window.localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (error) { /* Storage may be unavailable in privacy modes. */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.textContent = theme === 'dark' ? '☼' : '◐';
      button.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
      button.setAttribute('title', button.getAttribute('aria-label'));
    });
  }

  function bindThemeToggle() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        try { window.localStorage.setItem(storageKey, nextTheme); } catch (error) { /* ignore */ }
        setTheme(nextTheme);
      });
    });
  }

  function bindBlogSearch() {
    var search = document.querySelector('[data-blog-search]');
    var posts = Array.prototype.slice.call(document.querySelectorAll('[data-post-item]'));
    var empty = document.querySelector('[data-no-results]');
    var count = document.querySelector('[data-post-count]');
    if (!search || !posts.length) return;

    function filter() {
      var term = search.value.trim().toLocaleLowerCase();
      var shown = 0;
      posts.forEach(function (post) {
        var visible = !term || post.textContent.toLocaleLowerCase().indexOf(term) !== -1;
        post.hidden = !visible;
        if (visible) shown += 1;
      });
      if (empty) empty.classList.toggle('is-visible', shown === 0);
      if (count) count.textContent = term ? '找到 ' + shown + ' 篇文章' : '共 ' + posts.length + ' 篇文章';
    }

    search.addEventListener('input', filter);
  }

  function boot() {
    setTheme(getTheme());
    bindThemeToggle();
    bindBlogSearch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
