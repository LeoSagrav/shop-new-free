<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use BelongsToTenant;

    //
    protected $fillable = [
        'empresa_id',
        'nombre',
        'precio',
        'stock',
        'imagen'
    ];


    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_productos')
                    ->withPivot('cantidad')
                    ->withTimestamps();
    }
}
