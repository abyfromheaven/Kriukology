<?php

/*
|--------------------------------------------------------------------------
| Pesan Validasi Bahasa Indonesia
|--------------------------------------------------------------------------
|
| Hanya memuat aturan yang dipakai project ini (Produk & Kategori di CMS).
| Aturan lain otomatis jatuh ke APP_FALLBACK_LOCALE=en, sehingga tidak
| pernah tampil sebagai kunci mentah seperti "validation.max.string".
|
*/

return [
    'required' => ':attribute wajib diisi.',
    'string' => ':attribute harus berupa teks.',
    'integer' => ':attribute harus berupa angka bulat.',
    'min' => [
        'numeric' => ':attribute minimal :min.',
        'string' => ':attribute minimal :min karakter.',
        'array' => ':attribute harus memiliki minimal :min item.',
    ],
    'max' => [
        'numeric' => ':attribute maksimal :max.',
        'string' => ':attribute maksimal :max karakter.',
        'array' => ':attribute harus memiliki maksimal :max item.',
        'file' => ':attribute maksimal :max kilobyte.',
    ],
    'exists' => ':attribute yang dipilih tidak valid.',
    'image' => ':attribute harus berupa gambar.',
    'size' => [
        'string' => ':attribute harus berisi :size karakter.',
        'numeric' => ':attribute harus bernilai :size.',
        'file' => ':attribute harus berukuran :size kilobyte.',
    ],
    'array' => ':attribute harus berupa daftar.',
    'in' => ':attribute yang dipilih tidak valid.',
    'regex' => 'Format :attribute tidak valid.',

    'attributes' => [
        'name' => 'nama produk',
        'category_id' => 'kategori',
        'price' => 'harga',
        'stock' => 'stok',
        'image' => 'gambar',
        'label_id' => 'nama kategori',
        'label_en' => 'nama kategori (English)',
        'icon' => 'icon',
        'emoji' => 'emoji',
        'sort_order' => 'urutan',
        'token' => 'token pesanan',
        'items' => 'item pesanan',
    ],
];
