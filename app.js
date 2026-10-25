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
  var words = ["WARRIOR", "ROGUE", "MAGE", "PRIEST", "KARUS", "EL MORAD", C.serverName || "ANTIGON"];
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
  // sıra: ilk 3 madalya (altın / gümüş / bronz)
  function rk(i) { return "<td class='rk'>" + (i < 3 ? "<span class='medal m" + (i + 1) + "'>" + (i + 1) + "</span>" : (i + 1)) + "</td>"; }
  function race(n) { return "<span class='race " + esc(n) + "'>" + (n === "KARUS" ? "KARUS" : "EL MORAD") + "</span>"; }
  // oyundaki KO NP simgesi (OfflineNetRank ile aynı): ırk içi sıra; ulusal (toplam NP, sarı kareli) ilk 100, aylık (karesiz) ilk 200
  function tier(r, monthly) { return r === 1 ? 1 : r <= 4 ? 2 : r <= 9 ? 3 : r <= 25 ? 4 : r <= (monthly ? 100 : 50) ? 5 : r <= (monthly ? 200 : 100) ? 6 : 0; }
  function symbols(list, kind) {
    var seen = {};
    return list.map(function (x) {
      var r = seen[x.nation] = (seen[x.nation] || 0) + 1;
      var t = kind === "clans" || (kind === "monthly" ? !(x.monthly > 0) : !(x.np > 0)) ? 0 : tier(r, kind === "monthly");
      return t ? "<img class='npsym' src='images/rank/" + (kind === "monthly" ? "aylik_" : "ulusal_") + t + ".png' alt=''>" : "";
    });
  }
  function nameCell(name, sym) { return "<td class='nm'><div>" + (sym || "") + "<span>" + esc(name) + "</span></div></td>"; }
  function emptyRows(msg) { return "<tr><td colspan='5' class='empty'>" + esc(msg) + "</td></tr>"; }
  function load() {
    if (!C.apiBase) { setOffline("Sunucu adresi ayarlanmadı."); return; }
    fetch(C.apiBase + "/api/site.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) {
      $("st-dot").className = "dot on";
      $("st-name").textContent = d.server || C.serverName;
      var tot = (d.karus || 0) + (d.human || 0);
      $("st-karus").textContent = tot ? "%" + Math.round(d.karus * 100 / tot) : "%0";
      $("st-human").textContent = tot ? "%" + Math.round(d.human * 100 / tot) : "%0";
      $("rank-note").textContent = "Son güncelleme: " + (d.updated || "-");
      var p = d.players || [], c = d.clans || [];
      var ps = symbols(p, "players");
      $("rank-players").innerHTML = p.length ? p.map(function (x, i) {
        return "<tr>" + rk(i) + nameCell(x.name, ps[i]) + "<td>" + race(x.nation) + "</td><td>" + x.level + "</td><td>" + fmt(x.np) + "</td></tr>";
      }).join("") : emptyRows("Henüz sıralamada oyuncu yok.");
      // aylık NP (sunucu eskiyse alan yok)
      var mo = d.monthly;
      $("rank-monthly").innerHTML = mo === undefined ? emptyRows("Sunucu güncellemesi bekleniyor.") : mo.length ? mo.map(function (x, i, a) {
        return "<tr>" + rk(i) + nameCell(x.name, symbols(a, "monthly")[i]) + "<td>" + race(x.nation) + "</td><td>" + x.level + "</td><td>" + fmt(x.monthly) + "</td></tr>";
      }).join("") : emptyRows("Bu ay henüz NP kazanan yok.");
      $("rank-clans").innerHTML = c.length ? c.map(function (x, i) {
        return "<tr>" + rk(i) + nameCell(x.name) + "<td>" + race(x.nation) + "</td><td>" + x.members + "</td><td>" + fmt(x.np) + "</td></tr>";
      }).join("") : emptyRows("Henüz klan yok.");
    }).catch(function () { setOffline("Sunucuya şu an ulaşılamıyor."); });
  }
  function setOffline(msg) {
    $("st-dot").className = "dot";
    $("rank-note").textContent = msg;
    $("rank-players").innerHTML = emptyRows(msg);
    $("rank-clans").innerHTML = emptyRows(msg);
    $("rank-monthly").innerHTML = emptyRows(msg);
  }
  load();
  setInterval(load, 60000);

  // "Tümünü Gör": bütün oyuncular / aylık NP / klanlar (sunucu /api/all.json), arama + ırk süzgeci
  var allData = null, allTab = "players", allRace = "", allAt = 0;
  var allCols = {
    players: ["#", "Oyuncu", "Irk", "Lv", "NP"],
    monthly: ["#", "Oyuncu", "Irk", "Lv", "Aylık NP"],
    clans: ["#", "Klan", "Irk", "Üye", "NP"]
  };
  function renderAll() {
    $("all-head").innerHTML = "<tr>" + allCols[allTab].map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr>";
    if (!allData) { $("all-body").innerHTML = emptyRows("Yükleniyor..."); $("all-count").textContent = ""; return; }
    var list = allData[allTab] || [], sy = symbols(list, allTab), q = $("all-q").value.trim().toLocaleLowerCase("tr-TR"), rows = [];
    list.forEach(function (x, i) {
      if (allRace && x.nation !== allRace) return;
      if (q && String(x.name).toLocaleLowerCase("tr-TR").indexOf(q) < 0) return;
      var last = allTab === "clans" ? [x.members, fmt(x.np)] : [x.level, fmt(allTab === "monthly" ? x.monthly : x.np)];
      rows.push("<tr>" + rk(i) + nameCell(x.name, sy[i]) + "<td>" + race(x.nation) + "</td><td>" + last[0] + "</td><td>" + last[1] + "</td></tr>");
    });
    $("all-body").innerHTML = rows.length ? rows.join("") : emptyRows(list.length ? "Aramaya uyan kayıt yok." : "Henüz kayıt yok.");
    $("all-count").textContent = rows.length + " / " + list.length + " kayıt · Son güncelleme: " + (allData.updated || "-");
  }
  function openAll(tab) {
    allTab = tab;
    document.querySelectorAll("#all-tabs button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-t") === tab); });
    $("all-modal").hidden = false;
    renderAll();
    if (allData && Date.now() - allAt < 60000) return;
    if (!C.apiBase) { allData = { players: [], monthly: [], clans: [] }; renderAll(); return; }
    fetch(C.apiBase + "/api/all.json", { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      if (!d || !d.players) throw 0;
      allData = d; allAt = Date.now(); renderAll();
    }).catch(function () { $("all-body").innerHTML = emptyRows("Tüm liste için sunucu güncellemesi bekleniyor."); });
  }
  document.querySelectorAll(".see-all").forEach(function (b) { b.onclick = function () { openAll(b.getAttribute("data-all")); }; });
  document.querySelectorAll("#all-tabs button").forEach(function (b) { b.onclick = function () { openAll(b.getAttribute("data-t")); }; });
  document.querySelectorAll("#all-race button").forEach(function (b) {
    b.onclick = function () {
      allRace = b.getAttribute("data-r");
      document.querySelectorAll("#all-race button").forEach(function (o) { o.classList.toggle("on", o === b); });
      renderAll();
    };
  });
  $("all-q").oninput = renderAll;
  $("all-x").onclick = function () { $("all-modal").hidden = true; };
  $("all-modal").onclick = function (e) { if (e.target === $("all-modal")) $("all-modal").hidden = true; };

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
    $("forgot-form").hidden = $("reset-form").hidden = true;
    $("l-msg").textContent = $("r-msg").textContent = "";
  }
  // şifremi unuttum / sıfırlama (#sifirla/<anahtar>, e-postadaki bağlantı)
  function openForm(id) {
    modal.hidden = false;
    ["login-form", "reg-form", "forgot-form", "reset-form"].forEach(function (f) { $(f).hidden = f !== id; });
    $("tab-login").classList.toggle("on", id !== "reg-form");
    $("tab-reg").classList.toggle("on", id === "reg-form");
  }
  var resetToken = null;
  $("l-forgot").onclick = function (e) { e.preventDefault(); $("f-msg").textContent = ""; $("f-user").value = $("l-user").value.trim(); openForm("forgot-form"); };
  $("f-back").onclick = function (e) { e.preventDefault(); openModal(false); };
  $("forgot-form").onsubmit = function (e) {
    e.preventDefault();
    var m = $("f-msg"), btn = this.querySelector("button");
    m.className = "msg";
    btn.disabled = true;
    api("/api/forgot", { user: $("f-user").value.trim().toLowerCase(), email: $("f-email").value.trim() }, function (r) {
      btn.disabled = false;
      if (r.ok) { m.className = "msg ok"; m.textContent = r.info || "E-posta gönderildi."; } else m.textContent = r.error || "Gönderilemedi.";
    });
  };
  $("reset-form").onsubmit = function (e) {
    e.preventDefault();
    var m = $("x-msg"), btn = this.querySelector("button");
    m.className = "msg";
    if ($("x-pass").value !== $("x-pass2").value) { m.textContent = "Şifreler aynı değil."; return; }
    btn.disabled = true;
    api("/api/reset", { token: resetToken, pass: $("x-pass").value }, function (r) {
      btn.disabled = false;
      if (r.ok) { m.className = "msg ok"; m.textContent = "Şifren değiştirildi. Siteye ve oyuna yeni şifrenle giriş yapabilirsin."; $("reset-form").reset(); resetToken = null; }
      else m.textContent = r.error || "Şifre değiştirilemedi.";
    });
  };
  $("tab-login").onclick = function () { openModal(false); };
  $("tab-reg").onclick = function () { openModal(true); };
  $("hero-reg").onclick = function () { openModal(true); };
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
    if (location.hash.indexOf("#sifirla/") === 0) {
      resetToken = location.hash.substring(9);
      history.replaceState(null, "", location.pathname);
      $("x-msg").textContent = "";
      openForm("reset-form");
    }
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
      $("em-now").textContent = d.email || "-";
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
  $("em-form").onsubmit = function (e) {
    e.preventDefault();
    var m = $("em-msg"), btn = this.querySelector("button");
    m.className = "msg";
    btn.disabled = true;
    api("/api/email", { old: $("em-pass").value, email: $("em-new").value.trim() }, function (r) {
      btn.disabled = false;
      if (r.ok) { m.className = "msg ok"; m.textContent = "E-posta kaydedildi."; $("em-now").textContent = $("em-new").value.trim(); $("em-form").reset(); }
      else m.textContent = r.error || "Kaydedilemedi.";
    });
  };
  window.addEventListener("hashchange", route);
  renderAuth();
  route();
})();
