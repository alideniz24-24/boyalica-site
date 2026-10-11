// BOYALICA sitesi ayarları — kod bilmeden düzenlenebilir. Değiştirip kaydetmen yeterli.
window.BOYALICA = {
  // Sunucu adı (oyundaki server listesiyle aynı)
  serverName: "BOYALICA",

  // Oyun sunucusunun site adresi (sıralama, ırk yüzdesi, kayıt / giriş / profil). Sonunda / olmadan.
  // Sunucu bilgisayarında: http://localhost:8090
  // İnternetten erişim için https gerekir (site https): 8090 portunu Cloudflare Tunnel ile açıp o adresi yaz, ör. "https://boyalica-api.ornek.com"
  apiBase: "http://localhost:8090",

  // İndirme / topluluk linkleri. Boş bırakılan düğme "Yakında" olarak görünür.
  iosUrl: "",        // TestFlight herkese açık bağlantısı (onaydan sonra)
  androidUrl: "",    // Android sürümü çıkınca
  discordUrl: "",    // Discord davet bağlantısı

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
