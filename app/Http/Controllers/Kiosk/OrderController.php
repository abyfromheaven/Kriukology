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
            'order_type'        => 'required|in:dine_in,take_away,dine,take',
            'payment_method'    => 'nullable|string',
            'items'             => 'required|array|min:1',
            'items.*.product_id'=> 'required|exists:products,id',
            'items.*.quantity'  => 'required|integer|min:1',
            'items.*.options'   => 'nullable|string',
        ]);

        // Normalisasi order_type
        $orderType = in_array($validated['order_type'], ['take_away', 'take']) ? 'take_away' : 'dine_in';
        $paymentMethod = $validated['payment_method'] ?? 'cash';

        try {
            $order = DB::transaction(function () use ($validated, $orderType, $paymentMethod) {
                $totalPrice = 0;
                $orderItems = [];

                foreach ($validated['items'] as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    // Cek ketersediaan stok
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Stok untuk produk '{$product->name}' tidak mencukupi (Tersisa: {$product->stock}).");
                    }

                    $subtotal = $product->price * $item['quantity'];
                    $totalPrice += $subtotal;

                    // Potong stok
                    $product->stock -= $item['quantity'];
                    if ($product->stock <= 0) {
                        $product->stock = 0;
                        $product->is_available = false;
                    }
                    $product->save();

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity'   => $item['quantity'],
                        'price'      => $product->price,
                        'options'    => $item['options'] ?? null,
                    ];
                }

                // Generate nomor pesanan berurutan (KL-01, KL-02, ...).
                // Pakai id pesanan terakhir + 1 supaya urutan selalu sama dengan
                // urutan pesanan masuk, bukan acak.
                $lastOrder = Order::orderBy('id', 'desc')->first();
                $nextNumber = $lastOrder ? $lastOrder->id + 1 : 1;
                $orderNumber = 'KL-' . str_pad((string) $nextNumber, 2, '0', STR_PAD_LEFT);

                // Simpan pesanan + detail dalam satu transaksi
                $order = Order::create([
                    'order_number'   => $orderNumber,
                    'total_price'    => $totalPrice,
                    'payment_method' => $paymentMethod,
                    'status'         => 'completed',
                    'order_type'     => $orderType,
                ]);

                foreach ($orderItems as $oi) {
                    $order->orderDetails()->create($oi);
                }

                return $order;
            });

            return response()->json([
                'success'      => true,
                'order_number' => $order->order_number,
                'order'        => $order->only(['id', 'order_number', 'total_price', 'status', 'payment_method']),
                // Tanggal/waktu server — struk cetak memakai ini, bukan jam
                // perangkat kiosk (bisa saja tidak sinkron).
                'server_date'  => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
