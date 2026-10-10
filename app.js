(function () {
  var C = window.BOYALICA || {};
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(n) { return Number(n || 0).toLocaleString("tr-TR"); }

  $("year").textContent = new Date().getFullYear();

  // menü (telefon)
  $("burger").onclick = function () { $("menu").classList.toggle("open"); };
  document.querySelectorAll("#menu a").forEach(function (a) { a.onclick = function () { $("menu").classList.remove("open"); }; });

  // indirme / discord bağlantıları (boşsa "Yakında")
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var url = C[a.getAttribute("data-link")];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.classList.add("soon"); if (a.classList.contains("btn-discord")) a.textContent = "Yakında"; }
  });

  // kayan şerit
  var words = ["WARRIOR", "ROGUE", "MAGE", "PRIEST", "KARUS", "EL MORAD", C.serverName || "BOYALICA"];
  var t = "";
  for (var k = 0; k < 4; k++) words.forEach(function (w) { t += "<span>" + esc(w) + "</span><span class='s'>✦</span>"; });
  $("ticker").innerHTML = t + t;

  // haberler
  $("news").innerHTML = (C.news || []).map(function (n) {
    return "<article class='card news-item'><div class='img' style=\"background-image:url('" + esc(n.image) + "')\"><span class='tag'>" + esc(n.tag) + "</span></div>" +
      "<div class='body'><span class='date'>" + esc(n.date) + "</span><h3>" + esc(n.title) + "</h3><p>" + esc(n.text) + "</p></div></article>";
  }).join("");

  // duyurular
  $("ann").innerHTML = (C.announcements || []).map(function (a) {
    return "<div class='card ann-item'><span class='d'>" + esc(a.date) + "</span><div><h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p></div></div>";
  }).join("");

  // galeri + büyütme
  $("gallery").innerHTML = (C.gallery || []).map(function (g) {
    return "<figure data-src='" + esc(g.image) + "' style=\"background-image:url('" + esc(g.image) + "')\"><figcaption>" + esc(g.title) + "</figcaption></figure>";
  }).join("");
  var lb = $("lightbox");
  document.querySelectorAll(".gallery figure").forEach(function (f) {
    f.onclick = function () { lb.querySelector("img").src = f.getAttribute("data-src"); lb.classList.add("open"); };
  });
  lb.onclick = function () { lb.classList.remove("open"); };

  // sunucu verisi: sıralama + ırk yüzdesi + çevrimiçi (sahte veri yok: alınamazsa boş gösterilir)
  function emptyRows(msg) { return "<tr><td colspan='5' class='empty'>" + esc(msg) + "</td></tr>"; }
  function load() {
    if (!C.apiUrl) { setOffline("Sunucu veri adresi ayarlanmadı."); return; }
    fetch(C.apiUrl, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) {
      $("st-dot").className = "dot on";
      $("st-name").textContent = d.server || C.serverName;
      var tot = (d.karus || 0) + (d.human || 0);
      $("st-karus").textContent = tot ? "%" + Math.round(d.karus * 100 / tot) : "%0";
      $("st-human").textContent = tot ? "%" + Math.round(d.human * 100 / tot) : "%0";
      $("st-online").textContent = fmt(d.online);
      $("rank-note").textContent = "Son güncelleme: " + (d.updated || "-");
      var p = d.players || [], c = d.clans || [];
      $("rank-players").innerHTML = p.length ? p.map(function (x, i) {
        return "<tr><td class='" + (i < 3 ? "r1" : "") + "'>" + (i + 1) + "</td><td>" + esc(x.name) + "</td><td><span class='race " + esc(x.nation) + "'>" + (x.nation === "KARUS" ? "KARUS" : "EL MORAD") + "</span></td><td>" + x.level + "</td><td>" + fmt(x.np) + "</td></tr>";
      }).join("") : emptyRows("Henüz sıralamada oyuncu yok.");
      $("rank-clans").innerHTML = c.length ? c.map(function (x, i) {
        return "<tr><td class='" + (i < 3 ? "r1" : "") + "'>" + (i + 1) + "</td><td>" + esc(x.name) + "</td><td><span class='race " + esc(x.nation) + "'>" + (x.nation === "KARUS" ? "KARUS" : "EL MORAD") + "</span></td><td>" + x.members + "</td><td>" + fmt(x.np) + "</td></tr>";
      }).join("") : emptyRows("Henüz klan yok.");
    }).catch(function () { setOffline("Sunucuya şu an ulaşılamıyor."); });
  }
  function setOffline(msg) {
    $("st-dot").className = "dot";
    $("rank-note").textContent = msg;
    $("rank-players").innerHTML = emptyRows(msg);
    $("rank-clans").innerHTML = emptyRows(msg);
  }
  load();
  setInterval(load, 60000);
})();
