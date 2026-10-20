# Transparent UI refine

Paket kecil lanjutan untuk **perdana-ui-light-dark-replacement.zip** yang sudah kamu pasang. Bukan proyek baru atau paket kumulatif dari repo lama.

## Pasang

1. Backup/commit kode yang sekarang.
2. Ekstrak ZIP, salin folder src/ ke root proyek (folder yang memiliki package.json), pilih Replace. Merge folder; jangan hapus src/ lama.
3. Ada lima file replacement lengkap: src/App.jsx, src/components/Desktop.jsx, src/components/MenuBar.jsx, src/data/profile.js dan src/styles.css.
4. Jalankan `npm run dev`, lalu `npm run build`.

Jangan menambahkan CSS di bawah file lama; ganti styles.css secara utuh. Tidak perlu dependency baru, mengganti assets, atau mengubah config Vite/Vercel.

Jika sudah mengedit bio/contact di profile.js setelah ZIP sebelumnya, pertahankan kontenmu dan cukup tambahkan item ini ke `profile.menuBar.menus` → View → items:

```js
{ label: 'Hide Desktop Icons', showLabel: 'Show Desktop Icons', action: 'toggle-desktop-icons' }
```

Alternatif Git: changes.patch ditujukan ke source dari ZIP Light/Dark sebelumnya. Dari root proyek, jalankan `git apply --check /path/changes.patch`, kemudian `git apply /path/changes.patch`. Pilih salah satu: copy replacement atau apply patch.

## Perubahan

- Header: background transparan, tanpa backdrop blur/border/shadow pada bar. Dropdown View/Appearance tetap memakai glass. Bayangan teks kecil tetap ada agar terbaca di foto.
- View → Hide Desktop Icons berubah menjadi Show Desktop Icons setelah diklik. Hanya thumbnail desktop disembunyikan; posisi drag, window terbuka dan akses karya melalui Finder/Gallery/Search dipertahankan. Show Desktop yang lama tetap meminimalkan window.
- Toggle berlaku selama halaman aktif dan reset saat reload. Mobile tetap menampilkan grid agar karya bisa diakses ketika menu desktop tidak tersedia.
- Font: regular400, medium500, semibold600. Finder/nama aktif di header turun800→600; menu/clock400, judul window/list/label500, heading utama maksimal600. Strong/bold bawaan browser tidak lagi melonjak700.
- Dock: gap bawah16px + safe-area di desktop/mobile, ukuran ikon dan magnification tetap seperti sebelumnya. Bounds thumbnail/window mengikuti ukuran Dock yang diukur.
- Glass: blur umum/Dock32px, kontrol kecil10px. Opacity Dock Light8%/Dark12%; sidebar Light35%/Dark32%; popover Light48%/Dark50%; notifikasi Light28%/Dark30%. Dialog/titlebar memakai material lebih tipis juga.
- Parent window dibuat clear ketika blur didukung supaya titlebar dapat mem-blur wallpaper/window di belakangnya. Panel konten/gambar tetap punya permukaan yang nyaman dibaca.

## Atur sendiri

Semua ada di src/styles.css:

```css
:root {
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --dock-bottom: 16px;
  --dock-blur: 32px;
  --glass-blur: 32px;
  --dock-surface: rgb(255 255 255 / .08);
}
```

Dark overrides ada di `:root[data-theme="dark"]`. --dock-bottom juga ada di media query mobile; ubah keduanya bila ingin gap berbeda. Nilai alpha material menentukan tint/transparansi; blur menentukan seberapa lembut detail di belakangnya. Glass CSS tetap merupakan pendekatan visual dari referensi, bukan refraction native1:1.

Jika OS/browser meminta reduced transparency atau tidak mendukung backdrop-filter, material glass memakai fallback solid. Header biasa tetap transparan. Forced-colors memakai warna sistem agar kontrol terbaca.

## Validasi

Lulus: build `/` dan `/designer/`, referensi asset, render statis seluruh app/menu/search, markup Desktop visible/hidden yang mempertahankan8thumbnail, serta tes existing200resizecases/fullscreen/focus/Trash/Dock dan tema/search.

Patch sudah diuji apply pada source ZIP sebelumnya dan hasil lima file cocok persis. Semua source lain, data karya, foto, ikon dan config tidak diubah.

Belum diuji langsung secara visual/interaktif di Chrome/Safari/ponsel. Gunakan CHECKLIST.md sebelum push. Tidak ada push/deploy otomatis.
