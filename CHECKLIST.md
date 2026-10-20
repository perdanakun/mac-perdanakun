# Cek cepat

Checklist browser berikut belum dijalankan dalam lingkungan pengerjaan ini.

- [ ] Chrome dan Safari: header menyatu dengan wallpaper tanpa pita blur/solid pada Light/Dark; menu dan appearance tetap terbaca.
- [ ] Buka View → Hide Desktop Icons: thumbnail hilang; buka lagi View → Show Desktop Icons: kembali pada posisi drag terakhir.
- [ ] Saat ikon disembunyikan: Finder/Gallery/Spotlight tetap bisa membuka karya, window yang sudah terbuka tetap ada.
- [ ] Sembunyikan ikon, resize layar, tampilkan lagi: bounds tidak melewati menu atau Dock. Mobile tetap menampilkan grid.
- [ ] Tab dan Enter bisa menjalankan toggle; thumbnail tersembunyi tidak bisa menerima fokus. Esc menutup menu tanpa menutup window di belakangnya.
- [ ] Finder pada header semibold600; menu/body400 dan label500. Tidak ada heading/strong melonjak extra-bold.
- [ ] Dock berjarak16px + safe-area dari bawah; hover tetap membesarkan kaca dan ikon tanpa overlap. Drag/resize window tetap berhenti di atas Dock.
- [ ] Uji glass pada wallpaper detail/kontras dalam Light/Dark; Dock/sidebar/titlebar/alert/banner/popover lebih tembus dan blur. Isi dokumen tetap terbaca.
- [ ] Reduced motion/reduced transparency/forced-colors tetap berfungsi.
- [ ] Ponsel nyata: grid2kolom, Dock tidak menutupi karya, safe-area, sheet, search dan tombol close tetap berfungsi.
- [ ] npm run build dan preview root; ulangi dengan VITE_BASE=/designer/ bila memakai subpath.
