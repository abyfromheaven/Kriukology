/**
 * ==========================================================================
 * TEMPLATE: LAYAR STRUK DIGITAL
 * ==========================================================================
 * Struk cetak Kriukology. Mengikuti sketsa struk:
 * 1. Kop: logo + banner monokrom + alamat
 * 2. Nomor Pesanan (KL-00, berurutan)
 * 3. Tipe pesanan (DINE IN / TAKE AWAY) + tanggal server
 * 4. Rincian produk: jumlah | nama | harga satuan
 * 5. Total pembayaran + metode pembayaran
 * 6. Ucapan terima kasih
 *
 * Bentuknya ramping dan memanjang ke bawah seperti struk thermal sungguhan.
 * Semua teks diperbesar supaya mudah dibaca dari jauh di layar kiosk.
 * Countdown ada di bawah kartu.
 * ==========================================================================
 */

const templateStruk = `
<div data-screen="struk" style="display:none" data-action="lewatiStruk" class="h-full overflow-y-auto scroll-clean cursor-pointer">

  <div class="struk-wrap flex flex-col items-center justify-center gap-6 min-h-full px-5 py-4">

    <!-- ── KARTU STRUK ─────────────────────────────────────────── -->
    <div class="struk-kartu struk-font w-full max-w-[380px] flex flex-col bg-white text-black rounded-2xl px-6 py-6 shadow-xl">

      <!-- 1. Kop: logo + banner monokrom + alamat -->
      <div class="struk-baris">
        <div class="struk-kop flex items-center justify-center gap-2.5">
          <img src="/assets/kriukology/logo1.webp" alt="Kriukology"
            class="struk-logo h-14 w-14 object-contain" />
          <img src="/assets/kriukology/banner_kriukology.webp" alt="Kriukology"
            class="struk-logo h-8 max-w-[190px] object-contain" />
        </div>
        <p class="struk-alamat mt-2.5 text-center leading-snug" data-bind="strukAlamat"></p>
      </div>

      <!-- 2. Nomor Pesanan -->
      <div class="struk-baris mt-6 text-center">
        <p class="text-[15px] leading-tight" data-text="orderNumberLabel">Nomor Pesanan:</p>
        <p class="struk-nomor text-[36px] font-bold leading-tight mt-1" data-bind="nomorAntrean"></p>
      </div>

      <!-- 3. Tipe pesanan + tanggal, lalu garis putus-putus -->
      <div class="struk-baris mt-5">
        <div class="flex items-baseline justify-between gap-3 pb-2">
          <span class="struk-tipe text-[15px] font-bold" data-bind="strukTipe"></span>
          <span class="struk-tanggal text-[15px]" data-bind="strukTanggal"></span>
        </div>
        <div class="struk-putus"></div>
      </div>

      <!-- 4. Rincian produk: jumlah | nama | harga satuan -->
      <div class="struk-baris py-3" data-list="strukItems"></div>

      <!-- 5. Total pembayaran + metode pembayaran (ditempel bawah kertas) -->
      <div class="struk-baris mt-auto pt-6">
        <p class="text-center text-[15px] pb-2" data-text="totalPayment">TOTAL PEMBAYARAN</p>
        <div class="struk-putus mb-2"></div>
        <p class="struk-total text-center text-[30px] font-bold" data-bind="totalHargaStruk"></p>
        <p class="struk-metode text-center text-[15px] mt-1" data-bind="strukMetode"></p>
      </div>

      <!-- 6. Ucapan -->
      <div class="struk-baris mt-6 text-center">
        <p class="text-[15px] leading-snug" data-text="strukThanks">Terima Kasih Telah Berbelanja!</p>
        <p class="struk-alamat mt-2 text-[14px] leading-snug" data-text="strukBranch">Kriukology Jalan Baru Citeureup</p>
      </div>

    </div>

    <!-- ── COUNTDOWN DI BAWAH STRUK ─────────────────────────────── -->
    <p class="struk-countdown text-center text-[15px] leading-relaxed" data-bind="strukCountdown"></p>

  </div>

</div>
`

export default templateStruk
