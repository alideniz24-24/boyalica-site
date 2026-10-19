// BOYALICA sitesi ayarları — kod bilmeden düzenlenebilir. Değiştirip kaydetmen yeterli.
window.BOYALICA = {
  // Sunucu adı (oyundaki server listesiyle aynı)
  serverName: "ANTIGON",

  // Oyun sunucusunun site adresi (sıralama, ırk yüzdesi, kayıt / giriş / profil). Sonunda / olmadan.
  // Sunucu bilgisayarında: http://localhost:8090
  // İnternetten: VPS'teki Cloudflare Tüneli (ko-api) api.theknightonline.com.tr -> localhost:8090 (HTTP Host Header localhost:8090)
  apiBase: "https://api.theknightonline.com.tr",   // VPS (Cloudflare Tüneli ko-api -> localhost:8090)

  // İndirme / topluluk linkleri. Boş bırakılan düğme "Yakında" olarak görünür.
  iosUrl: "https://testflight.apple.com/join/Srn1BPmR",   // TestFlight herkese açık bağlantısı
  androidUrl: "https://github.com/alideniz24-24/boyalica-site/releases/latest/download/KOMobile.apk",   // her zaman en son APK (android-vN release)
  discordUrl: "",    // Discord davet bağlantısı
  instagramUrl: "https://www.instagram.com/theknightonline.com.tr/",   // Instagram hesabı

  // Haberler ve duyurular news.json dosyasında (oyundaki launcher da oradan okur)

  // Galeri: images klasöründeki görüntüler
  gallery: [
    { image: "images/karakter.jpg?v=2", title: "Karakter Seçimi" },
    { image: "images/giris.jpg?v=2", title: "Giriş Ekranı" },
    { image: "images/moradon.jpg?v=2", title: "Moradon" },
    { image: "images/emc.jpg?v=2", title: "El Morad Castle" },
    { image: "images/savas.jpg?v=2", title: "El Morad Castle Savaşı" },
    { image: "images/ronark.jpg?v=2", title: "Ronark Land" },
    { image: "images/cz-gorev.jpg?v=2", title: "CZ Savaş Görevi" },
    { image: "images/ft.jpg?v=2", title: "Forgotten Temple" },
    { image: "images/juraid.jpg?v=2", title: "Juraid Mountain" },
    { image: "images/deva.jpg?v=2", title: "Deva. Bird" },
    { image: "images/delos.jpg?v=2", title: "Delos" },
    { image: "images/genie.jpg?v=2", title: "Genie Ayarları" },
    { image: "images/envanter.jpg?v=2", title: "Envanter ve Set" }
  ]
};
