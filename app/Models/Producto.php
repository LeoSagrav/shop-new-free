<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    //
    protected $fillable = [
        'empresa_id',
        'nombre',
        'precio',
        'stock',
        'imagen'
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_productos')
                    ->withPivot('cantidad')
                    ->withTimestamps();
    }
}
