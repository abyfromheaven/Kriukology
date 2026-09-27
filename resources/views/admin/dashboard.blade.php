<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#e31d2f" />
    <title>Kriukology — POS & KDS Admin</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        :root {
            --font-sans: 'Geist', ui-sans-serif, system-ui, sans-serif;
        }
        * { box-sizing: border-box; }
        body { font-family: var(--font-sans); background: #f6f1e8; color: #2a2424; margin: 0; }
        @font-face {
            font-family: 'Geist';
            font-style: normal;
            font-weight: 100 900;
            font-display: swap;
            src: url('/Geist/Geist-VariableFont_wght.ttf') format('truetype');
        }
        .header-belang {
            background-image: repeating-linear-gradient(90deg, #d51f32 0 26px, #ffffff 26px 52px);
        }
        .grid-noise {
            background-image: linear-gradient(#ffffff0d 1px, transparent 1px),
                              linear-gradient(90deg, #ffffff0d 1px, transparent 1px);
            background-size: 24px 24px;
        }
        @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
            70% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .pulse-green { animation: pulse-ring 1.5s infinite; }
        @keyframes bounce-denut {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .denut { animation: bounce-denut 0.8s ease-in-out infinite; }
        .modal-overlay { background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
    </style>
</head>
<body x-data="adminDashboard()" class="min-h-screen">

    <!-- ── Header Belang Merah/Putih ──────────────────────────────── -->
    <header class="header-belang h-2"></header>

    <!-- ── Top Bar ─────────────────────────────────────────────────── -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#d51f32] flex items-center justify-center">
                    <span class="text-white text-xl font-black">K</span>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-[#d51f32] leading-tight">Kriukology</h1>
                    <p class="text-xs text-gray-500">POS & KDS Admin Dashboard</p>
                </div>
            </div>

            <!-- Tab Navigation -->
            <nav class="flex gap-1 bg-gray-100 rounded-xl p-1">
                <button @click="activeTab = 'crud'"
                    :class="activeTab === 'crud' ? 'bg-white shadow text-[#d51f32]' : 'text-gray-500 hover:text-gray-700'"
                    class="px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
                    <i class="fa-solid fa-box-open"></i> Kelola Produk
                </button>
                <button @click="activeTab = 'kds'"
                    :class="activeTab === 'kds' ? 'bg-white shadow text-[#d51f32]' : 'text-gray-500 hover:text-gray-700'"
                    class="px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 relative">
                    <i class="fa-solid fa-fire-burner"></i> Dapur (KDS)
                    <span x-show="kdsCount > 0" x-text="kdsCount"
                        class="absolute -top-1 -right-1 w-5 h-5 bg-[#d51f32] text-white text-[10px] rounded-full flex items-center justify-center font-bold"></span>
                </button>
                <button @click="activeTab = 'lobby'"
                    :class="activeTab === 'lobby' ? 'bg-white shadow text-[#d51f32]' : 'text-gray-500 hover:text-gray-700'"
                    class="px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
                    <i class="fa-solid fa-tv"></i> Monitor Lobi
                </button>
            </nav>

            <div class="flex items-center gap-3">
                <span class="text-xs text-gray-400" x-text="currentTime"></span>
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="fa-solid fa-user text-gray-500 text-sm"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- ── Flash Message ───────────────────────────────────────────── -->
    @if(session('success'))
    <div class="max-w-[1600px] mx-auto px-6 pt-4">
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <i class="fa-solid fa-circle-check"></i> {{ session('success') }}
        </div>
    </div>
    @endif

    <main class="max-w-[1600px] mx-auto px-6 py-6">

        <!-- ══════════════════════════════════════════════════════════
             TAB 1: CRUD PRODUK
        ═══════════════════════════════════════════════════════════ -->
        <section x-show="activeTab === 'crud'" x-cloak>
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Kelola Produk</h2>
                    <p class="text-sm text-gray-500">Tambah, hapus, dan atur ketersediaan menu Kriukology</p>
                </div>
                <button @click="showModal = true"
                    class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm">
                    <i class="fa-solid fa-plus"></i> Tambah Menu Baru
                </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gambar</th>
                            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Menu</th>
                            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($products as $product)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-5 py-3">
                                <img src="{{ $product->image }}" alt="{{ $product->name }}"
                                    class="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                    onerror="this.src='/assets/menu-placeholder.svg'">
                            </td>
                            <td class="px-5 py-3 font-medium text-gray-800">{{ $product->name }}</td>
                            <td class="px-5 py-3">
                                <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold
                                    {{ $product->category === 'promotion' ? 'bg-red-100 text-red-700' : '' }}
                                    {{ $product->category === 'chicken' ? 'bg-amber-100 text-amber-700' : '' }}
                                    {{ $product->category === 'burger' ? 'bg-orange-100 text-orange-700' : '' }}
                                    {{ $product->category === 'snack' ? 'bg-yellow-100 text-yellow-700' : '' }}
                                    {{ $product->category === 'beverage' ? 'bg-blue-100 text-blue-700' : '' }}
                                    {{ $product->category === 'kids' ? 'bg-pink-100 text-pink-700' : '' }}
                                    {{ $product->category === 'dessert' ? 'bg-purple-100 text-purple-700' : '' }}
                                    {{ $product->category === 'box' ? 'bg-emerald-100 text-emerald-700' : '' }}
                                    {{ $product->category === 'bucket' ? 'bg-cyan-100 text-cyan-700' : '' }}
                                    {{ $product->category === 'lto' ? 'bg-indigo-100 text-indigo-700' : '' }}
                                    {{ $product->category === 'breakfast' ? 'bg-teal-100 text-teal-700' : '' }}">
                                    {{ $product->category }}
                                </span>
                            </td>
                            <td class="px-5 py-3 font-semibold text-gray-800">Rp {{ number_format($product->price, 0, ',', '.') }}</td>
                            <td class="px-5 py-3">
                                <span class="inline-flex items-center gap-1 text-xs font-semibold
                                    {{ $product->is_available ? 'text-green-600' : 'text-red-500' }}">
                                    <span class="w-2 h-2 rounded-full {{ $product->is_available ? 'bg-green-500' : 'bg-red-500' }}"></span>
                                    {{ $product->is_available ? 'Tersedia' : 'Habis' }}
                                </span>
                            </td>
                            <td class="px-5 py-3">
                                <div class="flex items-center gap-2">
                                    <form action="{{ route('admin.products.availability', $product) }}" method="POST">
                                        @csrf @method('PATCH')
                                        <button class="px-3 py-1.5 rounded-lg text-xs font-semibold
                                            {{ $product->is_available ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200' }} transition">
                                            {{ $product->is_available ? 'Tandai Habis' : 'Aktifkan' }}
                                        </button>
                                    </form>
                                    <form action="{{ route('admin.products.destroy', $product) }}" method="POST"
                                        onsubmit="return confirm('Yakin hapus produk ini?')">
                                        @csrf @method('DELETE')
                                        <button class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition">
                                            <i class="fa-solid fa-trash"></i> Hapus
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </section>

        <!-- ══════════════════════════════════════════════════════════
             TAB 2: KDS — KITCHEN DISPLAY SYSTEM
        ═══════════════════════════════════════════════════════════ -->
        <section x-show="activeTab === 'kds'" x-cloak>
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Kitchen Display System</h2>
                    <p class="text-sm text-gray-500">Pantau dan proses pesanan masuk secara real-time</p>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span class="w-2.5 h-2.5 rounded-full bg-green-500 pulse-green"></span>
                    Auto-refresh aktif
                </div>
            </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                @forelse($orders ?? collect() as $order)
                <div class="bg-white rounded-2xl shadow-sm border-2
                    {{ $order->status === 'pending' ? 'border-amber-300' : 'border-green-300' }} overflow-hidden">
                    <!-- Card Header -->
                    <div class="px-4 py-3 flex items-center justify-between
                        {{ $order->status === 'pending' ? 'bg-amber-50' : 'bg-green-50' }}">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl font-black {{ $order->status === 'pending' ? 'text-amber-600' : 'text-green-600' }}">
                                {{ $order->order_number }}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                                {{ $order->order_type === 'dine_in' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700' }}">
                                {{ $order->order_type === 'dine_in' ? 'Dine In' : 'Take Away' }}
                            </span>
                        </div>
                        <span class="text-[10px] text-gray-400 font-medium">
                            {{ $order->created_at->diffForHumans(short: true) }}
                        </span>
                    </div>

                    <!-- Card Body: Detail Items -->
                    <div class="px-4 py-3 space-y-2">
                        @foreach($order->orderDetails as $detail)
                        <div class="flex items-start gap-2 text-sm">
                            <span class="font-bold text-gray-700 min-w-[24px]">{{ $detail->quantity }}x</span>
                            <div>
                                <p class="font-medium text-gray-800">{{ $detail->product->name ?? 'Produk' }}</p>
                                @if($detail->options)
                                <p class="text-xs text-amber-600 mt-0.5">{{ $detail->options }}</p>
                                @endif
                            </div>
                        </div>
                        @endforeach
                    </div>

                    <!-- Card Footer: Action Button -->
                    <div class="px-4 py-3 border-t border-gray-100">
                        @if($order->status === 'pending')
                        <form action="{{ route('admin.orders.pay', $order) }}" method="POST">
                            @csrf @method('PATCH')
                            <button class="w-full py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center justify-center gap-2">
                                <i class="fa-solid fa-money-bill-wave"></i> Konfirmasi Bayar
                            </button>
                        </form>
                        @else
                        <form action="{{ route('admin.orders.complete', $order) }}" method="POST">
                            @csrf @method('PATCH')
                            <button class="w-full py-2.5 rounded-xl text-sm font-bold bg-green-600 hover:bg-green-700 text-white transition flex items-center justify-center gap-2">
                                <i class="fa-solid fa-check-double"></i> Selesai Masak
                            </button>
                        </form>
                        @endif
                    </div>
                </div>
                @empty
                <div class="col-span-full text-center py-20 text-gray-400">
                    <i class="fa-solid fa-fire-burner text-5xl mb-4 block opacity-30"></i>
                    <p class="text-lg font-medium">Tidak ada pesanan masuk</p>
                    <p class="text-sm">Pesanan dari kiosk akan muncul di sini secara otomatis</p>
                </div>
                @endforelse
            </div>
        </section>

        <!-- ══════════════════════════════════════════════════════════
             TAB 3: MONITOR LOBI (TV)
        ═══════════════════════════════════════════════════════════ -->
        <section x-show="activeTab === 'lobby'" x-cloak>
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Monitor Antrean Lobi</h2>
                    <p class="text-sm text-gray-500">Pantau dan panggil nomor antrean pelanggan</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-6">
                <!-- Kolom Kiri: Sedang Diproses -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                        <h3 class="text-white font-bold text-lg flex items-center gap-2">
                            <i class="fa-solid fa-fire-burner"></i> SEDANG DIPROSES
                        </h3>
                        <p class="text-green-100 text-xs mt-0.5">Pesanan sedang dimasak di dapur</p>
                    </div>
                    <div class="p-6 min-h-[300px]">
                        <div class="grid grid-cols-3 gap-3">
                            @forelse($diproses ?? collect() as $order)
                            <div class="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                                <span class="text-3xl font-black text-green-600 block">{{ $order->order_number }}</span>
                                <span class="text-xs text-green-500 font-medium mt-1 block">{{ $order->order_type === 'dine_in' ? 'Dine In' : 'Take Away' }}</span>
                            </div>
                            @empty
                            <div class="col-span-3 text-center py-10 text-gray-300">
                                <i class="fa-solid fa-clock text-3xl mb-2 block"></i>
                                <p class="text-sm">Belum ada antrean</p>
                            </div>
                            @endforelse
                        </div>
                    </div>
                </div>

                <!-- Kolom Kanan: Silakan Ambil -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="bg-gradient-to-r from-[#d51f32] to-red-700 px-6 py-4">
                        <h3 class="text-white font-bold text-lg flex items-center gap-2 denut">
                            <i class="fa-solid fa-bell"></i> SILAKAN AMBIL
                        </h3>
                        <p class="text-red-100 text-xs mt-0.5">Pesanan sudah siap diambil</p>
                    </div>
                    <div class="p-6 min-h-[300px]">
                        <div class="grid grid-cols-3 gap-3">
                            @forelse($siapAmbil ?? collect() as $order)
                            <div class="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                                <span class="text-3xl font-black text-[#d51f32] block">{{ $order->order_number }}</span>
                                <span class="text-xs text-red-400 font-medium mt-1 block">{{ $order->order_type === 'dine_in' ? 'Dine In' : 'Take Away' }}</span>
                            </div>
                            @empty
                            <div class="col-span-3 text-center py-10 text-gray-300">
                                <i class="fa-solid fa-box-open text-3xl mb-2 block"></i>
                                <p class="text-sm">Belum ada yang siap</p>
                            </div>
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tombol Panggil Antrean -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
                <button @click="panggilAntrean()"
                    class="bg-[#d51f32] hover:bg-red-700 text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center gap-3 mx-auto">
                    <i class="fa-solid fa-volume-high text-2xl"></i>
                    PANGGIL ANTREAN TERAKHIR
                </button>
                <p class="text-xs text-gray-400 mt-3">Memutar suara ding-dong ke speaker lobi</p>
            </div>
        </section>

    </main>

    <!-- ══════════════════════════════════════════════════════════
         MODAL: TAMBAH PRODUK BARU
    ═══════════════════════════════════════════════════════════ -->
    <div x-show="showModal" x-cloak
        class="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0">

        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            @click.outside="showModal = false"
            x-transition:enter="transition ease-out duration-200"
            x-transition:enter-start="opacity-0 scale-95"
            x-transition:enter-end="opacity-100 scale-100">

            <div class="header-belang h-2"></div>

            <div class="p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-xl font-bold text-gray-800">Tambah Menu Baru</h3>
                    <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition">
                        <i class="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
                    @csrf

                    <!-- Nama -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Menu</label>
                        <input type="text" name="name" required placeholder="Contoh: Ayam Krispi Pedas"
                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#d51f32] focus:ring-2 focus:ring-[#d51f32]/20 outline-none transition text-sm" />
                        @error('name')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Harga -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga (Rp)</label>
                        <input type="number" name="price" required min="0" placeholder="Contoh: 25000"
                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#d51f32] focus:ring-2 focus:ring-[#d51f32]/20 outline-none transition text-sm" />
                        @error('price')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Kategori -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                        <select name="category" required
                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#d51f32] focus:ring-2 focus:ring-[#d51f32]/20 outline-none transition text-sm bg-white">
                            <option value="promotion">Promotion</option>
                            <option value="lto">Limited Time Offer</option>
                            <option value="chicken">Chicken</option>
                            <option value="box">Box</option>
                            <option value="bucket">Bucket & Sharing</option>
                            <option value="burger">Bowl / Burger</option>
                            <option value="snack">Snack / Sides</option>
                            <option value="beverage">Beverage</option>
                            <option value="kids">Kids Meal</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="dessert">Dessert</option>
                        </select>
                        @error('category')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Upload Gambar -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Gambar Produk</label>
                        <input type="file" name="image" accept="image/jpeg,image/png,image/webp"
                            class="w-full px-4 py-2.5 rounded-xl border border-dashed border-gray-300 focus:border-[#d51f32] focus:ring-2 focus:ring-[#d51f32]/20 outline-none transition text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-[#d51f32] file:text-xs file:font-semibold" />
                        <p class="text-xs text-gray-400 mt-1">Format: JPG, PNG, WebP. Maks 2MB. Kosong = gambar default.</p>
                        @error('image')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Tombol Aksi -->
                    <div class="flex gap-3 pt-2">
                        <button type="button" @click="showModal = false"
                            class="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
                            Batal
                        </button>
                        <button type="submit"
                            class="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition">
                            Simpan Produk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // ── Data awal dari server (Blade → Alpine) ──────────────────
        const dataPesanan = @json($orders ?? []);
        const dataDiproses = @json($diproses ?? []);
        const dataSiapAmbil = @json($siapAmbil ?? []);

        function adminDashboard() {
            return {
                activeTab: 'crud',
                showModal: false,
                currentTime: '',
                orders: dataPesanan,
                diproses: dataDiproses,
                siapAmbil: dataSiapAmbil,
                get kdsCount() {
                    return this.orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
                },

                // Jam berjalan di top bar
                init() {
                    this.updateTime();
                    setInterval(() => this.updateTime(), 1000);
                    // Auto-refresh tiap 5 detik agar data KDS & Lobi selalu fresh
                    setInterval(() => this.muatUlangData(), 5000);
                },

                updateTime() {
                    this.currentTime = new Date().toLocaleTimeString('id-ID', {
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    });
                },

                // Fetch ulang data pesanan via AJAX (tanpa reload halaman)
                async muatUlangData() {
                    if (this.activeTab === 'kds' || this.activeTab === 'lobby') {
                        try {
                            const res = await fetch('{{ route("admin.data") }}');
                            if (res.ok) {
                                const data = await res.json();
                                if (data.orders) this.orders = data.orders;
                                if (data.diproses) this.diproses = data.diproses;
                                if (data.siapAmbil) this.siapAmbil = data.siapAmbil;
                            }
                        } catch (e) { /* skip jika offline */ }
                    }
                },

                // Panggil antrean: putar suara ding-dong via Web Audio API + POST ke server
                async panggilAntrean() {
                    this.mainkanDingDong();

                    try {
                        await fetch('{{ route("admin.lobby.call") }}', {
                            method: 'POST',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                        });
                    } catch (e) { /* tetap putar audio walau request gagal */ }
                },

                // Efek suara ding-dong (2 nada) via Web Audio API — tanpa file eksternal
                mainkanDingDong() {
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const t = ctx.currentTime;

                        // Nada pertama (tinggi)
                        const o1 = ctx.createOscillator();
                        const g1 = ctx.createGain();
                        o1.type = 'sine';
                        o1.frequency.setValueAtTime(880, t);
                        g1.gain.setValueAtTime(0.4, t);
                        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                        o1.connect(g1).connect(ctx.destination);
                        o1.start(t);
                        o1.stop(t + 0.5);

                        // Nada kedua (lebih tinggi, delay 0.35s)
                        const o2 = ctx.createOscillator();
                        const g2 = ctx.createGain();
                        o2.type = 'sine';
                        o2.frequency.setValueAtTime(1174.66, t + 0.35);
                        g2.gain.setValueAtTime(0.4, t + 0.35);
                        g2.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
                        o2.connect(g2).connect(ctx.destination);
                        o2.start(t + 0.35);
                        o2.stop(t + 1.0);
                    } catch (e) { /* abaikan jika browser tidak mendukung */ }
                },
            };
        }
    </script>

    <!-- Font Awesome untuk ikon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</body>
</html>
