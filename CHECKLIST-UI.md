# Checklist manual — Chrome, Safari, ponsel nyata

Tes logika/build/render statis sudah dijalankan. Checklist berikut belum diuji langsung di browser pada lingkungan pengerjaan ini.

## Desktop Chrome dan Safari

- [ ] Reload: dua banner masuk bertahap di kanan atas; close bekerja, tidak meminta izin browser. Hover/fokus menunda hilangnya banner.
- [ ] Klik reminder Notes saat Notes tertutup: tampil About. Pilih Experience lalu Help → Show welcome; klik reminder lagi: kembali About, search Notes kosong.
- [ ] Control Center → Light/Dark: semua app, sidebar, forms, tables, buttons, alerts dan popover memakai warna sesuai. Ikon opsi appearance tetap terbaca.
- [ ] Reload tetap mengingat mode manual. Pilih Auto; tes sekitar jam lokal06:00 dan18:00 atau ubah jam perangkat uji, lalu fokus ulang tab.
- [ ] Storage diblokir/private browsing: website tetap terbuka. Dua tab: preferensi tema manual tersinkron.
- [ ] Search via ikon dan Ctrl/Cmd+K; cari judul/kategori/tools/app. Panah memilih serta menggulir hasil; Enter membuka, empty state muncul untuk kata tidak cocok, Esc/click-outside menutup.
- [ ] Tab/Shift+Tab pada search/skill alert tetap dalam dialog; setelah tutup fokus kembali ke pemicu yang masih ada.
- [ ] File/View/Window/Help bekerja; menu dapat ditutup dengan Esc/click-outside, navigasi panah berfungsi. Window list memulihkan window minimize.
- [ ] Dock artwork36px dan glass transparan. Hover tidak membuat ikon bertumpuk; kaca melebar; dot/bounce/minimize/restore tetap benar. Tes juga viewport769px.
- [ ] Buka beberapa window, drag, resize8arah, fokus, double-clicktitlebar; zoom menutupi viewport edge-to-edge, restore mengembalikan frame, resize layar tidak membuatnya hilang.
- [ ] Finder kategori dan icon/list view, path/back/forward/search/Get Info; metadata sesuai data karya.
- [ ] Trash virtual: pindahkan karya, Put Back, restoreall, konfirmasi empty. Ini hanya memengaruhi state portfolio.
- [ ] Notes tab dan panah, Gallery/project images, Mail links dan CTA skill tetap berfungsi. Thumbnail drag tidak memicu open dan tidak punya solid background.
- [ ] Reduced motion mematikan gerak besar/magnification; reduced transparency memakai permukaan solid; focus ring tetap jelas di Light/Dark.
- [ ] Pointer, resize cursor, scrollbar dan glass dibandingkan pada foto wallpaper terang/gelap.

## Ponsel nyata — Safari iPhone dan Chrome Android

- [ ] Grid dua kolom; wallpaper dim/blur; scroll tidak tertutup Dock/safe-area. Tes320/375/430px dan rotate.
- [ ] Header tidak overflow. Tombol logo/search/Control Center minimal44px. Di ≤420px indikator dekoratif disembunyikan.
- [ ] Sheet slide-up/close/swipe-down bekerja; scroll gambar panjang tidak menutup sheet tanpa sengaja. Tidak ada drag window atau magnification Dock.
- [ ] Search saat keyboard layar terbuka: input tidak zoom, hasil bisa scroll, close/Enter bekerja dan layout tidak pecah.
- [ ] Notifikasi bisa ditutup dengan target44px; reminder membuka About sheet. Banner tidak menutup area modal aktif.
- [ ] Notes/Mail/Finder/Trash tampil rapi dalam sheet; sidebar berubah menjadi bar horizontal.

## Build/deploy lokal

- [ ] Jalankan npm run build lalu npm run preview: semua gambar/cursor/UI assets terbaca.
- [ ] Set VITE_BASE=/designer/, build dan preview: asset tidak404.
- [ ] Sesudah push ke Vercel, cek custom subdomain dan cache header seperti config repo.
