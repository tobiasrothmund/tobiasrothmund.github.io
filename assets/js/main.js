(function () {
  var root = document.documentElement;

  // Farbschema umschalten (hell/dunkel), Wahl wird im Browser gemerkt
  var tbtn = document.querySelector('.theme-toggle');
  if (tbtn) tbtn.addEventListener('click', function () {
    var cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobiles Menü
  var mbtn = document.querySelector('.menu-toggle');
  if (mbtn) mbtn.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    mbtn.setAttribute('aria-expanded', open);
  });

  // Linie unter der Kopfzeile beim Scrollen
  var header = document.querySelector('.site-header');
  var onScroll = function () { header && header.classList.toggle('is-scrolled', scrollY > 8); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Filter & Suche (Publikationen, Medien)
  var tb = document.querySelector('[data-filter-root]');
  var list = document.querySelector('[data-filter-list]');
  if (tb && list) {
    var items = list.querySelectorAll('[data-type]');
    var input = tb.querySelector('[data-search-input]');
    var empty = list.querySelector('.no-results');
    var type = 'all';
    var apply = function () {
      var q = input ? input.value.trim().toLowerCase() : '';
      var shown = 0;
      items.forEach(function (el) {
        var ok = (type === 'all' || el.dataset.type === type) && (!q || (el.dataset.search || el.textContent.toLowerCase()).indexOf(q) > -1);
        el.hidden = !ok; if (ok) shown++;
      });
      list.querySelectorAll('[data-year]').forEach(function (g) {
        g.hidden = !g.querySelector('[data-type]:not([hidden])');
      });
      if (empty) empty.hidden = shown > 0;
    };
    tb.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        tb.querySelectorAll('[data-filter]').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active'); type = b.dataset.filter; apply();
      });
    });
    if (input) input.addEventListener('input', apply);
  }

  // Zitation kopieren
  document.querySelectorAll('.cite-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = b.textContent;
      var done = function () { b.textContent = b.dataset.done; setTimeout(function () { b.textContent = label; }, 1600); };
      var txt = b.dataset.apa, html = b.dataset.apaHtml;
      if (navigator.clipboard && window.ClipboardItem && html) {
        navigator.clipboard.write([new ClipboardItem({
          'text/plain': new Blob([txt], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' })
        })]).then(done, function () { navigator.clipboard.writeText(txt).then(done, function () {}); });
      } else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {});
    });
  });

  // Aktiven Abschnitt im Inhaltsverzeichnis markieren
  var toc = document.querySelector('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = {};
    toc.querySelectorAll('a[href^="#"]').forEach(function (a) { links[decodeURIComponent(a.hash.slice(1))] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && links[e.target.id]) {
          toc.querySelectorAll('a').forEach(function (a) { a.classList.remove('is-active'); });
          links[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '0px 0px -70% 0px' });
    document.querySelectorAll('.prose h2[id], .prose h3[id]').forEach(function (h) { obs.observe(h); });
  }
})();
