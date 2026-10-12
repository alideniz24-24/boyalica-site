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

  // haberler + duyurular: news.json (oyundaki launcher da okur)
  function renderNews(N) {
  $("news").innerHTML = (N.news || []).map(function (n) {
    return "<article class='card news-item'><div class='img' style=\"background-image:url('" + esc(n.image) + "')\"><span class='tag'>" + esc(n.tag) + "</span></div>" +
      "<div class='body'><span class='date'>" + esc(n.date) + "</span><h3>" + esc(n.title) + "</h3><p>" + esc(n.text) + "</p></div></article>";
  }).join("");

  $("ann").innerHTML = (N.announcements || []).map(function (a) {
    return "<div class='card ann-item'><span class='d'>" + esc(a.date) + "</span><div><h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p></div></div>";
  }).join("");
  }
  fetch("news.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(renderNews).catch(function () { renderNews({}); });

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
    if (!C.apiBase) { setOffline("Sunucu adresi ayarlanmadı."); return; }
    fetch(C.apiBase + "/api/site.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) {
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

  // ---------- hesap: kayıt / giriş / profil (oyun hesabıyla aynı) ----------
  var TK = "boyalica.token", UK = "boyalica.user";
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function stored(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function api(path, body, cb) {
    if (!C.apiBase) { cb({ ok: false, error: "Sunucu adresi ayarlanmadı." }); return; }
    var h = { "Content-Type": "application/json" };
    var t = stored(TK);
    if (t) h.Authorization = "Bearer " + t;
    fetch(C.apiBase + path, { method: body ? "POST" : "GET", headers: h, body: body ? JSON.stringify(body) : undefined, cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(cb)
      .catch(function () { cb({ ok: false, error: "Sunucuya şu an ulaşılamıyor." }); });
  }

  var auth = $("auth");
  function renderAuth() {
    var u = stored(UK);
    if (!u) {
      auth.innerHTML = "<button class='btn-line' id='b-login'>Giriş Yap</button><button class='btn-gold' id='b-reg'>Kayıt Ol</button>";
      $("b-login").onclick = function () { openModal(false); };
      $("b-reg").onclick = function () { openModal(true); };
      return;
    }
    auth.innerHTML = "<button class='user-chip' id='b-user'><span class='avatar'>" + esc(u.charAt(0)) + "</span><span class='uname'>" + esc(u) + "</span> ▾</button>" +
      "<div class='dropdown' id='dd'><a href='#profil'>Hesap Bilgilerim</a><a href='#profil/karakterler'>Karakterlerim</a><a href='#profil/sifre'>Şifre Değiştir</a><a id='b-out'>Çıkış Yap</a></div>";
    $("b-user").onclick = function (e) { e.stopPropagation(); $("dd").classList.toggle("open"); };
    $("b-out").onclick = logout;
  }
  function logout() { api("/api/logout", {}, function () {}); store(TK, null); store(UK, null); renderAuth(); location.hash = "#top"; }
  document.addEventListener("click", function () { var d = $("dd"); if (d) d.classList.remove("open"); });

  var modal = $("modal");
  function openModal(reg) {
    modal.hidden = false;
    $("tab-login").classList.toggle("on", !reg);
    $("tab-reg").classList.toggle("on", reg);
    $("login-form").hidden = reg;
    $("reg-form").hidden = !reg;
    $("l-msg").textContent = $("r-msg").textContent = "";
  }
  $("tab-login").onclick = function () { openModal(false); };
  $("tab-reg").onclick = function () { openModal(true); };
  $("modal-x").onclick = function () { modal.hidden = true; };
  modal.onclick = function (e) { if (e.target === modal) modal.hidden = true; };

  function loggedIn(r) {
    store(TK, r.token);
    store(UK, r.user);
    modal.hidden = true;
    renderAuth();
    location.hash = "#profil";
    route();
  }
  $("login-form").onsubmit = function (e) {
    e.preventDefault();
    var btn = this.querySelector("button");
    btn.disabled = true;
    api("/api/login", { user: $("l-user").value.trim(), pass: $("l-pass").value }, function (r) {
      btn.disabled = false;
      if (r.ok) loggedIn(r); else $("l-msg").textContent = r.error || "Giriş yapılamadı.";
    });
  };
  $("reg-form").onsubmit = function (e) {
    e.preventDefault();
    var m = $("r-msg");
    var user = $("r-user").value.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,16}$/.test(user)) { m.textContent = "Kullanıcı adı 3-16 karakter olmalı (a-z, 0-9, _)."; return; }
    if ($("r-pass").value !== $("r-pass2").value) { m.textContent = "Şifreler aynı değil."; return; }
    var btn = this.querySelector("button");
    btn.disabled = true;
    api("/api/register", { user: user, pass: $("r-pass").value, email: $("r-email").value.trim() }, function (r) {
      btn.disabled = false;
      if (r.ok) loggedIn(r); else m.textContent = r.error || "Kayıt olunamadı.";
    });
  };

  // profil sayfası (#profil)
  function route() {
    // oyundaki "Kayıt Ol" düğmesi siteyi #kayit ile açar
    if (location.hash === "#kayit") { openModal(true); history.replaceState(null, "", location.pathname); }
    var prof = location.hash === "#profil" || location.hash.indexOf("#profil/") === 0;
    if (prof && !stored(TK)) { openModal(false); location.hash = "#top"; prof = false; }
    document.body.classList.toggle("in-profile", prof);
    $("profil").hidden = !prof;
    if (prof) { showPane(location.hash); window.scrollTo(0, 0); loadProfile(); }
  }
  // panel sayfaları: #profil (bilgi), #profil/karakterler, #profil/sifre
  var PANES = {
    bilgi: ["Hesap Bilgilerim", "Hesap ve kullanıcı bilgilerini görüntüle"],
    karakter: ["Karakterlerim", "Hesabındaki karakterler ve bilgileri"],
    sifre: ["Şifre Değiştir", "Oyun ve site şifreni güncelle"]
  };
  function showPane(hash) {
    var key = hash === "#profil/karakterler" ? "karakter" : hash === "#profil/sifre" ? "sifre" : "bilgi";
    document.querySelectorAll(".pane").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== key; });
    document.querySelectorAll(".panel-nav a[data-pane]").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-pane") === key); });
    $("pane-title").textContent = PANES[key][0];
    $("pane-sub").textContent = PANES[key][1];
  }
  $("nav-out").onclick = logout;
  function loadProfile() {
    api("/api/me", null, function (d) {
      if (!d.ok) {
        if (/Oturum/.test(d.error || "")) { store(TK, null); store(UK, null); renderAuth(); location.hash = "#top"; openModal(false); $("l-msg").textContent = d.error; return; }
        $("p-chars").innerHTML = "<div class='card empty-card'>" + esc(d.error) + "</div>";
        return;
      }
      $("p-avatar").textContent = d.user.charAt(0);
      $("p-user").textContent = d.user;
      var st = $("p-status");
      st.textContent = d.status;
      st.className = "status" + (d.status === "Aktif" ? "" : " bad");
      $("p-name").textContent = d.user;
      $("p-email").textContent = d.email;
      $("p-play").textContent = d.playTime;
      $("p-state").textContent = d.status;
      $("p-last").textContent = d.lastLogin;
      $("p-created").textContent = d.created;
      $("p-last-h").textContent = d.lastLogin;
      $("p-created-h").textContent = d.created;
      $("p-rank").textContent = d.maxLevel >= 83 ? "Efsane" : d.maxLevel >= 60 ? "Usta Oyuncu" : "Oyuncu";
      $("s-play").textContent = String(d.playTime || "-").replace(" saat ", "s ").replace(" dk", "dk");
      $("s-chars").textContent = d.charCount;
      $("s-np").textContent = fmt(d.totalNp);
      $("s-lvl").textContent = d.maxLevel;
      var jobs = { Warrior: "Warrior", Rogue: "Rogue", Mage: "Mage", Priest: "Priest" };
      $("p-chars").innerHTML = (d.characters || []).length ? d.characters.map(function (c) {
        var karus = c.nation === "KARUS";
        return "<div class='card char-card " + (karus ? "ka" : "el") + "'>" +
          "<div class='char-top'><div class='char-ico'>" + esc((jobs[c.job] || c.job || "?").charAt(0)) + "</div>" +
          "<div><h3>" + esc(c.name) + "</h3><span class='char-job'>" + esc(jobs[c.job] || c.job) + "</span></div>" +
          "<span class='race " + esc(c.nation) + "'>" + (karus ? "KARUS" : "EL MORAD") + "</span></div>" +
          "<dl class='char-stats'><dt>Seviye</dt><dd>" + c.level + "</dd><dt>NP</dt><dd>" + fmt(c.np) + "</dd><dt>Klan</dt><dd>" + esc(c.clan) + "</dd></dl></div>";
      }).join("") : "<div class='card empty-card'>Henüz karakterin yok. Oyuna girip karakter oluşturabilirsin.</div>";
    });
  }
  $("pw-form").onsubmit = function (e) {
    e.preventDefault();
    var m = $("pw-msg");
    m.className = "msg";
    if ($("pw-new").value !== $("pw-new2").value) { m.textContent = "Yeni şifreler aynı değil."; return; }
    var btn = this.querySelector("button");
    btn.disabled = true;
    api("/api/password", { old: $("pw-old").value, pass: $("pw-new").value }, function (r) {
      btn.disabled = false;
      if (r.ok) { m.className = "msg ok"; m.textContent = "Şifren değiştirildi. Oyuna yeni şifrenle gir."; $("pw-form").reset(); }
      else m.textContent = r.error || "Şifre değiştirilemedi.";
    });
  };
  window.addEventListener("hashchange", route);
  renderAuth();
  route();
})();
