/*
  Aviso de cookies (LGPD), Cheiro de Verde

  Guarda a escolha do visitante em localStorage ("cdv-consent") e só libera
  ferramentas de análise/marketing depois do consentimento.

  Para ativar uma ferramenta, cole o código dela dentro de loadAnalytics() ou
  loadMarketing() abaixo. NÃO cole direto no <head> da página, senão ela
  roda antes do consentimento.

  Para reabrir as preferências: qualquer elemento com data-cookie-prefs.
*/
(function () {
  var KEY = 'cdv-consent';
  var VERSION = 1;

  // ===== Ferramentas condicionadas ao consentimento =====

  function loadAnalytics() {
    // Google Analytics 4: substitua G-XXXXXXX pelo seu ID e descomente:
    // loadScript('https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX');
    // window.dataLayer = window.dataLayer || [];
    // window.gtag = function () { dataLayer.push(arguments); };
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXX');
  }

  function loadMarketing() {
    // Meta Pixel: cole aqui o código do pixel (sem as tags <script>).
    // Google Ads: gtag('config', 'AW-XXXXXXX');
  }

  // ======================================================

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      return c && c.v === VERSION ? c : null;
    } catch (e) { return null; }
  }

  function save(analytics, marketing) {
    var c = { v: VERSION, analytics: analytics, marketing: marketing, date: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    return c;
  }

  var loaded = { analytics: false, marketing: false };
  function apply(c) {
    if (c.analytics && !loaded.analytics) { loaded.analytics = true; loadAnalytics(); }
    if (c.marketing && !loaded.marketing) { loaded.marketing = true; loadMarketing(); }
    document.dispatchEvent(new CustomEvent('cdv:consent', { detail: c }));
  }

  var css = '' +
    '.ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:80;max-width:560px;margin-left:auto;' +
    'background:var(--paper,#fffdf8);color:var(--ink,#18221b);border:1px solid var(--line,#e3ddcf);border-radius:16px;' +
    'box-shadow:0 20px 60px rgba(24,34,27,.18);padding:24px;font:15px/1.55 var(--sans,system-ui,sans-serif)}' +
    '.ck[hidden]{display:none}' +
    '.ck h2{font:500 1.15rem/1.3 var(--serif,Georgia,serif);margin:0 0 8px}' +
    '.ck p{margin:0 0 16px;color:var(--ink-soft,#46514a)}' +
    '.ck a{color:var(--moss,#4c7a55)}' +
    '.ck-row{display:flex;gap:8px;flex-wrap:wrap}' +
    '.ck button{font:600 14px var(--sans,system-ui,sans-serif);padding:12px 16px;border-radius:10px;cursor:pointer;' +
    'border:1.5px solid var(--forest,#1d3524);background:transparent;color:var(--forest,#1d3524)}' +
    '.ck button.ck-yes{background:var(--forest,#1d3524);color:#fff}' +
    '.ck button.ck-link{border:0;padding:12px 4px;text-decoration:underline}' +
    '.ck-opts{display:grid;gap:12px;margin:0 0 16px;padding:16px 0;border-top:1px solid var(--line,#e3ddcf);border-bottom:1px solid var(--line,#e3ddcf)}' +
    '.ck-opts[hidden]{display:none}' +
    '.ck-opts label{display:flex;gap:12px;align-items:flex-start;cursor:pointer}' +
    '.ck-opts input{margin-top:4px;width:18px;height:18px;accent-color:var(--forest,#1d3524)}' +
    '.ck-opts b{display:block;font-weight:600}' +
    '.ck-opts small{color:var(--muted,#6b746d);font-size:13px}' +
    '@media (max-width:960px){.ck{bottom:96px}}';

  var html = '' +
    '<h2>Sua privacidade</h2>' +
    '<p>Usamos cookies necessários para o site funcionar e, com a sua permissão, cookies de análise e de marketing para entender o uso da página e mostrar anúncios relevantes. Saiba mais na <a href="/privacidade">Política de Privacidade</a>.</p>' +
    '<div class="ck-opts" hidden>' +
      '<label><input type="checkbox" checked disabled><span><b>Necessários</b><small>Guardam sua escolha de cookies. Sempre ativos.</small></span></label>' +
      '<label><input type="checkbox" data-ck="analytics"><span><b>Análise</b><small>Google Analytics: visitas e páginas mais acessadas.</small></span></label>' +
      '<label><input type="checkbox" data-ck="marketing"><span><b>Marketing</b><small>Meta Pixel e Google Ads: medição e personalização de anúncios.</small></span></label>' +
    '</div>' +
    '<div class="ck-row">' +
      '<button type="button" class="ck-yes" data-act="all">Aceitar todos</button>' +
      '<button type="button" data-act="none">Apenas necessários</button>' +
      '<button type="button" class="ck-link" data-act="custom">Personalizar</button>' +
    '</div>';

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.className = 'ck';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Preferências de cookies');
    box.hidden = true;
    box.innerHTML = html;
    document.body.appendChild(box);

    var opts = box.querySelector('.ck-opts');
    var customBtn = box.querySelector('[data-act="custom"]');
    var inA = box.querySelector('[data-ck="analytics"]');
    var inM = box.querySelector('[data-ck="marketing"]');

    function open() {
      var c = read();
      inA.checked = !!(c && c.analytics);
      inM.checked = !!(c && c.marketing);
      box.hidden = false;
    }
    function close(c) { box.hidden = true; opts.hidden = true; customBtn.textContent = 'Personalizar'; apply(c); }

    box.addEventListener('click', function (e) {
      var act = e.target.getAttribute('data-act');
      if (act === 'all') close(save(true, true));
      else if (act === 'none') close(save(false, false));
      else if (act === 'custom') {
        if (opts.hidden) { opts.hidden = false; customBtn.textContent = 'Salvar escolhas'; }
        else close(save(inA.checked, inM.checked));
      }
    });

    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-prefs]');
      if (t) { e.preventDefault(); open(); }
    });

    var c = read();
    if (c) apply(c); else open();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
