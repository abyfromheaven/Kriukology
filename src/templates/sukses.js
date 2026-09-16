/**
 * ==========================================================================
 * TEMPLATE: LAYAR SUKSES
 * ==========================================================================
 * Layar animasi singkat setelah pesanan berhasil.
 * ==========================================================================
 */

const templateSukses = `
<div data-screen="sukses" style="display:none" class="h-full bg-[#d51f32] grid-noise flex items-center justify-center text-white text-center p-8">
  <div class="animate__animated animate__zoomIn">
    <div class="h-20 w-20 mx-auto rounded-full border-4 border-[#f5bd27] flex items-center justify-center text-4xl">
      <i class="fa-solid fa-check"></i>
    </div>
    <h2 class="display text-5xl mt-7" data-bind="thankText"></h2>
    <p class="mt-3 font-medium text-white/80" data-bind="processingText"></p>
  </div>
</div>
`

export default templateSukses
