<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    //
    protected $fillable = [
        'cliente',
        'celular',
        'departamento',
        'pais'
    ];

    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_productos')
                    ->withPivot('cantidad')
                    ->withTimestamps();
    }
}
