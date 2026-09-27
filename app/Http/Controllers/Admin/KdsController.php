<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class KdsController extends Controller
{
    // Konfirmasi pembayaran tunai: pending -> paid
    public function konfirmasiBayar(Order $order)
    {
        if ($order->status === 'pending') {
            $order->update(['status' => 'paid']);
        }
        return redirect()->route('admin.dashboard')->with('success', 'Pembayaran dikonfirmasi!');
    }

    // Selesaikan pesanan: paid -> completed (hilang dari grid dapur)
    public function selesaikanPesanan(Order $order)
    {
        if ($order->status === 'paid') {
            $order->update(['status' => 'completed']);
        }
        return redirect()->route('admin.dashboard')->with('success', 'Pesanan selesai!');
    }
}
