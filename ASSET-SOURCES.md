# Sumber dan replacement assets

## Baseline
Repository: https://github.com/perdanakun/mac-perdanakun
Commit: d9e922daf72e1aa4d374969ba21312767c08c140
Foto, proyek dan ikon Dock yang sudah ada dipertahankan tanpa perubahan byte.

## Referensi visual
Figma: https://www.figma.com/design/T81yoykT6VTciQyk1Pzt6n/macOS-27--Community-
Studi UI: ZIP macos-27-ui-study(1).zip yang dilampirkan.
Window/material/button/sidebar/alert digunakan sebagai referensi proporsi dan hierarki. Tidak ada font, wallpaper atau ikon aplikasi baru dari kit yang dimasukkan.

## Ikon tambahan
src/assets/ui/:34 SVG placeholder original yang dibuat untuk proyek, termasuk folder-color.svg dan logo monogram brand.svg.
Mapping mudah diganti melalui uiIcons di src/data/profile.js.

## Pointer yang diminta
Diekspor utuh dari halaman Pointers207:14474, tanpa menggambar ulang paths.

| File | Node Figma | Hotspot CSS |
|---|---|---|
| default.svg | 2302:7077 | 14 13 |
| pointer.svg | 2302:7081 | 14 12 |
| grab.svg | 2302:7080 | 14 14 |
| grabbing.svg | 2302:7078 | 14 14 |
| text.svg | 2302:7093 | 14 14 |
| resize-ns.svg | 2302:7090 | 14 14 |
| resize-ew.svg | 2302:7092 | 14 14 |
| resize-nesw.svg | 2302:7088 | 14 14 |
| resize-nwse.svg | 2302:7091 | 14 14 |
| move.svg | 2302:7082 | cadangan |
| zoom-in.svg | 2302:7094 | cadangan |
| zoom-out.svg | 2302:7095 | cadangan |

SVG menggunakan dimensi ekspor28px; arrow dan pointing juga menyertakan area ekstensi29/31px.
Hotspot disetel untuk CSS dan perlu diperiksa di browser/OS target.
Teks lisensi yang disertakan kit ada di licenses/Apple-Design-Resources.txt. Pointer merupakan aset kit, tidak dicakup MIT alanagoyal.

## Logic terdahulu
Atribusi alanagoyal.com dan lisensi MIT di LICENSE-THIRD-PARTY repo dipertahankan. Refine ini tidak mengganti lisensi aset pihak lain.


## Pembaruan appearance / notifikasi
Delapan glyph tambahan original: wifi, battery, control-center, sun, moon, auto, message, bell. Tidak ada ikon Dock baru yang diambil dari sistem atau Figma pada pembaruan ini. Ukuran Dock disesuaikan dengan screenshot yang kamu lampirkan; glass merupakan pendekatan CSS.
