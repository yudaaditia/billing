<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Favorite;
use App\Menu;
use App\Kategori;
use App\Diskon;
use App\aktivitas;
use App\pesanan;
use App\detail_pesanan;
use App\Antrian;
use App\Detail_Antrian;

class Billing extends Controller
{
    public function favorite()
    {
    	return Favorite::with(['menu'])->get();
    }
    public function menu($kategoriId)
    {
    	return Menu::where('kategori_id', $kategoriId)->with(['favorite'])->orderBy('created_at', 'DESC')->get();
    }

    public function kategori()
    {
    	return Kategori::with(['menu'])->orderBy('created_at', 'ASC')->get();
    }

    public function diskon()
    {
        return Diskon::all();
    }

    public function aktivitas()
    {
        return  aktivitas::orderBy('created_at', 'desc')->first();
    }

    public function chargePesanan(Request $request)
    {
        
        $pesanan = $request->get('pes');
        $id = pesanan::create($pesanan);

        $billing = $request->get('billings');
        $aktivitas_id = $request->get('aktivitas_id');
        $billings = [];
        foreach($billing as $bill){
            $billings[] = [
                'pesanan_id'    => $id->id,
                'menu_id'       => $bill['id'],
                'aktivitas_id'  => $aktivitas_id,
                'jumlah'        => (int) $bill['jumlah'],
                'harga'         => (int) $bill['harga']
            ];
        }
        detail_pesanan::insert($billings);
        return response()->json($billings);
    }

    public function chargeDetailPesanan(Request $request)
    {
        
        $detail = $request->get('billings');
        $det = detail_pesanan::insert($detail);
        return response()->json($det);
    }

    public function addFavorite(Request $request)
    {
        $menuId = $request->get('menuId');
        $menu = Favorite::where('menu_id', $menuId)->first();
        if($menu)
        {
            $menu->delete();
            // dihapus
            return response()->json(false);
        } else {
            Favorite::create([
                'menu_id' => $menuId,
            ]);
            // di tambah
            return response()->json(true);
        }
    }

    public function search($search)
    {
        $menu = Menu::where('nama', 'like', '%' . $search . '%')->get();

        return response()->json($menu);
    }

    public function menusSearch()
    {
        $menus = Menu::all();

        return response()->json($menus);
    }

    public function addAntrian(Request $request)
    {
        $nama = $request->get('nama');
        $id   = Antrian::create([
                'nama' => $nama,
            ]);

        $billing = $request->get('billing');
        $billings = [];
        foreach($billing as $bill){
            $billings[] = [
                'antrian_id'    => $id['id'],
                'menu_id'       => $bill['id'],
                'nama'          => $bill['nama'],
                'jumlah'        => (int) $bill['jumlah'],
                'harga'         => (int) $bill['harga'],                    
                'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
                'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
            ];
        }
        Detail_Antrian::insert($billings);

        return response($billings);
    }

    public function editAntrian(Request $request)
    {
        $idAntrian = $request->get('idAntrian');
        $billing = $request->get('bill');
        Detail_Antrian::where('antrian_id', $idAntrian)->delete();
        Detail_Antrian::insert($billing);

        return response($idAntrian);
    }

    public function antrian()
    {
        return  Antrian::with(['detail_antrian'])->orderBy('created_at', 'ASC')->get();
    }

    public function removeAntrian(Request $request)
    {
        $id = $request->get('id');
        Antrian::destroy($id);
        Detail_Antrian::where('id', $id)->delete();
        return Antrian::with(['detail_antrian'])->orderBy('created_at', 'ASC')->get();;
    }

    public function removePisah(Request $request)
    {
        $billing = $request->get('tempBilling');
        $idAntrian = $request->get('idAntrian');
        $jumlah;
        foreach ($billing as $bill) {
            Detail_Antrian::where([ 
                ['menu_id', '=', $bill['id']],
                ['antrian_id', '=', $idAntrian]
            ])->decrement('jumlah', $bill['jumlah']);
            
            $jumlah = Detail_Antrian::where([ 
                    ['menu_id', '=', $bill['id']],
                    ['antrian_id', '=', $idAntrian]
                ])->first();               
            if($jumlah['jumlah'] == 0){
                Detail_Antrian::where([ 
                    ['menu_id', '=', $bill['id']],
                    ['antrian_id', '=', $idAntrian]
                ])->delete();
            }
        }
        
        return response($jumlah['jumlah']);
    }
}
