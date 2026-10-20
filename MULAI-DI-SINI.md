# Fase 4 — replacement interaksi

Baseline: mac-os-perdana.zip terbarumu. Tetap Vite + React JSX, satu stylesheet CSS, dan framer-motion. Tidak ada dependency baru.

## Pasang di VS Code

1. Buat salinan folder project.
2. Salin folder src/ dalam paket ke root project yang sudah memiliki package.json. Gabungkan folder dan replace file yang berubah. Ini folder replacement, bukan project baru.
3. Salin LICENSE-THIRD-PARTY. Folder tests/ opsional untuk pemeriksaan logika.
4. Jika kamu mengedit lagi setelah mengirim ZIP, gabungkan perubahan melalui REPLACEMENTS.md atau changes.patch.
5. Jalankan `npm run dev`. Build: `npm run build`. Pemeriksaan logika: `node tests/interactions.mjs`.

Alternatif: `git apply --check /path/ke/changes.patch`, lalu `git apply /path/ke/changes.patch` bila pemeriksaan lolos. Patch sudah diuji terhadap baseline ZIP unggahan.

Wallpaper WebP, enam SVG Dock milikmu, projects.js, dan komponen Notes/Mail/Gallery/MenuBar/Thumbnail tidak diubah. Stylesheet replacement mempertahankan menu transparan dan aturan unggahan, dengan penyesuaian interaksi. Profile.js mempertahankan isian unggahan serta menambah konfigurasi/ikon Finder dan Trash.

## Fullscreen

- Hijau atau double-click title bar mengisi viewport halaman: x=0, y=0, lebar/tinggi layar, tanpa border/radius.
- Window berada di atas menu dan Dock. Ini fullscreen halaman, bukan F11 browser.
- Hijau atau Esc pertama mengembalikan ukuran/posisi tersimpan. Esc berikutnya pada window biasa menutup window.
- Fokus/membuka window lain mengembalikan window fullscreen sebelumnya ke frame normal.
- Minimize dari fullscreen mempertahankan statusnya saat dibuka kembali.
- Tab tetap berada dalam window fullscreen; traffic lights tetap tersedia.

## Resize

Tarik keempat sisi atau keempat sudut. Minimum project/Mail/Trash 360 × 240; Notes/Gallery/Finder 480 × 240, menyesuaikan jika viewport lebih kecil. Window normal tetap dalam area menu–Dock; resize nonaktif saat fullscreen.

Handle adalah button: Tab ke handle, gunakan arrow untuk perubahan 10px, Shift+arrow untuk 40px pada sisi terkait. Hasil resize disimpan sehingga maximize → restore kembali ke ukuran tersebut.

## Finder

Finder baru ada di paling kiri Dock. Ia menjelajahi data portfolio, bukan drive komputer pengunjung.

- Projects: folder kategori otomatis dari projects.js.
- Desktop: semua proyek yang masih tersedia.
- Applications: app Dock yang bisa dibuka.
- Trash: isi yang sama dengan app Trash.

Desktop: klik memilih, double-click/Enter membuka. Mobile: satu tap membuka. Back/Forward, breadcrumb, search folder, Icons/List, dan status jumlah item berfungsi.

Pilih proyek lalu Move to Trash atau Delete/Backspace saat tombol file fokus. Folder kategori dan aplikasi tidak dibuang.

## Trash virtual

Memindahkan proyek ke Trash menyembunyikannya dari Desktop/Gallery/Finder dan menutup window proyek tersebut. Put Back mengembalikan satu, Put Back All mengembalikan semuanya. Empty Trash memiliki langkah konfirmasi.

Status tersimpan pada sessionStorage tab ini dan bertahan saat refresh. Empty Trash menyembunyikan item untuk sesi tab tersebut; source dan gambar asli tidak dihapus. Reset demo dari console browser:

```js
sessionStorage.removeItem('perdana.files.v1');
location.reload();
```

## Dock

Width/height ikon dan lebar slot tombol kini membesar bersama. Tetangga bergeser dan background glass memakai width: max-content mengikuti isi. Pengukuran memakai pusat layout dasar, bukan posisi ikon yang sedang berubah. Spring 460/30/0.45 dan magnifikasi maksimum 1.45 dipertahankan.

iconScale dan iconScaleMobile tetap bisa diatur di dockApps; slot menyediakan ruang tambahan untuk artwork yang diperbesar. Bounce, tooltip, divider, dot, dan fallback tetap ada. Reduce Motion menonaktifkan magnifikasi/bounce.

Mobile tidak memakai magnifikasi. Delapan ikon diakses lewat Dock horizontal yang bisa digeser, dengan target minimal 44px.

Ikon baru yang dapat diganti:

- src/assets/dock/finder.svg
- src/assets/dock/trash.svg
- src/assets/dock/trash-full.svg

Ketiganya SVG placeholder original. Trash berganti ikon ketika berisi item. Untuk PNG, ubah import terkait di profile.js.

## Verifikasi

Build `/` dan `/designer/` lolos. Tes logika mencakup 200 kasus resize, frame restore/fokus/fullscreen, siklus Trash, dan ruang slot Dock. Static render memeriksa Finder/Trash, delapan app, delapan handle normal, serta geometri fullscreen. Seluruh 35 aset tersambung pada kedua base. Aset lama identik byte-for-byte. Patch juga telah diterapkan pada salinan baseline dan menghasilkan replacement identik.

Uji visual/pointer/gesture browser nyata belum dilakukan di lingkungan ini. Gunakan CHECKLIST.md di Chrome, Safari Mac, dan ponsel asli. Kita masih di fase 4.
