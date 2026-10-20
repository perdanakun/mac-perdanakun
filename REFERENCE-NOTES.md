# Referensi kode yang dibaca

Source: alanagoyal-main.zip sebelumnya, https://github.com/alanagoyal/alanagoyal (MIT).

| File | Temuan yang diterjemahkan |
| --- | --- |
| components/desktop/dock.tsx | Tombol memakai width = ukuran dasar × magnificationScale; slot ikut membesar dan padding berada pada perimeter. |
| components/desktop/window.tsx | Window maximized memakai posisi 0,0, ukuran viewport, tanpa radius, serta delapan resize handles. |
| lib/use-window-behavior.ts | Ref gesture, ukuran minimum, sisi berlawanan tetap, commit pada akhir resize. |
| lib/window-context.tsx | Fokus window lain mengembalikan window maximized sebelumnya. |
| components/apps/finder/finder-app.tsx | Sidebar, navigasi, grid/list, preview-open, dan Trash. Trash referensi adalah mock files; data tersebut tidak disalin. |
| lib/finder-path.ts / lib/finder-sort.ts | Struktur breadcrumb dan lokasi; portfolio memakai kategori dan urutan nama sederhana. |

Implementasi tetap JSX/CSS/framer-motion. Session Trash dan daftar proyek bersama dibuat khusus untuk portfolio ini. Komentar kredit berada pada kode terkait; MIT lengkap ada di LICENSE-THIRD-PARTY. Tidak ada Next.js, Tailwind, API, atau akses drive komputer yang dibawa masuk.
