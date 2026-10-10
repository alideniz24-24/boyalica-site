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

  // Haberler (en yeni üstte). image: images klasöründeki dosya
  news: [
    { date: "10.10.2026", tag: "DUYURU", title: "BOYALICA KAPILARINI AÇIYOR", text: "Knight Online deneyimi artık cebinde. Kapalı test TestFlight üzerinden yakında başlıyor; yerini şimdiden ayırt.", image: "images/moradon.jpg" },
    { date: "10.10.2026", tag: "ETKİNLİK", title: "Forgotten Temple ve Juraid Mountain", text: "Her gün belirli saatlerde açılan Forgotten Temple ve Juraid Mountain etkinliklerinde ödüller seni bekliyor.", image: "images/emc.jpg" },
    { date: "10.10.2026", tag: "PVP", title: "Ronark Land'de savaş başlıyor", text: "Karus ve El Morad Ronark Land'de karşı karşıya. Ulus Puanı topla, sıralamada adını yazdır.", image: "images/ronark.jpg" }
  ],

  // Duyurular
  announcements: [
    { date: "10.10.2026", title: "Kapalı test", text: "Kapalı test iOS (TestFlight) üzerinde başlayacak. Bağlantı yayınlanınca buradan duyurulacak." },
    { date: "10.10.2026", title: "Hile koruması", text: "Hasar, drop, eşya basma ve hareket sunucu tarafında denetlenir. Hile kullanan hesaplar kapatılır." },
    { date: "10.10.2026", title: "Etkinlik saatleri", text: "Forgotten Temple 08:00 / 23:00, Juraid Mountain 14:00 / 21:00, CZ Savaş Görevi 20:00." },
    { date: "10.10.2026", title: "Topluluk", text: "Discord sunucumuz yakında açılacak; duyurular, çekilişler ve destek için takipte kal." }
  ],

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
