<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;

class LobbyController extends Controller
{
    // Panggil antrean terakhir (putar suara ding-dong)
    public function panggilAntrean()
    {
        $antreanTerakhir = Order::where('status', 'paid')->orderBy('created_at')->last();

        if ($antreanTerakhir) {
            return response()->json([
                'success' => true,
                'nomor'   => $antreanTerakhir->order_number,
            ]);
        }

        return response()->json(['success' => false]);
    }
}
