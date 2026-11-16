(function () {
  var SB_URL = 'https://mzzxxmtuxzfyahpmhpbg.supabase.co';
  var SB_KEY = 'sb_publishable_Vhfd3LIYfHHtaVmlB7KkHw_cEKnyIV_';
  var last = 0;

  function save(url) {
    if (Date.now() - last < 5000) return;
    last = Date.now();
    var txt = '';
    try {
      txt = decodeURIComponent((url.split('text=')[1] || '').split('&')[0].replace(/\+/g, ' '));
    } catch (e) {}
    var m = txt.match(/total[^0-9]*([\d.]+,\d{2})/i);
    var total = m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : 0;
    fetch(SB_URL + '/rest/v1/pedidos', {
      method: 'POST',
      keepalive: true,
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        itens: [{ name: 'Pedido via WhatsApp', mensagem: txt }],
        total: total,
        status: 'Novo'
      })
    }).catch(function () {});
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"],a[href*="whatsapp.com"]');
    if (a) save(a.href);
  }, true);

  var _open = window.open;
  window.open = function (u) {
    if (typeof u === 'string' && /wa\.me|whatsapp\.com/.test(u)) save(u);
    return _open.apply(window, arguments);
  };
})();
