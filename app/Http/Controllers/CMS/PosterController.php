<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Poster;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Kelola media screensaver kiosk: poster (gambar) maupun video.
 *
 * Satu entri = satu file. Field `image` dipakai untuk keduanya supaya
 * tidak perlu dua kolom; `type` yang menentukan cara menampilkannya.
 */
class PosterController extends Controller
{
    /** Batas ukuran gambar: 2 MB */
    private const MAKS_GAMBAR_KB = 2048;

    /** Batas ukuran video: 20 MB */
    private const MAKS_VIDEO_KB = 20480;

    /** Batas payload base64 (±1,4× ukuran asli) */
    private const MAKS_PAYLOAD_KB = 28160;

    private const EKSTENSI_VIDEO = ['mp4', 'webm', 'ogg', 'ogv'];

    public function index(): JsonResponse
    {
        return response()->json(Poster::orderBy('sort_order')->orderBy('id')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'type'       => 'nullable|in:image,video',
            'image'      => ['required', 'string', 'max:'.self::MAKS_PAYLOAD_KB],
            'sort_order' => 'nullable|integer|min:0|max:9999',
        ]);

        $type = $validated['type'] ?? $this->deteksiTipe($validated['image']);

        $poster = Poster::create([
            'name'       => $validated['name'],
            'type'       => $type,
            'image'      => $this->simpanBerkas($validated['image'], $type),
            'sort_order' => $validated['sort_order'] ?? (int) Poster::max('sort_order') + 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Media berhasil ditambahkan',
            'poster'  => $poster,
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $poster = Poster::findOrFail($id);

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'type'       => 'nullable|in:image,video',
            'image'      => ['nullable', 'string', 'max:'.self::MAKS_PAYLOAD_KB],
            'sort_order' => 'nullable|integer|min:0|max:9999',
        ]);

        $poster->name = $validated['name'];
        $type = $validated['type'] ?? $poster->type;

        // Ganti berkas hanya kalau memang ada file baru yang dikirim
        if (!empty($validated['image']) && $validated['image'] !== $poster->image) {
            $poster->image = $this->simpanBerkas($validated['image'], $type);
        }
        $poster->type = $type;

        if (isset($validated['sort_order'])) {
            $poster->sort_order = $validated['sort_order'];
        }
        $poster->save();

        return response()->json([
            'success' => true,
            'message' => 'Media berhasil diperbarui',
            'poster'  => $poster->fresh(),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        Poster::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media berhasil dihapus',
        ]);
    }

    /** Tebak tipe dari isi string (dipakai kalau frontend tidak mengirim `type`) */
    private function deteksiTipe(string $value): string
    {
        if (preg_match('/^data:video\//', $value)) {
            return 'video';
        }

        return 'image';
    }

    /**
     * Simpan berkas. Menerima data URL base64 dari frontend. Kalau string-nya
     * bukan base64 (mis. path gambar bawaan), dipakai apa adanya.
     */
    private function simpanBerkas(string $value, string $type): string
    {
        if (!preg_match('/^data:(image|video)\/([\w.+-]+);base64,/', $value, $m)) {
            return $value;
        }

        $kategori = $m[1];                       // 'image' | 'video'
        $ekstensi = strtolower($m[2]);
        $decoded = base64_decode(substr($value, strpos($value, ',') + 1), true);

        if ($decoded === false) {
            return $value;
        }

        $batasKb = $kategori === 'video' ? self::MAKS_VIDEO_KB : self::MAKS_GAMBAR_KB;
        if (strlen($decoded) > $batasKb * 1024) {
            throw ValidationException::withMessages([
                'image' => 'Ukuran ' . ($kategori === 'video' ? 'video' : 'gambar')
                    . ' maksimal ' . round($batasKb / 1024) . ' MB.',
            ]);
        }

        if ($kategori === 'video' && !in_array($ekstensi, self::EKSTENSI_VIDEO, true)) {
            throw ValidationException::withMessages([
                'image' => 'Format video harus salah satu dari: ' . implode(', ', self::EKSTENSI_VIDEO) . '.',
            ]);
        }

        $folder = $kategori === 'video' ? 'videos' : 'posters';
        $filename = $folder . '/' . $folder . '_' . time() . '_' . Str::random(6) . '.' . $ekstensi;
        Storage::disk('public')->put($filename, $decoded);

        return Storage::url($filename);
    }
}
