<?php

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // API: Checkout pesanan dari keranjang kiosk
    // Total dihitung ulang berdasarkan harga terbaru di database
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_type'   => 'required|in:dine_in,take_away',
            'items'        => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.options'    => 'nullable|string',
        ]);

        try {
            $order = DB::transaction(function () use ($validated) {
                // Hitung total ulang dari harga database terkini (bukan dari klien)
                $totalPrice = 0;
                $orderItems = [];

                foreach ($validated['items'] as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    $subtotal = $product->price * $item['quantity'];
                    $totalPrice += $subtotal;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity'   => $item['quantity'],
                        'price'      => $product->price,
                        'options'    => $item['options'] ?? null,
                    ];
                }

                // Generate nomor antrean unik (#001, #002, ...)
                $lastOrder = Order::orderBy('id', 'desc')->first();
                $nextNumber = $lastOrder
                    ? intval(substr($lastOrder->order_number, 1)) + 1
                    : 1;
                $orderNumber = '#' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

                // Simpan pesanan + detail dalam satu transaksi
                $order = Order::create([
                    'order_number'  => $orderNumber,
                    'total_price'   => $totalPrice,
                    'payment_method' => 'cash',
                    'status'        => 'pending',
                    'order_type'    => $validated['order_type'],
                ]);

                foreach ($orderItems as $oi) {
                    $order->orderDetails()->create($oi);
                }

                return $order;
            });

            return response()->json([
                'success' => true,
                'order'   => $order->only(['id', 'order_number', 'total_price', 'status']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pesanan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
