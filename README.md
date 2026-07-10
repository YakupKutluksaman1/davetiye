# Naz & Yakup — Dijital Davetiye

Naz & Yakup'un kına ve yemekli eğlence davetiyesi. WhatsApp üzerinden paylaşılabilir animasyonlu dijital davetiye.

## Etkinlikler

| Tarih | Etkinlik | Mekân | Saat |
|-------|----------|-------|------|
| 2 Ekim 2026 | Kına | Atmosfer Cafe, Konak/İzmir | 20:00 |
| 3 Ekim 2026 | Yemekli Eğlence | İlk Adresim, Konak/İzmir | 20:00 |

## Özellikler

- Açılış zarf animasyonu
- Kına ve yemekli eğlence etkinlik kartları
- Google Maps yönlendirme
- Geri sayım sayacı
- Fotoğraf galerisi (slideshow + polaroid)
- Arka plan müziği (YouTube)
- Mobil uyumlu tasarım
- WhatsApp önizleme desteği (Open Graph)

## Yerel Çalıştırma

```bash
npx serve .
```

Tarayıcıda `http://localhost:3000` adresini açın.

## Fotoğraf Ekleme

1. Fotoğrafları `photos/` klasörüne koyun
2. `index.html` içindeki placeholder'ları `<img>` ile değiştirin:

```html
<div class="polaroid-img">
  <img src="photos/foto1.jpg" alt="Açıklama" loading="lazy">
</div>
```

Slayt için:

```html
<div class="slide active" data-caption="Birlikte...">
  <img src="photos/foto1.jpg" alt="Birlikte" loading="lazy">
</div>
```

## Deploy

GitHub'a push edildiğinde Vercel otomatik deploy eder.

## Link Paylaşımı (WhatsApp)

```
Merhaba! 🎉 Naz & Yakup'un davetiyesine buradan ulaşabilirsiniz:
https://davetiye-xxx.vercel.app
```
