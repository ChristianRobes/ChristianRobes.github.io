(function () {
  var SB_URL = "https://mzzxxmtuxzfyahpmhpbg.supabase.co";
  var SB_KEY = "sb_publishable_Vhfd3LIYfHHtaVmlB7KkHw_cEKnyIV_";
  var last = { txt: "", t: 0 };

  function salvar(link) {
    try {
      var u = new URL(link, location.href);
      var txt = u.searchParams.get("text") || "";
      if (!txt) return;
      var agora = Date.now();
      if (txt === last.txt && agora - last.t < 5000) return; // evita duplicar
      last = { txt: txt, t: agora };

      var m = txt.match(/Total:\s*R\$[\s\u00a0]*([\d.]*\d,\d{2})/);
      var total = m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : null;

      fetch(SB_URL + "/rest/v1/pedidos", {
        method: "POST",
        keepalive: true,
        headers: {
          apikey: SB_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ itens: txt, total: total, status: "novo" })
      }).then(function (r) {
        if (!r.ok) r.text().then(function (t) { console.error("Pedido não gravado:", r.status, t); });
      }).catch(function (e) { console.error("Pedido não gravado:", e); });
    } catch (e) { console.error(e); }
  }

  // Clique em links do WhatsApp
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (a) salvar(a.href);
  }, true);

  // Caso a loja use window.open
  var abrir = window.open;
  window.open = function (url) {
    if (typeof url === "string" && url.indexOf("wa.me") > -1) salvar(url);
    return abrir.apply(this, arguments);
  };
})();
