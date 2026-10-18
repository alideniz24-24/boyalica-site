// BOYALICA sitesi ayarları — kod bilmeden düzenlenebilir. Değiştirip kaydetmen yeterli.
window.BOYALICA = {
  // Sunucu adı (oyundaki server listesiyle aynı)
  serverName: "BOYALICA",

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
    { image: "images/karakter.jpg", title: "Karakter Seçimi" },
    { image: "images/moradon.jpg", title: "Moradon" },
    { image: "images/ronark.jpg", title: "Ronark Land" },
    { image: "images/eslant.jpg", title: "Eslant" },
    { image: "images/emc.jpg", title: "El Morad Castle" },
    { image: "images/luferson.jpg", title: "Luferson Castle" },
    { image: "images/delos.jpg", title: "Delos" }
  ]
};
