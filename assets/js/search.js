// Volltextsuche über Seiten, Publikationen und Medienbeiträge (Index: searchindex.json)
(function () {
  var box = document.getElementById('site-search');
  var btn = document.querySelector('.search-toggle');
  if (!box || !btn) return;
  var input = box.querySelector('.site-search-input');
  var list = box.querySelector('.site-search-results');
  var hint = box.querySelector('.site-search-hint');
  var docs = null, loading = null, lastFocus = null;

  function fold(s) {
    return (s || '').toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  // gefalteter Text + Zuordnung zu Positionen im Originaltext (für Ausschnitte)
  function prep(s) {
    var n = '', map = [];
    for (var i = 0; i < s.length; i++) {
      var f = fold(s[i]);
      for (var k = 0; k < f.length; k++) { n += f[k]; map.push(i); }
    }
    return { n: n, map: map };
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mark(orig, p, terms) {
    var ranges = [];
    terms.forEach(function (t) {
      var i = 0;
      while ((i = p.n.indexOf(t, i)) > -1) { ranges.push([p.map[i], p.map[i + t.length - 1] + 1]); i += t.length; }
    });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var out = '', pos = 0;
    ranges.forEach(function (r) { if (r[0] >= pos) { out += esc(orig.slice(pos, r[0])) + '<mark>' + esc(orig.slice(r[0], r[1])) + '</mark>'; pos = r[1]; } });
    return out + esc(orig.slice(pos));
  }
  function snippet(d, terms) {
    var i = -1;
    terms.forEach(function (t) { var j = d.xp.n.indexOf(t); if (j > -1 && (i < 0 || j < i)) i = j; });
    var start = i < 0 ? 0 : Math.max(0, d.xp.map[i] - 60);
    var end = Math.min(d.x.length, start + 190);
    if (start > 0) { var sp = d.x.indexOf(' ', start); if (sp > -1 && sp < start + 20) start = sp + 1; }
    var part = d.x.slice(start, end);
    return (start > 0 ? '… ' : '') + mark(part, prep(part), terms) + (end < d.x.length ? ' …' : '');
  }
  function load() {
    if (!loading) loading = fetch(box.dataset.index).then(function (r) { return r.json(); }).then(function (j) {
      docs = j.map(function (d) { d.x = (d.x || '').replace(/\s+/g, ' ').trim(); d.tp = prep(d.t || ''); d.xp = prep(d.x); return d; });
    }).catch(function () { docs = []; });
    return loading;
  }
  function search() {
    var q = fold(input.value).trim();
    var terms = q.split(/\s+/).filter(function (t) { return t.length > 1; });
    list.innerHTML = '';
    hint.hidden = terms.length > 0;
    if (!terms.length || !docs) return;
    var hits = [];
    docs.forEach(function (d) {
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i], inT = d.tp.n.indexOf(t) > -1, inX = d.xp.n.indexOf(t) > -1;
        if (!inT && !inX) return;
        score += (inT ? 10 : 0) + (d.tp.n.indexOf(t) === 0 ? 4 : 0) + (inX ? 1 : 0);
      }
      if (d.u.charAt(0) === '/') score += 2;   // eigene Seiten leicht bevorzugen
      hits.push([score, d]);
    });
    hits.sort(function (a, b) { return b[0] - a[0]; });
    if (!hits.length) { list.innerHTML = '<li class="site-search-empty muted">' + esc(box.dataset.noresults) + '</li>'; return; }
    list.innerHTML = hits.slice(0, 30).map(function (h) {
      var d = h[1], ext = d.u.charAt(0) !== '/';
      return '<li><a href="' + esc(d.u) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' +
        (d.s ? '<span class="site-search-sec">' + esc(d.s) + '</span>' : '') +
        '<span class="site-search-title">' + mark(d.t, d.tp, terms) + (ext ? ' <span aria-hidden="true">↗</span>' : '') + '</span>' +
        (d.x ? '<span class="site-search-snip">' + snippet(d, terms) + '</span>' : '') + '</a></li>';
    }).join('');
  }
  function open() {
    lastFocus = document.activeElement;
    box.hidden = false; document.body.classList.add('search-open');
    input.focus(); input.select();
    load().then(search);
  }
  function close() {
    box.hidden = true; document.body.classList.remove('search-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  var timer;
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(search, 80); });
  btn.addEventListener('click', open);
  box.querySelector('.site-search-close').addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var a = list.querySelector('a'); if (a) a.click(); }
    if (e.key === 'ArrowDown') { var f = list.querySelector('a'); if (f) { e.preventDefault(); f.focus(); } }
  });
  list.addEventListener('keydown', function (e) {
    var li = e.target.closest('li'); if (!li) return;
    if (e.key === 'ArrowDown' && li.nextElementSibling) { e.preventDefault(); li.nextElementSibling.querySelector('a').focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); (li.previousElementSibling ? li.previousElementSibling.querySelector('a') : input).focus(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) { close(); return; }
    var typing = /input|textarea|select/i.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if (box.hidden && ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)))) { e.preventDefault(); open(); }
  });
})();
